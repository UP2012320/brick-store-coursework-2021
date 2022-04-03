import images from 'Assets/2412b.png';
import {addToCart} from 'Scripts/cartController';
import {formatPrice, nameof, serverBaseUrl} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import {registerUseState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createComponentContainer, createElement, createElementWithStyles} from 'Scripts/uiUtils';
import type {ProductProps} from 'Types/types';
import type {Product} from 'api-types';
import productStyles from './product.module.scss';

const key = nameof(createProduct);
const useState = registerUseState(key);

export default function createProduct (props: ProductProps) {
  const [productDetails, setProductDetails] = useState<Product | undefined>();

  const fetchProduct = async () => {
    const url = new URL('/api/v1/getProductBySlug', serverBaseUrl);

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

  const ProductScrollContainer = createComponentContainer('div', key, undefined, productStyles.productScrollContainer);

  const ProductContainer = createElementWithStyles('div', undefined, productStyles.productContainer);

  if (productDetails) {
    const ProductImage = createElementWithStyles('img', {src: images}, productStyles.productImageContainer);
    const ProductDetailsContainer = createElementWithStyles('div', undefined, productStyles.productDetailsContainer);
    const ProductDetailsTitle = createElementWithStyles('h1', {textContent: productDetails.name}, productStyles.productDetailsTitle);
    const ProductDetailsId = createElementWithStyles('p', {textContent: productDetails.inventory_id.toUpperCase()}, productStyles.productDetailsId);
    const ProductDetailsStock = createElementWithStyles('p', {textContent: `${productDetails.stock} in Stock`}, productStyles.productDetailsStock);
    const ProductDetailsDescriptionContainer = createElementWithStyles('div', undefined, productStyles.productDetailsDescriptionContainer);
    const ProductDetailsDescriptionHeader = createElementWithStyles('h1', {textContent: 'Details:'}, productStyles.productDetailsDescriptionHeader);
    const ProductDetailsDescription = createElementWithStyles('p', {textContent: productDetails.description}, productStyles.productDetailsDescription);
    const ProductDetailsPrice = createElementWithStyles('p', {textContent: formatPrice(productDetails.price)}, productStyles.productDetailsPrice);

    const ProductAddToCard = createElementWithStyles('button', {
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
