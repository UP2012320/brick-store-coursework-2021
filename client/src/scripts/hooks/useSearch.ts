import {SERVER_BASE} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import {useRef} from 'Scripts/hooks/useRef';
import {useState} from 'Scripts/hooks/useState';
import type {Product, SearchQueryResponse} from 'api-types';

const maxSearchResults = 50;

export interface SearchArguments {
  filters: Record<string, string[]>;
  query: string;
}

export interface SetSearchStateArguments {
  isNewSearch?: boolean;
  newPage?: number;
  newSearchFilters?: Record<string, string[]>;
  newSearchQuery?: string;
}

export default function useSearch (key: string,
  defaultSearchArguments: SearchArguments = {
    filters: {colours: [], sort: ['item_name'], types: []},
    query: '',
  }): [products: Product[], setSearchState: (newArguments: SetSearchStateArguments) => void, pageNumber: number, noMoreResults: boolean, requestError: string | undefined] {
  const [searchResults, setSearchResults] = useState<Product[]>(key, []);
  const [searchArguments, setSearchArguments] = useState<SearchArguments>(key, defaultSearchArguments);
  const [requestError, setRequestError] = useState<string | undefined>(key, undefined);
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

    const data = await response.json() as SearchQueryResponse;

    if (data.results.length < maxSearchResults) {
      setNoMoreResults(true);
    }

    // eslint-disable-next-line require-atomic-updates
    setSearchResults((previousSearchResults) => {
      if (previousSearchResults && !isNewSearch.current) {
        return [...previousSearchResults, ...data.results];
      } else {
        isNewSearch.current = false;
        return data.results;
      }
    });
  };

  useEffect(key, () => {
    search();
  }, []);

  useEffect(key, () => {
    search();
  }, [searchArguments]);

  const setSearchState = (newArguments: SetSearchStateArguments) => {
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

  return [searchResults, setSearchState, page.current, noMoreResults, requestError];
}
