import createInventoryTable from 'Scripts/components/inventoryTable/inventoryTable';
import createModal from 'Scripts/components/modal/modal';
import {nameof, SortSetting} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import useSearch from 'Scripts/hooks/useSearch';
import {useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElement} from 'Scripts/uiUtils';

const key = nameof(createManageProducts);

export default function createManageProducts () {
  const [sortSetting, setSortSetting] = useState(key, new SortSetting('item_name', 'asc'));
  const [addModalIsOpen, setAddModalIsOpen] = useState(key, false);

  const [searchResults, setSearchState, pageNumber, noMoreResults, requestError] = useSearch(key);

  useEffect(key, () => {
    setSearchState({
      newSearchFilters: {
        sort: [sortSetting.toString()],
      },
    });
  }, [sortSetting]);

  const inventoryTable = createInventoryTable({rows: searchResults, setAddModalIsOpen, setSearchSettings: setSearchState, setSortSetting, sortSetting});

  let addModal;

  if (addModalIsOpen) {
    const modalBody = createElement('p', {textContent: 'test'});

    addModal = createModal({
      body: htmlx`<${modalBody}/>`,
      isOpen: addModalIsOpen,
      key: 'addModal',
      setIsOpen: setAddModalIsOpen,
    });
  }

  return [inventoryTable, addModal];
}
