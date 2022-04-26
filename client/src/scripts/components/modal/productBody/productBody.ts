import {getAuthorizationHeader} from 'Scripts/auth0';
import createInputBox from 'Scripts/components/modal/productBody/inputBox/inputBox';
import {getImageUrl, nameof, SERVER_BASE} from 'Scripts/helpers';
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

  const test = createElementWithStyles('p', {
    textContent: '\nMax 10MB, (JPG or PNG)',
  }, productBodyStyles.imageContainerSubheading);

  const uploadImages = async (files: FileList) => {
    const responses = await Promise.all([...files].map(async (file) => {
      const url = new URL('/api/v1/images', SERVER_BASE);
      const formData = new FormData();
      formData.append('image', file);

      // Don't set content-type header here, otherwise the boundary is not set

      let response;

      try {
        response = await fetch(url.href, {
          body: formData,
          headers: await getAuthorizationHeader(),
          method: 'POST',
        });
      } catch (error) {
        console.error(error);
        return undefined;
      }

      if (!response.ok) {
        console.error(response);
        return undefined;
      }

      const image = await response.json() as { id: string, };

      return image.id;
    }));

    const filteredResponses = responses
      .filter(Boolean) as string[];

    setImages((existingImages) => [...existingImages, ...filteredResponses]);
  };

  const imageUploadInput = createElementWithStyles('input', {
    accept: 'image/jpg,image/jpeg,image/png',
    id: 'productImageUpload',
    max: '16',
    multiple: true,
    onchange: (event) => {
      if (event.target instanceof HTMLInputElement && event.target.files) {
        if (event.target.files.length + images.length > 16) {
          // Add a message later
          return;
        }

        uploadImages(event.target.files);
      }
    },
    type: 'file',
  }, productBodyStyles.hidden);

  const galleryContainer = createElementWithStyles('div', undefined, productBodyStyles.galleryContainer);

  const imagesContainers = images.map((image, index) => {
    const imageContainer = createElementWithStyles('div', {
      draggable: true,
      ondragover: (event) => {
        event.preventDefault();
      },
      ondragstart: (event) => {
        if (event.target instanceof HTMLElement) {
          event.dataTransfer?.setData('text/plain', index.toString());
        }
      },
      ondrop: (event) => {
        if (event.target instanceof HTMLElement) {
          const droppedIndex = Number.parseInt(event.dataTransfer?.getData('text/plain') ?? '', 10);

          const newImages = [...images];
          const droppedImage = newImages[droppedIndex];

          if (droppedImage) {
            const temporary = newImages[index];
            newImages[index] = newImages[droppedIndex];
            newImages[droppedIndex] = temporary;
            setImages(newImages);
          }
        }
      },
    }, productBodyStyles.galleryImage);

    const imageElement = createElementWithStyles('img', {
      src: getImageUrl(image),
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
    <${test}/>
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
