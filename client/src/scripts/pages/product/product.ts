import {addToCart} from 'Scripts/cartController';
import {formatPrice, getImageUrl, nameof, SERVER_BASE} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import {registerUseState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElement, createKeyedContainer} from 'Scripts/uiUtils';
import {type ProductProps} from 'Types/types';
import {type Product} from 'api-types';
import productStyles from './product.module.scss';

const key = nameof(createProduct);
const useState = registerUseState(key);

export default function createProduct (props: ProductProps) {
  const [productDetails, setProductDetails] = useState<Product | undefined>();

  const fetchProduct = async () => {
    console.debug('running fetchProduct');
    console.debug('fetching product', props.restArgs?.slug);

    const url = new URL('/api/v1/getProductBySlug', SERVER_BASE);
    if (props.restArgs?.slug) {
      url.searchParams.set('slug', props.restArgs?.slug);
    } else {
      return;
    }

    let response: Response;

    try {
      response = await fetch(url.href);
    } catch (error) {
      console.error(error);
      return;
    }

    const responseBody = await response.json() as Product[];

    if (responseBody.length > 0) {
      setProductDetails(responseBody[0]);
    }
  };

  useEffect(key, () => {
    fetchProduct();
  }, []);

  const ProductScrollContainer = createKeyedContainer('div', key, undefined, productStyles.productScrollContainer);

  const ProductContainer = createElement('div', undefined, productStyles.productContainer);

  if (productDetails) {
    let ProductImage;

    if (productDetails.images) {
      ProductImage = createElement('img', {src: getImageUrl(productDetails.images[0])}, productStyles.productImageContainer);
    }

    const ProductDetailsContainer = createElement('div', undefined, productStyles.productDetailsContainer);
    const ProductDetailsTitle = createElement('h1', {textContent: productDetails.name}, productStyles.productDetailsTitle);
    const ProductDetailsId = createElement('p', {textContent: productDetails.inventory_id.toUpperCase()}, productStyles.productDetailsId);
    const ProductDetailsStock = createElement('p', {textContent: `${productDetails.stock} in Stock`}, productStyles.productDetailsStock);
    const ProductDetailsDescriptionContainer = createElement('div', undefined, productStyles.productDetailsDescriptionContainer);
    const ProductDetailsDescriptionHeader = createElement('h1', {textContent: 'Details:'}, productStyles.productDetailsDescriptionHeader);
    const ProductDetailsDescription = createElement('p', {textContent: productDetails.description}, productStyles.productDetailsDescription);
    const ProductDetailsPrice = createElement('p', {textContent: formatPrice(productDetails.price)}, productStyles.productDetailsPrice);

    const ProductAddToCard = createElement('button', {
      onclick: async () => {
        await addToCart(productDetails);
      }, textContent: 'Add to Cart',
    }, productStyles.productAddToCartButton);

    return htmlx`
    <${ProductScrollContainer}>
      <${ProductContainer}>
        <${ProductImage}/>
        <${ProductDetailsContainer}>
          <${ProductDetailsTitle}/>
          <${ProductDetailsId}/>
          <${ProductDetailsStock}/>
          <${ProductDetailsDescriptionContainer}>
            <${ProductDetailsDescriptionHeader}/>
            <${ProductDetailsDescription}/>
          </ProductDetailsDescriptionContainer>
          <${ProductDetailsPrice}/>
        </ProductDetailsContainer>
        <${ProductAddToCard}/>
      </ProductContainer>
    </ProductScrollContainer>
`;
  } else {
    return htmlx`
    <${ProductScrollContainer}>
      <${ProductContainer}>
        <${createElement('p', {textContent: 'loading..'})}/>
      </ProductContainer>
    </ProductScrollContainer>
`;
  }
}
