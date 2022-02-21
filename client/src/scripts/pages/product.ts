import {nameof} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import {useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElement} from 'Scripts/uiUtils';
import type {productProps} from 'Types/types';

// eslint-disable-next-line arrow-body-style
const createProduct = (props: productProps) => {
  const [productDetails, setProductDetails] = useState(nameof(createProduct));

  const fetchProduct = async () => {
    const kok = await fetch('');

    setProductDetails(undefined);
  };

  useEffect(nameof(createProduct), () => {}, []);

  const l = createElement('div', {
    textContent: props.restArgs?.slug,
  });

  return htmlx`<${l}/>`;
};

export default createProduct;
