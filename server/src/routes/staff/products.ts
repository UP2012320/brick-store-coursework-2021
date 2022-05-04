import {type BrickColours, type BrickTypes, type Inventory, type InventoryImages} from 'Types/types';
import {sendQuery, validatePermissions} from 'Utils/helpers';
import {type NewProduct, type UpdatedProduct} from 'api-types';
import {type FastifyPluginAsync} from 'fastify';
import {nanoid} from 'nanoid';
import {type PoolClient} from 'pg';
import slugify from 'slugify';
import {deleteImageFile, deleteImageFromDatabase} from '../staff/images';
import {deleteProductSchema, newProductSchema, updateProductSchema} from './products.schema';

const getTypeAndColourId = async (client: PoolClient, type?: string, colour?: string) => {
  let colourId: number | undefined;
  let typeId: number | undefined;

  if (colour) {
    const lowerColour = colour.toLowerCase().trim();
    const [colourCheckResult] = await sendQuery<BrickColours>(client,
      'SELECT * FROM brick_colours WHERE colour_name = $1',
      [lowerColour]);

    console.debug(colourCheckResult?.rows[0]);

    if (colourCheckResult) {
      if (colourCheckResult.rows.length === 0) {
        const [colourInsertResult] = await sendQuery<BrickColours>(client,
          'INSERT INTO brick_colours (colour_name) VALUES ($1) RETURNING *',
          [lowerColour]);

        if (colourInsertResult) {
          colourId = colourInsertResult.rows[0].colour_id;
        }
      } else {
        colourId = colourCheckResult.rows[0].colour_id;
      }
    }
  }

  if (type) {
    const lowerProduct = type.toLowerCase().trim();
    const [typeCheckResult] = await sendQuery<BrickTypes>(client,
      'SELECT * FROM brick_types WHERE type_name = $1',
      [lowerProduct]);

    if (typeCheckResult) {
      if (typeCheckResult.rows.length === 0) {
        const [typeInsertResult] = await sendQuery<BrickTypes>(client,
          'INSERT INTO brick_types (type_name) VALUES ($1) RETURNING *',
          [lowerProduct]);

        if (typeInsertResult) {
          typeId = typeInsertResult.rows[0].type_id;
        }
      } else {
        typeId = typeCheckResult.rows[0].type_id;
      }
    }
  }

  console.debug(`Type and colour IDs: ${typeId}, ${colourId}`);
  return [colourId, typeId];
};

