export const getOrderSchema = {
  description: 'Get order by orderId, along with either userId or email',
  querystring: {
    errorMessage: 'You must provide an orderId and either a userId or an email',
    oneOf: [
      {required: ['orderId', 'userId']},
      {required: ['orderId', 'email']},
    ],
    properties: {
      email: {$ref: 'email'},
      orderId: {type: 'string'},
      userId: {type: 'string'},
    },
    type: 'object',
  },
  response: {
    '200': {
      $ref: 'orderResponseSchema',
      description: 'Successful response',
    },
    default: {$ref: 'defaultResponseSchema'},
  },
  tags: ['orders'],
};

export const getAllUsersOrdersSchema = {
  description: 'Get all orders for a user',
  querystring: {
    properties: {
      userId: {
        type: 'string',
      },
    },
    required: ['userId'],
    type: 'object',
  },
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
  tags: ['orders'],
};

export const addOrderSchema = {
  body: {
    anyOf: [
      {required: ['cartItems', 'email']},
      {required: ['cartItems', 'email', 'userId']},
    ],
    errorMessage: 'You must provide a cartItems array. With either a userId and email or just an email',
    properties: {
      cartItems: {
        items: {
          minLength: 1,
          properties: {
            inventoryId: {type: 'string'},
            quantity: {type: 'number'},
          },
          required: ['inventoryId', 'quantity'],
          type: 'object',
        },
        type: 'array',
      },
      email: {$ref: 'email'},
      userId: {type: 'string'},
    },
  },
  description: 'Create an order',
  response: {
    '200': {
      description: 'Successfully created order',
      properties: {
        orderId: {type: 'string'},
      },
      type: 'object',
    },
    default: {$ref: 'defaultResponseSchema'},
  },
  tags: ['orders'],
};
