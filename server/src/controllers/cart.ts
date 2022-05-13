import {type CartItem} from 'api-types';
import {type Pool, type PoolClient} from 'pg';
import {sendQuery} from '../utils/helpers';

export const GetCart = async (pg: Pool | PoolClient, userId: string) => {
  const [cartItems, error] = await sendQuery<CartItem[]>(pg, `
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
