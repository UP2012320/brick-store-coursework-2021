CREATE OR REPLACE FUNCTION search_inventory(_query text, _colour integer DEFAULT NULL, _type integer DEFAULT NULL,
                                            _minPrice numeric DEFAULT NULL, _maxPrice numeric DEFAULT NULL,
                                            _stock numeric DEFAULT NULL, _sort text DEFAULT 'item_name',
                                            _sortDirection integer DEFAULT 0, _offset integer DEFAULT 0,
                                            _limit integer DEFAULT 20)
  RETURNS TABLE (
                  id             varchar(11),
                  name           varchar(500),
                  slug           varchar(500),
                  description    varchar(2500),
                  price          numeric,
                  stock          integer,
                  discount       numeric,
                  discount_price numeric,
                  colour         varchar(100),
                  type           varchar(100)
                )
  LANGUAGE plpgsql
AS
$$
BEGIN
  IF NOT starts_with('%', _query) THEN
    _query = '%' || _query;
  END IF;

  IF _query NOT SIMILAR TO '%$' THEN
    _query = _query || '%';
  END IF;

  _offset = COALESCE(_offset, 0);

  _limit = COALESCE(_limit, 20);

  _sort = COALESCE(_sort, 'item_name');

  _sortDirection = COALESCE(_sortDirection, 0);

  RETURN QUERY EXECUTE 'SELECT inventory_id AS "id", item_name AS "name", slug, description, price, stock, discount, ROUND(COALESCE(discount, 1) * price, 2) AS "discount_price", bc.colour_name AS "colour", bt.type_name FROM inventory ' ||
                       'JOIN brick_colours bc ON bc.colour_id = inventory.colour ' ||
                       'JOIN brick_types bt ON bt.type_id = inventory.type ' ||
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
