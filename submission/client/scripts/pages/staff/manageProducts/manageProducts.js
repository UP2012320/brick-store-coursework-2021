import createInventoryTable from 'Scripts/components/inventoryTable/inventoryTable';
import createModal from 'Scripts/components/modal/modal';
import modifyProductModalBody from 'Scripts/components/modal/productBody/addProductModalBody';
import {nameof, SortSetting} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import useSearch from 'Scripts/hooks/useSearch';
import {useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';

const key = nameof(createManageProducts);
export default function createManageProducts() {
  const [sortSetting, setSortSetting] = useState(key, new SortSetting('item_name', 'asc'));
  const [addModalIsOpen, setAddModalIsOpen] = useState(key, false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(key, false);
  const [productToEdit, setProductToEdit] = useState(key, undefined);
  const [searchResults, setSearchState, reload, pageNumber, noMoreResults, requestError] = useSearch(key);
  useEffect(key, () => {
    setSearchState({
      newSearchFilters: {
        sort: [sortSetting.toString()],
      },
    });
  }, [sortSetting]);
  const inventoryTable = createInventoryTable({
    reloadResults: reload,
    rows: searchResults,
    setAddModalIsOpen,
    setEditModalIsOpen,
    setProductToEdit,
    setSearchSettings: setSearchState,
    setSortSetting,
    sortSetting,
  });
  let modifyModal;
  if (addModalIsOpen) {
    const modalBody = modifyProductModalBody({
      closed: addModalIsOpen,
      closeModal: () => setAddModalIsOpen(false),
      reloadResults: reload,
    });
    modifyModal = createModal({
      body: htmlx`<${modalBody}/>`,
      isOpen: addModalIsOpen,
      key: 'addModal',
      setIsOpen: setAddModalIsOpen,
      title: 'Add Product',
    });
  }
  if (editModalIsOpen) {
    const modalBody = modifyProductModalBody({
      closed: editModalIsOpen,
      closeModal: () => setEditModalIsOpen(false),
      existingProduct: productToEdit,
      reloadResults: reload,
    });
    modifyModal = createModal({
      body: htmlx`<${modalBody}/>`,
      isOpen: editModalIsOpen,
      key: 'editModal',
      setIsOpen: setEditModalIsOpen,
      title: 'Edit Product',
    });
  }
  return [inventoryTable, modifyModal];
}
