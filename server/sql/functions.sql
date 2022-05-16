create function get_all_orders()
  returns TABLE
          (
            "orderId"     character varying,
            "dateOrdered" date,
            "dateShipped" date,
            "inventoryId" character varying,
            quantity      integer,
            "userId"      character varying,
            email         character varying
          )
  language plpgsql
as
$$
BEGIN
  RETURN QUERY EXECUTE
            'SELECT o.order_id as "orderId", o.date_ordered, o.date_shipped, oi.inventory_id, oi.quantity, u.user_id, uo.email FROM orders o ' ||
            'JOIN order_items oi on o.order_id = oi.order_id ' ||
            'JOIN user_orders uo on o.order_id = uo.order_id ' ||
            'JOIN users u on u.email = uo.email ' ||
            'ORDER BY o.date_ordered DESC';
END
$$;

create function get_product_by_inventory_id(_inventory_id text)
  returns TABLE
          (
            inventory_id   character varying,
            name           character varying,
            slug           character varying,
            description    character varying,
            price          numeric,
            stock          integer,
            discount       numeric,
            discount_price numeric,
            colour         character varying,
            type           character varying
          )
  language plpgsql
as
$$
BEGIN
  RETURN QUERY EXECUTE
          'SELECT inventory_id, item_name AS "name", slug, description, price, stock, discount, ROUND((1 - COALESCE(discount, 0)) * price, 2) AS "discount_price", bc.colour_name AS "colour", bt.type_name FROM inventory ' ||
          'JOIN brick_colours bc ON bc.colour_id = inventory.colour ' ||
          'JOIN brick_types bt ON bt.type_id = inventory.type ' ||
          'WHERE inventory_id = $1'
    USING _inventory_id;
END
$$;

create function get_product_by_slug(_slug text)
  returns TABLE
          (
            inventory_id   character varying,
            name           character varying,
            slug           character varying,
            description    character varying,
            price          numeric,
            stock          integer,
            discount       numeric,
            discount_price numeric,
            colour         character varying,
            type           character varying
          )
  language plpgsql
as
$$
BEGIN
  RETURN QUERY EXECUTE
          'SELECT inventory_id, item_name AS "name", slug, description, price, stock, discount, ROUND((1 - COALESCE(discount, 0)) * price, 2) AS "discount_price", bc.colour_name AS "colour", bt.type_name FROM inventory ' ||
          'JOIN brick_colours bc ON bc.colour_id = inventory.colour ' ||
          'JOIN brick_types bt ON bt.type_id = inventory.type ' ||
          'WHERE slug = $1'
    USING _slug;
END
$$;

create function search_inventory(_query text DEFAULT NULL::text, _offset integer DEFAULT NULL::integer, _colour_ids text DEFAULT NULL::text, _type_ids text DEFAULT NULL::text, _order_column text DEFAULT NULL::text, _order_direction text DEFAULT NULL::text, _slug text DEFAULT NULL::text)
  returns TABLE(inventory_id character varying, name character varying, slug character varying, description character varying, price numeric, stock integer, visibility boolean, date_added timestamp without time zone, images text, discount numeric, discount_price numeric, colour character varying, colour_id integer, type character varying, type_id integer)
  language plpgsql
as
$$
BEGIN
  _query = COALESCE(_query, '%%');

  IF NOT STARTS_WITH('%', _query) THEN
    _query = '%' || _query;
  END IF;

  IF _query NOT SIMILAR TO '%$' THEN
    _query = _query || '%';
  END IF;

  _offset = COALESCE(_offset, 0);
  _order_column = COALESCE(_order_column, 'item_name');
  _order_direction = COALESCE(_order_direction, 'asc');

  RETURN QUERY EXECUTE 'SELECT inventory.inventory_id, item_name AS "name", slug, description, price, stock, visible AS "visibility", date_added, string_agg(ii.image_id, '', '') AS "images", discount, ROUND((1 - COALESCE(discount, 0)) * price, 2) AS "discount_price", bc.colour_name AS "colour", bc.colour_id, bt.type_name, bt.type_id FROM inventory ' ||
                       'JOIN brick_colours bc ON bc.colour_id = inventory.colour ' ||
                       'JOIN brick_types bt ON bt.type_id = inventory.type ' ||
                       'LEFT JOIN inventory_images ii on inventory.inventory_id = ii.inventory_id ' ||
                       'WHERE ($1 IS NULL OR item_name ILIKE ' || QUOTE_LITERAL(_query) || ') AND ' ||
                       '($2 IS NULL OR bc.colour_id = ANY(' || QUOTE_LITERAL(COALESCE(_colour_ids, '{}')) || '::int[])) AND ' ||
                       '($3 IS NULL OR bt.type_id = ANY(' || QUOTE_LITERAL(COALESCE(_type_ids, '{}')) || '::int[])) AND ' ||
                       '($4 IS NULL OR slug = ' || QUOTE_LITERAL(COALESCE(_slug, '')) || ') ' ||
                       'GROUP BY inventory.inventory_id, bc.colour_name, bc.colour_id, bt.type_name, bt.type_id ' ||
                       'ORDER BY ' || quote_ident(_order_column) || (CASE WHEN lower(_order_direction) = 'desc' THEN ' desc ' ELSE ' asc ' END) ||
                       'LIMIT 50 OFFSET $5'

    USING _query, _colour_ids, _type_ids, _slug, _offset;
END
$$;

alter function search_inventory(text, integer, text, text, text, text, text) owner to brick_store_user;
