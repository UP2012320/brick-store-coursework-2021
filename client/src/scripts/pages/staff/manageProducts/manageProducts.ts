import createInventoryTable from 'Scripts/components/inventoryTable/inventoryTable';
import {nameof} from 'Scripts/helpers';
import useSearch from 'Scripts/hooks/useSearch';

const key = nameof(createManageProducts);

export default function createManageProducts () {
  const [searchResults, setSearchState, pageNumber, noMoreResults, requestError] = useSearch(key);

  const inventoryTable = createInventoryTable();

  return [inventoryTable];
}
