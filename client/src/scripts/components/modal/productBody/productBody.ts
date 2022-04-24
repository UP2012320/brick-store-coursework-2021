import {nameof} from 'Scripts/helpers';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles, createKeyedContainer} from 'Scripts/uiUtils';
import type {ReUsableComponentProps} from 'Types/types';
import type {Product} from 'api-types';
import productBodyStyles from './productBody.module.scss';

interface ProductBodyProps extends ReUsableComponentProps {
  existingProduct?: Product;
  onSubmit: (product: Product) => void;
}

/*
 * id
 * image
 * name
 * description
 * price
 * stock
 * type
 * colour
 * discount
 */

export default function createProductBody (props: ProductBodyProps) {
  props.key ??= nameof(createProductBody);

  const container = createKeyedContainer('div', props.key, undefined, productBodyStyles.container);

  let imageContainer;

  if (props.existingProduct?.imageUrl) {
    imageContainer = createElementWithStyles('img', {
      alt: 'Product Image',
      src: props.existingProduct.imageUrl,
      title: 'Click to change image',
    }, productBodyStyles.imageContainer);
  } else {
    const emptyImageContainer = createElementWithStyles('div', undefined, productBodyStyles.imageContainer, productBodyStyles.empty);
    const imageText = createElementWithStyles('p', {
      textContent: 'Add an Image',
    }, productBodyStyles.emptyImageText);

    imageContainer = htmlx`
    <${emptyImageContainer}>
      <${imageText}/>
    </emptyImageContainer>>
    `;
  }

  const nameInputContainer = createElementWithStyles('div', undefined, productBodyStyles.nameInputContainer);

  const nameLabel = createElementWithStyles('label', {
    textContent: 'Product Name',
  }, productBodyStyles.inputLabel);

  const nameInput = createElementWithStyles('input', {
    placeholder: 'Product Name',
    type: 'text',
    value: props.existingProduct?.name ?? '',
  }, productBodyStyles.inputField);

  return htmlx`
  <${container}>
    <${imageContainer}/>
    <${nameInputContainer}>
      <${nameLabel}/>
      <${nameInput}/>
    </nameInputContainer>
  </container>
  `;
}
