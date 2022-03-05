import {auth0} from 'Scripts/auth0';
import type {SearchQueryResult} from 'api-types';

export const trimCharactersFromEnd = (text: string, character: string) => {
  const regex = new RegExp(`^(.+)${character}+$`, 'gimu');
  return text.replace(regex, '$1');
};

// eslint-disable-next-line unicorn/prevent-abbreviations
export const nameof = (func: Function): string => func.name;

export const formatPrice = (price: number) => new Intl.NumberFormat('en-GB', {currency: 'GBP', style: 'currency'}).format(price);

export const formatPercent = (percent: number) => new Intl.NumberFormat('en-GB', {currency: 'GBP', style: 'percent'}).format(percent);

export const addToCart = async (product: SearchQueryResult, quantity = 1) => {
  const cartStorageJson = window.sessionStorage.getItem('cart');

  if (cartStorageJson) {
    let cartStorage = JSON.parse(cartStorageJson);

    cartStorage = [...cartStorage, {product, quantity}];

    window.sessionStorage.setItem('cart', JSON.stringify(cartStorage));
  } else {
    const cartStorage = JSON.stringify([{product, quantity}]);

    window.sessionStorage.setItem('cart', cartStorage);
  }

  if (await auth0.isAuthenticated()) {
    const userInfo = await auth0.getUser();

    if (!userInfo?.sub) {
      console.error('Failed to get user info');
      return;
    }

    const url = new URL('/api/v1/addToCard', 'http://0.0.0.0:8085');
    const body = {
      inventoryId: product.inventory_id,
      quantity,
      userId: userInfo.sub,
    };

    let response;

    try {
      response = await fetch(url.href, {
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
    } catch (error) {
      console.error(error);
      return;
    }

    if (!response.ok) {
      console.error(response.statusText);
    }
  }

  // The storage event only fires in other windows, so we have to fire it manually
  window.dispatchEvent(new Event('storage'));
};
