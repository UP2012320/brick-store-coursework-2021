import {SERVER_BASE} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import {useRef} from 'Scripts/hooks/useRef';
import {useState} from 'Scripts/hooks/useState';

const maxSearchResults = 50;
export default function useSearch(key, defaultSearchArguments = {
  filters: {colours: [], sort: ['item_name'], types: []},
  query: '',
}) {
  const [searchResults, setSearchResults] = useState(key, []);
  const [searchArguments, setSearchArguments] = useState(key, defaultSearchArguments);
  const [requestError, setRequestError] = useState(key, undefined);
  const [noMoreResults, setNoMoreResults] = useState(key, false);
  const page = useRef(key, 0);
  const isNewSearch = useRef(key, true);
  const search = async () => {
    setRequestError(undefined);
    const url = new URL('/api/v1/search', SERVER_BASE);
    url.searchParams.set('query', searchArguments.query);
    console.debug(page.current);
    url.searchParams.set('offset', (page.current * maxSearchResults).toString());
    for (const [filterKey, value] of Object.entries(searchArguments.filters)) {
      if (value.length > 1) {
        url.searchParams.set(filterKey, value.join(','));
      } else if (value.length === 1) {
        url.searchParams.set(filterKey, value[0]);
      }
    }
    let response;
    try {
      response = await fetch(url.href);
    } catch (error) {
      if (error instanceof Error) {
        setRequestError(error.message);
      }
      return;
    }
    if (!response.ok) {
      setRequestError(response.statusText);
      return;
    }
    const data = await response.json();
    if (data.length < maxSearchResults) {
      setNoMoreResults(true);
    }
    // eslint-disable-next-line require-atomic-updates
    setSearchResults((previousSearchResults) => {
      if (previousSearchResults && !isNewSearch.current) {
        return [...previousSearchResults, ...data];
      } else {
        isNewSearch.current = false;
        return data;
      }
    });
  };
  useEffect(key, () => {
    search();
  }, []);
  useEffect(key, () => {
    search();
  }, [searchArguments]);
  const setSearchState = (newArguments) => {
    page.current = newArguments.newPage ?? page.current;
    isNewSearch.current = newArguments.isNewSearch ?? false;
    if (newArguments.newSearchQuery || newArguments.newSearchFilters) {
      page.current = 0;
      isNewSearch.current = true;
    }
    const changed = setSearchArguments((previousSearchArguments) => {
      const newSearchArguments = {...previousSearchArguments};
      newSearchArguments.query = newArguments.newSearchQuery ?? previousSearchArguments.query;
      if (newSearchArguments.filters) {
        newSearchArguments.filters = {...previousSearchArguments.filters, ...newArguments.newSearchFilters};
      } else {
        newSearchArguments.filters = newArguments.newSearchFilters ?? previousSearchArguments.filters;
      }
      return newSearchArguments;
    });
    if (!changed && newArguments.newPage) {
      search();
    }
  };
  const reload = () => {
    isNewSearch.current = true;
    search();
  };
  return [searchResults, setSearchState, reload, page.current, noMoreResults, requestError];
}
