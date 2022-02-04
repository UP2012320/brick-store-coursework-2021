CREATE FUNCTION search_inventory(_query text, _colour integer DEFAULT NULL, _type integer DEFAULT NULL,
                                 _minPrice numeric DEFAULT NULL, _maxPrice numeric DEFAULT NULL,
                                 _stock numeric DEFAULT NULL, _offset integer DEFAULT 0,
                                 _limit integer DEFAULT 20) RETURNS SETOF inventory
  LANGUAGE plpgsql
AS
$$
BEGIN
  RETURN QUERY
    SELECT *
    FROM inventory
    WHERE (_query IS NULL OR item_name ILIKE '%' || _query || '%')
      AND (_colour IS NULL OR colour = _colour)
      AND (_type IS NULL OR type = _type)
      AND ((_minPrice IS NULL OR price >= _minPrice) AND (_maxPrice IS NULL OR price <= _maxPrice))
      AND (_stock IS NULL OR stock >= _stock)
    OFFSET _offset LIMIT _limit;
END
$$;

ALTER FUNCTION search_inventory(text, integer, integer, numeric, numeric, numeric, integer, integer) OWNER TO brick_store_user;
