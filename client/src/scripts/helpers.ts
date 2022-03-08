import {auth0} from 'Scripts/auth0';
import type {CartItem, Product} from 'api-types';

export const trimCharactersFromEnd = (text: string, character: string) => {
  const regex = new RegExp(`^(.+)${character}+$`, 'gimu');
  return text.replace(regex, '$1');
};

// eslint-disable-next-line unicorn/prevent-abbreviations
export const nameof = (func: Function): string => func.name;

export const formatPrice = (price: number) => new Intl.NumberFormat('en-GB', {currency: 'GBP', style: 'currency'}).format(price);

export const formatPercent = (percent: number) => new Intl.NumberFormat('en-GB', {currency: 'GBP', style: 'percent'}).format(percent);

export const serverBaseUrl = 'http://0.0.0.0:8085';
