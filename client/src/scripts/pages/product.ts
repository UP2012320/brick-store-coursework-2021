import {nameof} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import {registerUseState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles} from 'Scripts/uiUtils';
import productStyles from 'Styles/pages/product.module.scss';
import type {FetchStatus, ProductProps} from 'Types/types';
import type {SearchQueryResponse} from 'api-types';

const useState = registerUseState(nameof(createProduct));

export default function createProduct (props: ProductProps) {
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>('pending');
  const [productDetails, setProductDetails] = useState<SearchQueryResponse | undefined>();

  const fetchProduct = async () => {
    const url = new URL('/api/v1/getProduct', 'http://0.0.0.0:8085/');

    if (props.restArgs?.slug) {
      url.searchParams.set('slug', props.restArgs?.slug);
    } else {
      setFetchStatus('finished');
      return;
    }

    let response: Response;

    try {
      response = await fetch(url.href);
    } catch (error) {
      console.error(error);
      setFetchStatus('finished');
      return;
    }

    const responseBody = await response.json() as SearchQueryResponse[];

    if (responseBody.length > 0) {
      setProductDetails(responseBody[0]);
      setFetchStatus('finished');
      return;
    }

    setFetchStatus('finished');
  };

  useEffect(nameof(createProduct), () => {
    fetchProduct();
  }, []);

  const ProductContainer = createElementWithStyles('div', undefined, productStyles.productContainer);

  console.debug(productDetails);

  return htmlx`
  <${ProductContainer}>
  </l>
`;
}
