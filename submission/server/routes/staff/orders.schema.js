export const getAllOrdersSchema = {
  description: 'Get all orders of all users',
  response: {
    '200': {
      description: 'Successful response',
      items: {
        $ref: 'orderResponseSchema',
      },
      type: 'array',
    },
    default: {$ref: 'defaultResponseSchema'},
  },
  tags: ['orders', 'staff'],
};
export const deleteOrderSchema = {
  description: 'Delete order',
  params: {
    properties: {
      id: {maxLength: 12, minLength: 12, type: 'string'},
    },
    required: ['id'],
    type: 'object',
  },
  response: {
    '200': {
      type: 'null',
    },
    default: {$ref: 'defaultResponseSchema'},
  },
  tags: ['orders', 'staff'],
};