const products: FastifyPluginAsync = async (fastify, options) => {
  fastify.addHook('preHandler', async (request, reply) => {
    validatePermissions(request, reply, ['write:products', 'update:products', 'delete:products']);
  });

  fastify.post<{ Body: { product: NewProduct, }, }>('/', {schema: newProductSchema}, async (request, reply) => {
    const {product} = request.body;

    if (product.price < 0) {
      reply.badRequest('newProduct.price is negative');
      return;
    }

    if (product.discount && product.discount < 0) {
      reply.badRequest('newProduct.discount is negative');
      return;
    }

    if (product.stock < 0) {
      reply.badRequest('newProduct.stock is negative');
      return;
    }

    const id = `${nanoid(5)}-${nanoid(5)}`;
    const slug = slugify(product.name);

    const result = await fastify.pg.transact(async (client) => {
      const [colour, type] = await getTypeAndColourId(client, product.type, product.colour);

      const [, inventoryInsertError] = await sendQuery(client, `
        INSERT INTO inventory (inventory_id, item_name, slug, description, colour, type, price, discount, stock, date_added, visible)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [id, product.name, slug, product.description, colour, type, product.price, product.discount, product.stock, new Date(), product.visibility]);

      if (inventoryInsertError?.code === '23505') {
        reply.badRequest('Product already exists');
        return false;
      } else if (inventoryInsertError) {
        reply.internalServerError('Error inserting product');
        return false;
      }

      if (product.images) {
        for (const image of product.images) {
          const [, imageError] = await sendQuery(client,
            `INSERT INTO inventory_images (inventory_id, image_id)
             VALUES ($1, $2)`,
            [id, image]);

          if (imageError) {
            reply.internalServerError();
            return false;
          }
        }
      }

      return true;
    });

    if (!result) {
      return;
    }

    reply.status(200).send({
      message: 'Product added',
    });
  });

  fastify.put<{ Body: { product: UpdatedProduct, }, }>('/', {schema: updateProductSchema}, async (request, reply) => {
    const {product} = request.body;

    const [result, error] = await sendQuery<Inventory>(fastify.pg.pool,
      `SELECT * FROM inventory
             WHERE inventory.inventory_id = $1`,
      [product.inventory_id]);

    if (error || !result) {
      reply.internalServerError('Error retrieving product');
      return;
    }

    if (result.rows.length === 0) {
      reply.notFound('Product not found');
      return;
    }

    const newSlug = slugify(product.name);

    const updateResult = await fastify.pg.transact(async (client) => {
      const [colour, type] = await getTypeAndColourId(client, product.type, product.colour);

      const [, updateError] = await sendQuery(client, `
        UPDATE inventory
        SET item_name   = $1,
            slug        = $2,
            description = $3,
            colour      = $4,
            type        = $5,
            price       = $6,
            discount    = $7,
            stock       = $8,
            visible     = $9
        WHERE inventory_id = $10
      `, [product.name, newSlug, product.description, colour, type, product.price, product.discount, product.stock, product.visibility, product.inventory_id]);

      if (updateError) {
        reply.internalServerError('Error updating product');
        return false;
      }

      const [existingImages, existingImagesError] = await sendQuery<InventoryImages>(client,
        `SELECT image_id as "imageId", inventory_id as "inventoryId" FROM inventory_images
             WHERE inventory_id = $1`,
        [product.inventory_id]);

      if (existingImagesError) {
        reply.internalServerError('Error retrieving existing images');
        return false;
      }

      if (existingImages?.rows && product.images) {
        const deletedImages = existingImages.rows.filter((image) => !product.images?.includes(image.imageId));

        for (const image of deletedImages) {
          const fileDeleteResult = await deleteImageFile(image.imageId);

          if (!fileDeleteResult) {
            reply.internalServerError('Error deleting image');
            return false;
          }

          const databaseDeleteResult = await deleteImageFromDatabase(client, image.imageId);

          if (!databaseDeleteResult) {
            reply.internalServerError('Error deleting image from database');
            return false;
          }
        }

        const newImages = product.images.filter((image) => !existingImages.rows.some((existingImage) => existingImage.imageId === image));

        for (const image of newImages) {
          const [, imageError] = await sendQuery<InventoryImages>(client,
            `INSERT INTO inventory_images (inventory_id, image_id)
                 VALUES ($1, $2)
                 RETURNING *`,
            [product.inventory_id, image]);

          if (imageError) {
            reply.internalServerError('Error adding new image');
            return false;
          }
        }
      }

      return true;
    });

    if (!updateResult) {
      return;
    }

    reply.status(200).send({
      message: 'Product updated',
    });
  });

  fastify.delete<{Params: {id: string, }, }>('/:id', {schema: deleteProductSchema}, async (request, reply) => {
    const {id} = request.params;

    const result = await fastify.pg.transact(async (client) => {
      const [deleteResult, deleteError] = await sendQuery(client, `
        DELETE FROM inventory
        WHERE inventory_id = $1
      `, [id]);

      if (deleteError || !deleteResult) {
        reply.internalServerError('Error deleting product');
        return false;
      }

      if (deleteResult.rowCount === 0) {
        reply.notFound('Product not found');
        return false;
      }

      const [existingImages, existingImagesError] = await sendQuery<InventoryImages>(client,
        `SELECT * FROM inventory_images
             WHERE inventory_id = $1`,
        [id]);

      if (existingImagesError) {
        reply.internalServerError('Error retrieving existing images');
        return false;
      }

      if (existingImages?.rows) {
        for (const image of existingImages.rows) {
          const fileDeleteResult = await deleteImageFile(image.imageId);

          if (!fileDeleteResult) {
            reply.internalServerError('Error deleting image');
            return false;
          }

          const databaseDeleteResult = await deleteImageFromDatabase(client, image.imageId);

          if (!databaseDeleteResult) {
            reply.internalServerError('Error deleting image from database');
            return false;
          }
        }

        const [deleteImagesResult, deleteImagesError] = await sendQuery(client, `
        DELETE FROM inventory_images
        WHERE inventory_id = $1
      `, [id]);

        if (deleteImagesError || !deleteImagesResult) {
          reply.internalServerError('Error deleting product images');
          return false;
        }
      }

      return true;
    });

    if (!result) {
      return;
    }

    reply.status(200).send({
      message: 'Product deleted',
    });
  });
};

export default products;
