export const newProductSchema = {
  body: {
    properties: {
      product: {
        $ref: 'newProductSchema',
      },
    },
    required: ['product'],
    type: 'object',
  },
  description: 'Create a new product',
  response: {
    '200': {
      description: 'Successfully created product',
      properties: {
        message: {type: 'string'},
      },
      type: 'object',
    },
    default: {$ref: 'defaultResponseSchema'},
  },
  tags: ['products', 'staff'],
};

export const updateProductSchema = {
  body: {
    properties: {
      product: {$ref: 'updatedProductSchema'},
    },
    type: 'object',
  },
  description: 'Update a product',
  response: {
    '200': {
      description: 'Product updated',
      properties: {
        message: {
          type: 'string',
        },
      },
      type: 'object',
    },
    default: {$ref: 'defaultResponseSchema'},
  },
  tags: ['products', 'staff'],
};

export const deleteProductSchema = {
  description: 'Delete a product',
  params: {
    properties: {
      id: {
        type: 'string',
      },
    },
    required: ['id'],
    type: 'object',
  },
  response: {
    '200': {
      description: 'Product deleted',
      properties: {
        message: {
          type: 'string',
        },
      },
      type: 'object',
    },
    default: {$ref: 'defaultResponseSchema'},
  },
  tags: ['products', 'staff'],
};
