// eslint-disable-next-line unicorn/prevent-abbreviations
export const nameof = (func: Function): string => func.name;

export const formatPrice = (price: number) => new Intl.NumberFormat('en-GB', {currency: 'GBP', style: 'currency'}).format(price);

export const formatPercent = (percent: number) => new Intl.NumberFormat('en-GB', {currency: 'GBP', style: 'percent'}).format(percent);

export const SERVER_BASE = process.env.NODE_ENV === 'production' ? 'http://localhost:8080' : 'http://localhost:8085';

export const getItemFromLocalStorage = <T>(itemName: string) => {
  const itemStorage = window.localStorage.getItem(itemName);

  if (itemStorage) {
    return JSON.parse(itemStorage) as T;
  }

  return undefined;
};

export const getProductUrl = (slug: string) => `/product/${slug}`;

export const getImageUrl = (imageId: string) => `/images/${imageId}.jpg`;

export class SortSetting {
  public readonly sortBy: string;

  public readonly sortOrder: 'asc' | 'desc';

  public constructor (sortBy: string, sortOrder: 'asc' | 'desc') {
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
  }

  public toString () {
    return `${this.sortOrder === 'asc' ? '' : '-'}${this.sortBy}`;
  }

  public updateSortBy (sortBy: string) {
    let newSortOrder: 'asc' | 'desc';
    let newSortBy = this.sortBy;

    if (this.sortBy === sortBy) {
      newSortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      newSortBy = sortBy;
      newSortOrder = 'asc';
    }

    return new SortSetting(newSortBy, newSortOrder);
  }
}
