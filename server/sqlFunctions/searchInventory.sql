CREATE OR REPLACE FUNCTION search_inventory(_query text DEFAULT NULL)
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
  IF _query IS NULL THEN
    _query = '%%';
  END IF;

  IF NOT starts_with('%', _query) THEN
    _query = '%' || _query;
  END IF;

  IF _query NOT SIMILAR TO '%$' THEN
    _query = _query || '%';
  END IF;

  RETURN QUERY EXECUTE 'SELECT inventory_id AS "id", item_name AS "name", slug, description, price, stock, discount, ROUND(COALESCE(discount, 1) * price, 2) AS "discount_price", bc.colour_name AS "colour", bt.type_name FROM inventory ' ||
                       'JOIN brick_colours bc ON bc.colour_id = inventory.colour ' ||
                       'JOIN brick_types bt ON bt.type_id = inventory.type ' ||
                       'WHERE ($1 IS NULL OR item_name ILIKE ' || QUOTE_LITERAL(_query) || ')'
    USING _query;
END
$$;

ALTER FUNCTION search_inventory(text) OWNER TO brick_store_user;
