// eslint-disable-next-line unicorn/prevent-abbreviations
export const nameof = (func) => func.name;
export const formatPrice = (price) => new Intl.NumberFormat('en-GB',
  {currency: 'GBP', style: 'currency'}
).format(price);
export const formatPercent = (percent) => new Intl.NumberFormat('en-GB', {currency: 'GBP', style: 'percent'}).format(
  percent);
export const SERVER_BASE = process.env.NODE_ENV === 'production' ? 'http://localhost:8080' : 'http://localhost:8085';
export const getItemFromLocalStorage = (itemName) => {
  const itemStorage = window.localStorage.getItem(itemName);
  if (itemStorage) {
    return JSON.parse(itemStorage);
  }
  return undefined;
};
export const getProductUrl = (slug) => `/product/${slug}`;
export const getImageUrl = (imageId) => `/images/${imageId}.jpg`;

export class SortSetting {
  sortBy;
  sortOrder;

  constructor(sortBy, sortOrder) {
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
  }

  toString() {
    return `${this.sortOrder === 'asc' ? '' : '-'}${this.sortBy}`;
  }

  updateSortBy(sortBy) {
    let newSortOrder;
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
