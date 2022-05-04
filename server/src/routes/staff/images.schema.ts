export const addImageSchema = {
  consumes: ['multipart/form-data'],
  description: 'Upload an image',
  headers: {
    properties: {
      'content-type': {
        pattern: 'multipart/form-data; boundary=\\.*',
        type: 'string',
      },
    },
    required: ['content-type'],
    type: 'object',
  },
  response: {
    '200': {
      description: 'Image uploaded successfully',
      properties: {
        id: {type: 'string'},
      },
      type: 'object',
    },
    default: {$ref: 'defaultResponseSchema'},
  },
  tags: ['images', 'staff'],
};

export const deleteImageSchema = {
  description: 'Delete an image',
  params: {
    properties: {
      id: {
        maxLength: 32,
        minLength: 32,
        type: 'string',
      },
    },
    required: ['id'],
    type: 'object',
  },
  response: {
    '200': {
      description: 'Successfully deleted image',
      type: 'null',
    },
    default: {$ref: 'defaultResponseSchema'},
  },
  tags: ['images', 'staff'],
};
