import * as fs from 'node:fs/promises';
import type {FastifyPluginAsync, onRequestAsyncHookHandler, preHandlerAsyncHookHandler} from 'fastify';
import {nanoid} from 'nanoid';
import sharp from 'sharp';

const saveFolder = '../dist/public/images';

declare module 'fastify' {
  interface FastifyRequest {
    buffer: Buffer;
  }
}

const onUploadRequest: onRequestAsyncHookHandler = async (request, reply) => {
  // eslint-disable-next-line require-atomic-updates
  request.buffer = Buffer.from('');
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

const images: FastifyPluginAsync = async (fastify, options) => {
  /* fastify.addHook('preValidation', fastify.authenticate);
  fastify.addHook('preHandler', async (request, reply) => {
    validatePermissions(request, reply, ['access:management', 'write:image']);
  });
   */

  fastify.decorateRequest('buffer', undefined);

  fastify.post('/', {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    onRequest: onUploadRequest,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    preHandler: validateUpload,
  }, async (request, reply) => {
    const fileUploadId = nanoid(32);

    const result = await saveImage(fileUploadId, request.buffer);

    if (!result) {
      reply.code(500).send({
        error: 'Failed to save image',
      });
      return;
    }

    reply.code(200).send({
      id: fileUploadId,
    });
  });

  fastify.delete<{Params: {id: string, }, }>('/:id', async (request, reply) => {
    const filePath = `${saveFolder}/${request.params.id}.jpg`;

    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error(error);
      reply.code(500).send({
        error: 'Failed to delete image',
      });
      return;
    }

    reply.code(200).send({
      id: request.params.id,
    });
  });
};

export default images;
