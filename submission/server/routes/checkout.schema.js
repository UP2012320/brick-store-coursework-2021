export const checkoutSchema = {
  body: {
    properties: {
      cartItems: {
        items: {
          properties: {
            inventoryId: {
              maxLength: 11,
              minLength: 11,
              type: 'string',
            },
            quantity: {
              type: 'number',
            },
          },
          required: ['inventoryId', 'quantity'],
          type: 'object',
        },
        type: 'array',
      },
      email: {$ref: 'email'},
      userId: {type: 'string'},
    },
    required: ['cartItems'],
    type: 'object',
  },
  description: 'Checkout a cart',
  response: {
    '200': {
      description: 'Successful checkout',
      type: 'null',
    },
    default: {$ref: 'defaultResponseSchema'},
  },
  tags: ['checkout'],
};
