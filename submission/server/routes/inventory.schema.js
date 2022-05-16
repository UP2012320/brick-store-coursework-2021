export const searchSchema = {
  description: 'Search for products',
  querystring: {
    properties: {
      colours: {type: 'string'},
      offset: {type: 'number'},
      query: {type: 'string'},
      sort: {type: 'string'},
      types: {type: 'string'},
    },
    required: ['query'],
    type: 'object',
  },
  response: {
    '200': {
      description: 'Successful response',
      items: {
        $ref: 'productSchema',
      },
      type: 'array',
    },
    default: {$ref: 'defaultResponseSchema'},
  },
  tags: ['inventory'],
};
export const getBrickTypesSchema = {
  description: 'Get all brick types',
  response: {
    '200': {
      description: 'Successful response',
      items: {
        properties: {
          id: {type: 'string'},
          type: {type: 'string'},
        },
        type: 'object',
      },
      type: 'array',
    },
    default: {$ref: 'defaultResponseSchema'},
  },
  tags: ['inventory'],
};
export const getBrickColoursSchema = {
  ...getBrickTypesSchema,
  description: 'Get all brick colours',
  response: {
    ...getBrickTypesSchema.response,
    '200': {
      ...getBrickTypesSchema.response['200'],
      items: {
        properties: {
          id: {type: 'string'},
          name: {type: 'string'},
        },
        type: 'object',
      },
      type: 'array',
    },
  },
};
export const getProductBySlugSchema = {
  description: 'Get a product by slug',
  querystring: {
    properties: {
      slug: {type: 'string'},
    },
    required: ['slug'],
    type: 'object',
  },
  response: {
    '200': {
      description: 'Successful response',
      items: {
        $ref: 'productSchema',
      },
      type: 'array',
    },
    default: {$ref: 'defaultResponseSchema'},
  },
  tags: ['inventory'],
};
export const getProductByInventoryIdSchema = {
  ...getProductBySlugSchema,
  description: 'Get a product by inventory id',
  querystring: {
    ...getProductBySlugSchema.querystring,
    properties: {
      inventoryId: {type: 'string'},
    },
    required: ['inventoryId'],
    type: 'object',
  },
};
