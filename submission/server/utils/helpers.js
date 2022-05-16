export const sendQuery = async (pg, query, values) => {
  let queryResponse;
  try {
    queryResponse = await pg.query(query, values);
  } catch (error) {
    // LOG
    console.debug(error);
    return [undefined, error];
  }
  return [queryResponse, undefined];
};
export const sendQueryTransact = async (pg, query, values) => await pg.transact(async (client) => await client.query(
  query,
  values
));
export const checkIfProductInStock = async (pg, cartItems) => {
  const responseBody = [];
  for (const product of cartItems) {
    const [result, error] = await sendQuery(pg,
      'SELECT stock FROM inventory WHERE inventory_id = $1',
      [product.inventoryId]
    );
    if (error || !result) {
      console.error(error);
      return undefined;
    }
    if (result.rows?.length === 0) {
      return [];
    }
    const row = result.rows[0];
    if (row.stock - product.quantity < 0) {
      responseBody.push({inventoryId: product.inventoryId, stock: row.stock});
    }
  }
  return responseBody;
};
export const validatePermissions = (request, reply, permissions, all = true) => {
  if (typeof request.user === 'object') {
    const userAuth = request.user;
    if (!userAuth.permissions) {
      reply.badRequest();
      return;
    }
    let result;
    if (all) {
      result = permissions.every((permission) => userAuth.permissions.includes(permission));
    } else {
      result = permissions.some((permission) => userAuth.permissions.includes(permission));
    }
    if (!result) {
      reply.forbidden();
    }
  } else {
    reply.badRequest();
  }
};
