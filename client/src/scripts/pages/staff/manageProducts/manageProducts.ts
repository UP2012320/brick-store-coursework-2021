import createInventoryTable from 'Scripts/components/inventoryTable/inventoryTable';
import {nameof, SortSetting} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import useSearch from 'Scripts/hooks/useSearch';
import {useState} from 'Scripts/hooks/useState';

const key = nameof(createManageProducts);

export default function createManageProducts () {
  const [sortSetting, setSortSetting] = useState(key, new SortSetting('item_name', 'asc'));

  const [searchResults, setSearchState, pageNumber, noMoreResults, requestError] = useSearch(key);

  useEffect(key, () => {
    setSearchState({
      newSearchFilters: {
        sort: [sortSetting.toString()],
      },
    });
  }, [sortSetting]);

  const inventoryTable = createInventoryTable({rows: searchResults, setSortSetting, sortSetting});

  return [inventoryTable];
}
