import {type BrickColours, type BrickTypes} from 'Types/types';
import {sendQuery, validatePermissions} from 'Utils/helpers';
import {type NewProduct} from 'api-types';
import {type FastifyPluginAsync} from 'fastify';
import {nanoid} from 'nanoid';
import slugify from 'slugify';

const products: FastifyPluginAsync = async (fastify, options) => {
  fastify.addHook('preValidation', fastify.authenticate);
  fastify.addHook('preHandler', async (request, reply) => {
    validatePermissions(request, reply, ['access:management', 'write:products', 'update:products', 'delete:products']);
  });

  fastify.post<{ Body: { newProduct: NewProduct, }, }>('/', async (request, reply) => {
    const {newProduct} = request.body;

    if (!newProduct) {
      reply.badRequest('Missing newProduct');
      return;
    }

    if (!newProduct.name) {
      reply.badRequest('Missing newProduct.name');
      return;
    }

    if (!newProduct.price) {
      reply.badRequest('Missing newProduct.price');
      return;
    }

    if (!newProduct.description) {
      reply.badRequest('Missing newProduct.description');
      return;
    }

    if (!newProduct.type) {
      reply.badRequest('Missing newProduct.type');
      return;
    }

    if (!newProduct.colour) {
      reply.badRequest('Missing newProduct.colour');
      return;
    }

    if (newProduct.description.length > 2_500) {
      reply.badRequest('newProduct.description is too long');
      return;
    }

    if (newProduct.name.length > 500) {
      reply.badRequest('newProduct.name is too long');
      return;
    }

    if (newProduct.price < 0) {
      reply.badRequest('newProduct.price is negative');
      return;
    }

    if (newProduct.discount && newProduct.discount < 0) {
      reply.badRequest('newProduct.discount is negative');
      return;
    }

    if (newProduct.stock < 0) {
      reply.badRequest('newProduct.stock is negative');
      return;
    }

    const id = `${nanoid(5)}-${nanoid(5)}`;
    const slug = slugify(newProduct.name);
    let colour: number | undefined;
    let type: number | undefined;

    const result = await fastify.pg.transact(async (client) => {
      if (newProduct.colour) {
        newProduct.colour = newProduct.colour.toLowerCase().trim();
        const [colourCheckResult] = await sendQuery<BrickColours>(client,
          'SELECT * FROM brick_colours WHERE colour_name = $1',
          [newProduct.colour]);

        if (colourCheckResult) {
          if (colourCheckResult.rows.length === 0) {
            const [colourInsertResult] = await sendQuery<BrickColours>(client,
              'INSERT INTO brick_colours (colour_name) VALUES ($1) RETURNING *',
              [newProduct.colour]);

            if (colourInsertResult) {
              colour = colourInsertResult.rows[0].colour_id;
            }
          } else {
            colour = colourCheckResult.rows[0].colour_id;
          }
        }
      }

      if (newProduct.type) {
        newProduct.type = newProduct.type.toLowerCase().trim();
        const [typeCheckResult] = await sendQuery<BrickTypes>(client,
          'SELECT * FROM brick_types WHERE type_name = $1',
          [newProduct.type]);

        if (typeCheckResult) {
          if (typeCheckResult.rows.length === 0) {
            const [typeInsertResult] = await sendQuery<BrickTypes>(client,
              'INSERT INTO brick_types (type_name) VALUES ($1) RETURNING *',
              [newProduct.type]);

            if (typeInsertResult) {
              type = typeInsertResult.rows[0].type_id;
            }
          } else {
            type = typeCheckResult.rows[0].type_id;
          }
        }
      }

      const [, inventoryInsertError] = await sendQuery(client, `
        INSERT INTO inventory (inventory_id, item_name, slug, description, colour, type, price, discount, stock, date_added, visible)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [id, newProduct.name, slug, newProduct.description, colour, type, newProduct.price, newProduct.discount, newProduct.stock, new Date(), newProduct.visibility]);

      if (inventoryInsertError?.code === '23505') {
        reply.badRequest('Product already exists');
        return false;
      } else if (inventoryInsertError) {
        reply.internalServerError('Error inserting product');
        return false;
      }

      if (newProduct.images) {
        for (const image of newProduct.images) {
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
};

export default products;
