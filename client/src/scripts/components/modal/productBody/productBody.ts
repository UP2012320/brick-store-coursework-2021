import createInputBox from 'Scripts/components/modal/productBody/inputBox/inputBox';
import {nameof} from 'Scripts/helpers';
import {useState} from 'Scripts/hooks/useState';
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

  const [name, setName] = useState(props.key, props.existingProduct?.name ?? '');
  const [description, setDescription] = useState(props.key, props.existingProduct?.description ?? '');
  const [price, setPrice] = useState(props.key, props.existingProduct?.price.toString() ?? '');
  const [stock, setStock] = useState(props.key, props.existingProduct?.stock.toString() ?? '');
  const [type, setType] = useState(props.key, props.existingProduct?.type ?? '');
  const [colour, setColour] = useState(props.key, props.existingProduct?.colour ?? '');
  const [discount, setDiscount] = useState(props.key, props.existingProduct?.discount?.toString() ?? '');

  const container = createKeyedContainer('div', props.key, undefined, productBodyStyles.container);

  let imageContainer;

  if (props.existingProduct?.imageUrl) {
    imageContainer = createElementWithStyles('img', {
      alt: 'Product Image',
      src: props.existingProduct.imageUrl,
      title: 'Click to change image',
    }, productBodyStyles.imageContainer);
  } else {
    const imageText = createElementWithStyles('label', {
      htmlFor: 'productImageUpload',
      textContent: 'Add an Image',
    }, productBodyStyles.imageContainer, productBodyStyles.empty);
    const emptyImageContainer = createElementWithStyles('input', {
      accept: 'image/*',
      id: 'productImageUpload',
      onchange: (event) => {
        if (event.target instanceof HTMLInputElement) {
          console.debug('Image uploaded', event.target.files);
        }
      },
      type: 'file',
    }, productBodyStyles.hidden);

    imageContainer = htmlx`
    <${imageText}>
      <${emptyImageContainer}/>
    </imageText>>
    `;
  }

  const nameInput = createInputBox({
    classPrefix: 'name',
    key: 'nameInput',
    label: 'Product Name',
    placeholder: 'Enter product name',
    setValue: setName,
    value: name,
  });

  const priceInput = createInputBox({
    classPrefix: 'price',
    inputPrefix: '£',
    key: 'priceInput',
    label: 'Product Price',
    placeholder: 'Enter product price',
    setValue: setPrice,
    type: 'number',
    value: price.toString(),
  });

  const descriptionInput = createInputBox({
    classPrefix: 'description',
    key: 'descriptionInput',
    label: 'Description',
    placeholder: 'Enter product description',
    setValue: setDescription,
    textarea: true,
    value: description,
  });

  const stockInput = createInputBox({
    classPrefix: 'stock',
    key: 'stockInput',
    label: 'Stock',
    placeholder: 'Enter product stock',
    setValue: setStock,
    type: 'number',
    value: stock,
  });

  const typeInput = createInputBox({
    classPrefix: 'type',
    key: 'typeInput',
    label: 'Type',
    placeholder: 'Enter product type',
    setValue: setType,
    value: type,
  });

  const colourInput = createInputBox({
    classPrefix: 'colour',
    key: 'colourInput',
    label: 'Colour',
    placeholder: 'Enter product colour',
    setValue: setColour,
    value: colour,
  });

  const discountInput = createInputBox({
    classPrefix: 'discount',
    inputPrefix: '%',
    key: 'discountInput',
    label: 'Discount',
    placeholder: 'Enter product discount',
    setValue: setDiscount,
    type: 'number',
    value: discount,
  });

  const actionsContainer = createElementWithStyles('div', undefined, productBodyStyles.actionsContainer);

  const clearButton = createElementWithStyles('button', {
    onclick: () => {
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
      setType('');
      setColour('');
      setDiscount('');
    },
    textContent: 'Clear',
  }, productBodyStyles.clearButton);

  const resetButton = createElementWithStyles('button', {
    onclick: () => {
      setName(props.existingProduct?.name ?? '');
      setDescription(props.existingProduct?.description ?? '');
      setPrice(props.existingProduct?.price.toString() ?? '');
      setStock(props.existingProduct?.stock.toString() ?? '');
      setType(props.existingProduct?.type ?? '');
      setColour(props.existingProduct?.colour ?? '');
      setDiscount(props.existingProduct?.discount?.toString() ?? '');
    },
    textContent: 'Reset',
  }, productBodyStyles.resetButton);

  const submitButton = createElementWithStyles('button', {
    textContent: 'Submit',
  }, productBodyStyles.submitButton);

  return htmlx`
  <${container}>
    <${imageContainer}/>
    <${nameInput}/>
    <${priceInput}/>
    <${descriptionInput}/>
    <${typeInput}/>
    <${colourInput}/>
    <${stockInput}/>
    <${discountInput}/>
    <${actionsContainer}>
      <${clearButton}/>
      <${resetButton}/>
      <${submitButton}/>
    </actionsContainer>
  </container>
  `;
}
