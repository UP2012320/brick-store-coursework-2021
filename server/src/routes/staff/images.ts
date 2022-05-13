import * as fs from 'node:fs/promises';
import {type FastifyPluginAsync, type onRequestHookHandler, type preHandlerAsyncHookHandler} from 'fastify';
import {nanoid} from 'nanoid';
import {type Pool, type PoolClient} from 'pg';
import sharp from 'sharp';
import {sendQuery, validatePermissions} from '../../utils/helpers';
import {addImageSchema, deleteImageSchema} from './images.schema';

const saveFolder = '../dist/public/images';

declare module 'fastify' {
  interface FastifyRequest {
    buffer: Buffer;
  }
}

const onUploadRequest: onRequestHookHandler = (request, reply, done) => {
  // eslint-disable-next-line require-atomic-updates
  request.buffer = Buffer.from('');
  done();
};

const validateUpload: preHandlerAsyncHookHandler = async (request, reply) => {
  const file = await request.file();

  if (!file) {
    reply.code(400).send({
      error: 'No file was uploaded',
    });
    return;
  }

  if (!file.mimetype.startsWith('image/')) {
    reply.code(400).send({
      error: 'Invalid file type',
    });
    return;
  }

  const magic = [
    // PNG
    '89504E47',
    // JPEG
    'FFD8FFE0',
    'FFD8FFE1',
    'FFD8FFE8',
    'FFD8FFFE',
  ];

  // eslint-disable-next-line require-atomic-updates
  request.buffer = await file.toBuffer();

  const magicNumber = request.buffer.toString('hex', 0, 4);

  if (!magic.includes(magicNumber.toUpperCase())) {
    reply.code(400).send({
      error: 'Invalid file type',
    });
  }
};

const saveImage = async (newId: string, buffer: Buffer) => {
  const filePath = `${saveFolder}/${newId}.jpg`;

  console.debug(`Saving image to ${filePath}`);

  try {
    await fs.mkdir(saveFolder, {recursive: true});
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).code !== 'EEXIST') {
      return false;
    }
  }

  try {
    await sharp(buffer)
      .resize(800, 800, {fit: 'inside'})
      .jpeg({
        quality: 80,
      })
      .toFile(filePath);
  } catch (error) {
    console.error(error);
    return false;
  }

  return true;
};

export const deleteImageFromDatabase = async (client: Pool | PoolClient, id: string) => {
  const [imageExists, imageExistsError] = await sendQuery<{exists: boolean, }>(client, 'SELECT EXISTS (SELECT 1 FROM images WHERE image_id = $1)', [id]);

  if (imageExistsError) {
    return false;
  }

  if (!imageExists?.rows[0].exists) {
    return true;
  }

  const [, inventoryImagesError] = await sendQuery(client, 'DELETE FROM inventory_images WHERE image_id = $1', [id]);

  if (inventoryImagesError) {
    return false;
  }

  const [, imagesError] = await sendQuery(client,
    'DELETE FROM images WHERE image_id = $1',
    [id]);

  return !imagesError;
};

export const deleteImageFile = async (id: string) => {
  const filePath = `${saveFolder}/${id}.jpg`;

  try {
    await fs.unlink(filePath);
  } catch (error) {
    const errno = error as NodeJS.ErrnoException;
    if (errno.errno === -2) {
      return true;
    }
    console.error(errno);
    return false;
  }

  return true;
};

const images: FastifyPluginAsync = async (fastify, options) => {
  fastify.addHook('preHandler', async (request, reply) => {
    validatePermissions(request, reply, ['write:image', 'delete:image']);
  });

  fastify.decorateRequest('buffer', undefined);

  fastify.post('/', {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    onRequest: onUploadRequest,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    preHandler: validateUpload,
    schema: addImageSchema,
  }, async (request, reply) => {
    const fileUploadId = nanoid(32);

    const result = await saveImage(fileUploadId, request.buffer);

    if (!result) {
      reply.code(500).send({
        error: 'Failed to save image',
      });
      return;
    }

    const [, error] = await sendQuery(fastify.pg.pool,
      'INSERT INTO images (image_id) VALUES ($1) RETURNING *',
      [fileUploadId]);

    if (error) {
      await deleteImageFile(fileUploadId);
      reply.code(500).send({
        error: 'Failed to save image',
      });
      return;
    }

    reply.code(200).send({
      id: fileUploadId,
    });
  });

  fastify.delete<{ Params: { id: string, }, }>('/:id', {schema: deleteImageSchema}, async (request, reply) => {
    const result = await deleteImageFile(request.params.id);

    if (!result) {
      reply.code(500).send({
        error: 'Failed to delete image',
      });
      return;
    }

    const error = await deleteImageFromDatabase(fastify.pg.pool, request.params.id);

    if (error) {
      reply.code(500).send({
        error: 'Failed to delete image',
      });
      return;
    }

    reply.code(200).send();
  });
};

export default images;
