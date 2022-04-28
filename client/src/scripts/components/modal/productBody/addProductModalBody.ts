import {getAuthorizationHeader} from 'Scripts/auth0';
import createCheckbox from 'Scripts/components/modal/productBody/checkbox/checkbox';
import createInputBox from 'Scripts/components/modal/productBody/inputBox/inputBox';
import {getImageUrl, nameof, SERVER_BASE} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import {useRef} from 'Scripts/hooks/useRef';
import {useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles, createKeyedContainer} from 'Scripts/uiUtils';
import {type ReUsableComponentProps} from 'Types/types';
import {type ApiResponse, type Product} from 'api-types';
import productBodyStyles from './addProductModalBody.module.scss';

interface ModifyModalBody extends ReUsableComponentProps {
  closeModal: () => void;
  closed: boolean;
  existingProduct?: Product;
  reloadResults: () => void;
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

const deleteImagesFromServer = async (...imageIds: string[]) => {
  for (const imageId of imageIds) {
    const url = new URL(`/api/v1/staff/images/${imageId}`, SERVER_BASE);

    let response;

    try {
      response = await fetch(url.href, {
        headers: await getAuthorizationHeader(),
        method: 'DELETE',
      });
    } catch (error) {
      console.error(error);
      return;
    }

    if (!response.ok) {
      console.error(response);
    }
  }
};

export default function modifyProductModalBody (props: ModifyModalBody) {
  props.key ??= nameof(modifyProductModalBody);

  const [name, setName] = useState(props.key, props.existingProduct?.name ?? '');
  const [images, setImages] = useState(props.key, props.existingProduct?.images ?? []);
  const [description, setDescription] = useState(props.key, props.existingProduct?.description ?? '');
  const [price, setPrice] = useState(props.key, props.existingProduct?.price.toString() ?? '0');
  const [stock, setStock] = useState(props.key, props.existingProduct?.stock.toString() ?? '0');
  const [type, setType] = useState(props.key, props.existingProduct?.type ?? '');
  const [colour, setColour] = useState(props.key, props.existingProduct?.colour ?? '');
  const [discount, setDiscount] = useState(props.key, props.existingProduct?.discount?.toString() ?? '0');
  const [visibility, setVisibility] = useState(props.key, props.existingProduct?.visibility ?? true);
  const [submitMessage, setSubmitMessage] = useState<{ error: boolean, message: string, }>(props.key, {error: false, message: ''});
  const newImages = useRef<string[]>(props.key, []);

  useEffect(props.key, () => {}, [props.closed]);

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
      const url = new URL('/api/v1/staff/images', SERVER_BASE);
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

    newImages.current = [...newImages.current, ...filteredResponses];
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

          const newImagesOrder = [...images];
          const droppedImage = newImagesOrder[droppedIndex];

          if (droppedImage) {
            const temporary = newImagesOrder[index];
            newImagesOrder[index] = newImagesOrder[droppedIndex];
            newImagesOrder[droppedIndex] = temporary;
            setImages(newImagesOrder);
          }
        }
      },
    }, productBodyStyles.galleryImage);

    const imageElement = createElementWithStyles('img', {
      src: getImageUrl(image),
    });

    const removeButton = createElementWithStyles('i', {
      onclick: () => {
        if (newImages.current.includes(image)) {
          deleteImagesFromServer(image);
        }

        setImages((existingImages) => existingImages.filter((existingImage) => existingImage !== image));
      },
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
    label: 'Description (Max 2500 characters)',
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

  const visibilityCheckbox = createCheckbox({
    class: 'visibility',
    key: 'visibilityCheckbox',
    label: 'Visible on website',
    setValue: setVisibility,
    value: visibility,
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
      setVisibility(false);
      setImages([]);
      deleteImagesFromServer(...newImages.current);
      newImages.current = [];
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
      setVisibility(props.existingProduct?.visibility ?? false);
      setImages(props.existingProduct?.images ?? []);
      deleteImagesFromServer(...newImages.current);
      newImages.current = [];
    },
    textContent: 'Reset',
  }, productBodyStyles.resetButton);

  const onSubmit = async () => {
    const url = new URL('/api/v1/staff/products', SERVER_BASE);

    let response;

    try {
      response = await fetch(url.href, {
        body: JSON.stringify({
          product: {
            colour,
            description,
            discount,
            images,
            inventory_id: props.existingProduct?.inventory_id,
            name,
            price,
            stock,
            type,
            visibility,
          },
        }),
        headers: {
          'Content-Type': 'application/json',
          ...await getAuthorizationHeader(),
        },
        method: props.existingProduct ? 'PUT' : 'POST',
      });
    } catch (error) {
      console.error(error);
      setSubmitMessage({
        error: true,
        message: 'An error occurred while submitting the form',
      });

      setTimeout(() => setSubmitMessage({
        error: false,
        message: '',
      }), 5_000);

      return;
    }

    const body = await response.json() as ApiResponse;

    if (response.status === 200) {
      setSubmitMessage({
        error: false,
        message: `Product successfully ${props.existingProduct ? 'updated' : 'created'}`,
      });

      if (props.existingProduct?.images) {
        const deletedImages = props.existingProduct.images.filter((image) => !images.includes(image));
        deleteImagesFromServer(...deletedImages);
      }

      props.reloadResults();
    } else {
      setSubmitMessage({
        error: true,
        message: body.message,
      });
    }

    setTimeout(() => setSubmitMessage({
      error: false,
      message: '',
    }), 5_000);
  };

  const submitButton = createElementWithStyles('button', {
    onclick: () => {
      onSubmit();
    },
    textContent: 'Submit',
  }, productBodyStyles.submitButton);

  let messageContainer;

  if (submitMessage.message) {
    messageContainer = createElementWithStyles('div', undefined, productBodyStyles.messageContainer, productBodyStyles.visible);

    if (submitMessage.error) {
      messageContainer.classList.add(productBodyStyles.errored);
    } else {
      messageContainer.classList.add(productBodyStyles.success);
    }

    const message = createElementWithStyles('p', {
      textContent: submitMessage.message,
    });

    messageContainer = htmlx`
    <${messageContainer}>
      <${message}/>
    </errorContainer>
    `;
  } else {
    messageContainer = createElementWithStyles('div', undefined, productBodyStyles.messageContainer);
  }

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
    <${visibilityCheckbox}/>
    <${actionsContainer}>
      <${clearButton}/>
      <${resetButton}/>
      <${submitButton}/>
    </actionsContainer>
    <${messageContainer}/>
  </container>
  `;
}
