import type {SearchQueryResult} from 'api-types';

export const trimCharactersFromEnd = (text: string, character: string) => {
  const regex = new RegExp(`^(.+)${character}+$`, 'gimu');
  return text.replace(regex, '$1');
};

// eslint-disable-next-line unicorn/prevent-abbreviations
export const nameof = (func: Function): string => func.name;

export const formatPrice = (price: number) => new Intl.NumberFormat('en-GB', {currency: 'GBP', style: 'currency'}).format(price);

export const formatPercent = (percent: number) => new Intl.NumberFormat('en-GB', {currency: 'GBP', style: 'percent'}).format(percent);

export const addToCart = async (product: SearchQueryResult) => {
  const cartStorageJson = window.localStorage.getItem('cart');

  if (cartStorageJson) {
    let cartStorage = JSON.parse(cartStorageJson);

    cartStorage = [...cartStorage, product];

    window.localStorage.setItem('cart', JSON.stringify(cartStorage));
  } else {
    const cartStorage = JSON.stringify([product]);

    window.localStorage.setItem('cart', cartStorage);
  }

  // The storage event only fires in other windows, so we have to fire it manually
  window.dispatchEvent(new Event('storage'));
};
