import {sendQuery} from '../utils/helpers';

export const GetCart = async (pg, userId) => {
  const [cartItems, error] = await sendQuery(pg, `
    SELECT c.inventory_id, quantity, i.stock
  FROM cart c
         JOIN inventory i ON c.inventory_id = i.inventory_id
  WHERE user_id = $1
  `, [userId]);
  if (error) {
    console.error(error);
    return undefined;
  }
  return cartItems?.rows;
};
