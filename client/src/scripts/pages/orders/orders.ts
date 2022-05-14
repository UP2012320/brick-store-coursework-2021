import {auth0} from 'Scripts/auth0';
import {nameof, SERVER_BASE} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import {useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles, createKeyedContainer} from 'Scripts/uiUtils';
import {type OrderInfo} from 'api-types';
import ordersStyles from './orders.module.scss';

const key = nameof(createOrders);

export default function createOrders () {
  const [orders, setOrders] = useState<Record<string, OrderInfo[]>>(key, {});

  const getOrders = async () => {
    const user = await auth0.getUser();

    if (user?.sub) {
      const url = new URL('/api/v1/orders/allUsersOrders', SERVER_BASE);
      url.searchParams.append('userId', user.sub);

      let response;

      try {
        response = await fetch(url.href);
      } catch (error) {
        console.error(error);
        return;
      }

      if (response.ok) {
        const data = await response.json() as Record<string, OrderInfo[]>;

        setOrders(data);
      }
    }
  };

  useEffect(key, () => {
    getOrders();
  }, []);

  const container = createKeyedContainer('section', key, undefined, ordersStyles.container);

  const orderList = createElementWithStyles('ul', {
    ariaRoleDescription: 'list',
  }, ordersStyles.listContainer);

  const orderItems = Object.values(orders).map((order) => createElementWithStyles('li', {
    textContent: order[0].orderId,
  }, ordersStyles.listItem));

  console.debug(orders);

  return htmlx`
  <${container}>
    <${orderList}>
     <${orderItems}/>
    </orderList>
  </container>
  `;
}
