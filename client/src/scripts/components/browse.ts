import Component from 'Scripts/framework/component';
import ComponentElement from 'Scripts/framework/componentElement';
import {createElement, createElementWithStyles} from 'Scripts/uiUtils';
import styles from 'Styles/browse.module.scss';
import images from 'Assets/2412b.png';

export default class Browse extends Component {
  protected _setComponentRoot(): ComponentElement {
    return new ComponentElement(createElement('div', {
      id: styles.browse,
    }));
  }

  protected _internalBuild(componentRoot: ComponentElement): Element {
    const card = this._componentInstances.createInstance(new ShopCard({}), 'card');

    const cardContainer = createElementWithStyles('div', undefined, styles.shopCardContainer);

    return componentRoot.useMapping([
      {
        cardContainer,
        children: [
          card,
        ],
      },
    ]).end();
  }
}

export class ShopCard extends Component {
  protected _internalBuild(componentRoot: ComponentElement): Element {
    const image = createElementWithStyles('img', {
      src: images,
      loading: 'lazy',
    }, styles.shopCardImg);

    const title = createElementWithStyles('p', {
      textContent: 'Lego Brick #1',
    }, styles.shopCardTitle);

    const idStockRow = createElementWithStyles('div', undefined, styles.shopCardRowId);

    idStockRow.style.gridArea = 'idRow';

    const id = createElementWithStyles('p', {
      textContent: '#E438OR',
    }, styles.shopCardId);

    const stock = createElementWithStyles('p', {
      textContent: '4+ Stock',
    }, styles.shopCardStock);

    const price = createElementWithStyles('p', {
      textContent: '£0.10'
    }, styles.shopCardPrice);

    const actionsRow = createElementWithStyles('div', undefined, styles.shopCardRowActions);

    actionsRow.style.gridArea = 'actionsRow';

    const viewButton = createElementWithStyles('div', {
      textContent: 'View'
    }, styles.shopCardButton);

    const addButton = createElementWithStyles('div', {
      textContent: 'Add'
    }, styles.shopCardButton);

    return componentRoot.useMapping([
      image,
      title,
      {
        idStockRow,
        children: [
          id,
          stock
        ],
      },
      price,
      {
        actionsRow,
        children: [
          viewButton,
          addButton
        ]
      }
    ]).end();
  }
}
