import createFilterBar from 'Scripts/components/filterBar';
import createShopCard from 'Scripts/components/shopCard';
import {nameof} from 'Scripts/helpers';
import useAsync from 'Scripts/hooks/useAsync';
import {registerUseState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElement, createElementWithStyles} from 'Scripts/uiUtils';
import contentRootStyles from 'Styles/components/contentRoot.module.scss';
import browseStyles from 'Styles/pages/browse.module.scss';

export interface BrowseProps {
  queryStrings?: Record<string, string>;
}

const useState = registerUseState(nameof(createBrowse));

const fetchProducts = async () => {
  try {
    const response = await fetch('http://0.0.0.0:8085/api/search', {
      body: JSON.stringify({query: 'torso'}),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    return await response.json();
  } catch (error) {
    console.debug(error);
  }

  return {};
};

export default function createBrowse (props: BrowseProps) {
  const [page, setPage] = useState(0);
  const [cards, setCards] = useState(null);

  const browseContainer = createElement('section', {
    id: contentRootStyles.contentRoot,
  });

  const filterBar = createFilterBar();

  const shoppingCardsContainer = createElementWithStyles(
    'div',
    undefined,
    browseStyles.shopCardsContainer,
  );

  const shoppingCards = [];

  for (let index = 0; index < 10; index++) {
    const card = createShopCard();

    shoppingCards.push(card);
  }

  // Used https://usehooks.com/useAsync/ as somewhat of a reference
  const [result, error, finished] = useAsync(nameof(createBrowse), fetchProducts, true);

  console.debug(result);
  console.debug(error);
  console.debug(finished);

  return htmlx`
    <${browseContainer}>
      <${filterBar}/>
      <${shoppingCardsContainer}>
        <${shoppingCards}/>
      </shoppingCardsContainer>
    </browseContainer>
  `;
}
