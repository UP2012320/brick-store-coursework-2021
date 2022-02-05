CREATE OR REPLACE FUNCTION search_inventory(_query text, _colour integer DEFAULT NULL, _type integer DEFAULT NULL,
                                            _minPrice numeric DEFAULT NULL, _maxPrice numeric DEFAULT NULL,
                                            _stock numeric DEFAULT NULL, _sort text DEFAULT 'item_name',
                                            _sortDirection integer DEFAULT 0, _offset integer DEFAULT 0,
                                            _limit integer DEFAULT 20) RETURNS SETOF inventory
  LANGUAGE plpgsql
AS
$$
BEGIN
  IF NOT starts_with('%', _query) THEN
    _query = '%' || _query;
  END IF;

  IF NOT _query SIMILAR TO '%$' THEN
    _query = _query || '%';
  END IF;

  IF _offset IS NULL THEN
    _offset = 0;
  END IF;

  IF _limit IS NULL THEN
    _limit = 20;
  END IF;

  IF _sort IS NULL THEN
    _sort = 'item_name';
  END IF;

  IF _sortDirection IS NULL THEN
    _sortDirection = 0;
  END IF;

  RETURN QUERY EXECUTE 'SELECT * FROM inventory ' ||
                       'WHERE ($1 IS NULL OR item_name ILIKE ' || QUOTE_LITERAL(_query) || ') AND ' ||
                       '($2 IS NULL OR colour = $2) AND ' ||
                       '($3 IS NULL OR type = $3) AND ' ||
                       '(($4 IS NULL OR price >= $4) AND ($5 IS NULL OR price <= $5)) AND ' ||
                       '($6 IS NULL OR stock >= $6)' ||
                       'ORDER BY ' || QUOTE_IDENT(_sort) || ' ' ||
                       CASE WHEN _sortDirection = 0 THEN 'ASC' WHEN _sortDirection = 1 THEN 'DESC' END || ' ' ||
                       'OFFSET $7 LIMIT $8'
    USING _query, _colour, _type, _minPrice, _maxPrice, _stock, _offset, _limit;
END
$$;

ALTER FUNCTION search_inventory(text, integer, integer, numeric, numeric, numeric, text, integer, integer, integer) OWNER TO brick_store_user;
