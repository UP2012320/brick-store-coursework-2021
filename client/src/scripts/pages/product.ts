import {createElement} from 'Scripts/uiUtils';
import type {productProps} from 'Types/types';

// eslint-disable-next-line arrow-body-style
const createProduct = (props: productProps) => {
  return createElement('div', {
    textContent: props.restArgs?.slug,
  });
};

export default createProduct;
