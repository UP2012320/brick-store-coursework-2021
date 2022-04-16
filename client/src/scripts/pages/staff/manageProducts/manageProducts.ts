import {nameof} from 'Scripts/helpers';
import useSearch from 'Scripts/hooks/useSearch';
import htmlx from 'Scripts/htmlX';

const key = nameof(createManageProducts);

export default function createManageProducts () {
  const [searchResults, setSearchState, pageNumber, noMoreResults, requestError] = useSearch(key);

  return [htmlx``];
}
