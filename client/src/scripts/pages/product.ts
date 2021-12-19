import {createElement} from 'Scripts/uiUtils';

export interface productProps {
  qs?: {
    slug: string,
  };
}

// eslint-disable-next-line arrow-body-style
const createProduct = (props: productProps) => {
  return createElement('div', {
    textContent: props.qs?.slug,
  });
};

export default createProduct;
