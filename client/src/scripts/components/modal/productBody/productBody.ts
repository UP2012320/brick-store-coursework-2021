import {getAuthorizationHeader} from 'Scripts/auth0';
import createInputBox from 'Scripts/components/modal/productBody/inputBox/inputBox';
import {nameof, SERVER_BASE} from 'Scripts/helpers';
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
  const [images, setImages] = useState(props.key, props.existingProduct?.images ?? []);
  const [description, setDescription] = useState(props.key, props.existingProduct?.description ?? '');
  const [price, setPrice] = useState(props.key, props.existingProduct?.price.toString() ?? '');
  const [stock, setStock] = useState(props.key, props.existingProduct?.stock.toString() ?? '');
  const [type, setType] = useState(props.key, props.existingProduct?.type ?? '');
  const [colour, setColour] = useState(props.key, props.existingProduct?.colour ?? '');
  const [discount, setDiscount] = useState(props.key, props.existingProduct?.discount?.toString() ?? '');

  const container = createKeyedContainer('div', props.key, undefined, productBodyStyles.container);

  const imageUploadText = createElementWithStyles('label', {
    htmlFor: 'productImageUpload',
    textContent: 'Add an Image',
  }, productBodyStyles.imageContainer);

  const uploadImages = async (files: FileList) => {
    const responses = await Promise.all([...files].map(async (file) => {
      const url = new URL(`/api/v1/images/${props.existingProduct?.inventory_id ?? 'test1234'}`, SERVER_BASE);
      const formData = new FormData();
      formData.append('image', file);

      // Don't set content-type header here, otherwise the boundary is not set

      const response = await fetch(url.href, {
        body: formData,
        headers: await getAuthorizationHeader(),
        method: 'POST',
      });

      console.debug(response);

      return url;
    }));

    console.debug(responses);
  };

  const imageUploadInput = createElementWithStyles('input', {
    id: 'productImageUpload',
    onchange: (event) => {
      if (event.target instanceof HTMLInputElement && event.target.files) {
        uploadImages(event.target.files);
      }
    },
    type: 'file',
  }, productBodyStyles.hidden);

  const galleryContainer = createElementWithStyles('div', undefined, productBodyStyles.galleryContainer);

  const imagesContainers = images.map((image) => {
    const imageContainer = createElementWithStyles('div', {
      draggable: true,
      ondragover: (event) => {
        event.preventDefault();
      },
      ondragstart: (event) => {
        if (event.target instanceof HTMLElement) {
          event.dataTransfer?.setData('text/plain', image.order.toString());
        }
      },
      ondrop: (event) => {
        if (event.target instanceof HTMLElement) {
          const order = Number.parseInt(event.dataTransfer?.getData('text/plain') ?? '', 10);

          const newImages = [...images];
          const droppedImage = newImages.find((imageItem) => imageItem.order === order);

          if (droppedImage) {
            const temporary = image.order;
            image.order = droppedImage.order;
            droppedImage.order = temporary;
            newImages.sort((a, b) => a.order - b.order);
            setImages(newImages);
          }
        }
      },
    }, productBodyStyles.galleryImage);

    const imageElement = createElementWithStyles('img', {
      src: image.url,
    });

    const removeButton = createElementWithStyles('i', {
      title: 'Remove Image',
    }, productBodyStyles.biX);

    return htmlx`
    <${imageContainer}>
      <${imageElement}/>
      <${removeButton}/>
    </imageContainer>
    `;
  });

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
    <${imageUploadText}>
      <${imageUploadInput}/>
    </imageUploadText>
    <${galleryContainer}>
      <${imagesContainers}/>
    </galleryContainer>
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
