import {type FastifyInstance} from 'fastify';

export const addSchemas = (fastify: FastifyInstance) => {
  fastify.addSchema({
    $id: 'defaultResponseSchema',
    description: 'Unsuccessful response',
    properties: {
      error: {type: 'string'},
      message: {type: 'string'},
      statusCode: {type: 'number'},
    },
    type: 'object',
  });

  fastify.addSchema({
    $id: 'productColour',
    minLength: 1,
    type: 'string',
  });

  fastify.addSchema({
    $id: 'productType',
    minLength: 1,
    type: 'string',
  });

  fastify.addSchema({
    $id: 'productName',
    maxLength: 500,
    minLength: 1,
    type: 'string',
  });

  fastify.addSchema({
    $id: 'productDescription',
    maxLength: 2_500,
    type: 'string',
  });

  fastify.addSchema({
    $id: 'productId',
    maxLength: 11,
    minLength: 11,
    type: 'string',
  });

  fastify.addSchema({
    $id: 'productImages',
    items: {type: 'string'},
    maxItems: 16,
    nullable: true,
    type: 'array',
  });

  fastify.addSchema({
    $id: 'email',
    errorMessage: 'A valid email is required',
    pattern: '^\\S+@\\S+\\.\\S+$',
    type: 'string',
  });

  fastify.addSchema({
    $id: 'productSchema',
    properties: {
      colour: {$ref: 'productColour'},
      date_added: {type: 'string'},
      description: {$ref: 'productDescription'},
      discount: {nullable: true, type: 'number'},
      discount_price: {type: 'number'},
      images: {$ref: 'productImages'},
      inventory_id: {$ref: 'productId'},
      name: {$ref: 'productName'},
      price: {type: 'number'},
      slug: {type: 'string'},
      stock: {type: 'number'},
      type: {$ref: 'productType'},
      visibility: {type: 'boolean'},
    },
    type: 'object',
  });

  fastify.addSchema({
    $id: 'newProductSchema',
    properties: {
      colour: {$ref: 'productColour'},
      description: {$ref: 'productDescription'},
      discount: {nullable: true, type: 'number'},
      images: {$ref: 'productImages'},
      name: {$ref: 'productName'},
      price: {type: 'number'},
      stock: {type: 'number'},
      type: {$ref: 'productType'},
      visibility: {type: 'boolean'},
    },
    required: ['name', 'price', 'stock', 'type', 'visibility', 'colour', 'description'],
    type: 'object',
  });

  fastify.addSchema({
    $id: 'updatedProductSchema',
    properties: {
      colour: {$ref: 'productColour'},
      description: {$ref: 'productDescription'},
      discount: {nullable: true, type: 'number'},
      images: {$ref: 'productImages'},
      inventory_id: {$ref: 'productId'},
      name: {$ref: 'productName'},
      price: {type: 'number'},
      stock: {type: 'number'},
      type: {$ref: 'productType'},
      visibility: {type: 'boolean'},
    },
    required: ['name', 'price', 'stock', 'type', 'visibility', 'colour', 'description', 'inventory_id'],
    type: 'object',
  });

  fastify.addSchema({
    $id: 'orderResponseSchema',
    properties: {
      dateOrdered: {type: 'string'},
      dateShipped: {nullable: true, type: 'string'},
      email: {nullable: true, type: 'string'},
      inventoryId: {maxLength: 11, minLength: 11, type: 'string'},
      orderId: {maxLength: 12, minLength: 12, type: 'string'},
      quantity: {type: 'number'},
      userId: {nullable: true, type: 'string'},
    },
    // eslint-disable-next-line unicorn/no-unused-properties
    type: 'object',
  });
};
