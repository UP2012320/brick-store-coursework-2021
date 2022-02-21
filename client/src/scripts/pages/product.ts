import {nameof} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import {registerUseState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElement} from 'Scripts/uiUtils';
import type {ProductProps} from 'Types/types';
import type {SearchQueryResponse} from 'api-types';

type FetchStatus = 'finished' | 'pending';

const useState = registerUseState(nameof(createProduct));

export default function createProduct (props: ProductProps) {
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>('pending');
  const [productDetails, setProductDetails] = useState<SearchQueryResponse | undefined>();

  const fetchProduct = async () => {
    const url = new URL('/getProduct', 'http://0.0.0.0:8085/api/v1/');

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

  const l = createElement('div', {
    textContent: props.restArgs?.slug,
  });

  return htmlx`<${l}/>`;
}
