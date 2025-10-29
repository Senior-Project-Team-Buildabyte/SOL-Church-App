-- Creates an inventory request and associated items atomically.
-- Deploy this to your Supabase Postgres instance (SQL editor).
-- Usage: SELECT create_inventory_request('00000000-0000-0000-0000-000000000000'::uuid, ARRAY[1,2,3]);

CREATE OR REPLACE FUNCTION create_inventory_request(
  p_user_requesting_id uuid,
  p_item_ids bigint[]
) RETURNS bigint AS $$
DECLARE
  req_id bigint;
  notif_group_id bigint;
BEGIN
  -- Insert the request (pending approval)
  INSERT INTO inventory_request (user_requesting_id, is_approved, start_date)
  VALUES (p_user_requesting_id, NULL, CURRENT_DATE)
  RETURNING inventory_request_id INTO req_id;

  -- Insert requested items
  INSERT INTO inventory_request_items (inventory_request_id, inventory_item_id)
  SELECT req_id, unnest_id FROM unnest(p_item_ids) AS unnest_id;

  -- Ensure a notification group exists for inventory requests (create if missing)
  SELECT notificationgroupid INTO notif_group_id FROM notification_group WHERE groupname = 'Inventory Requests' LIMIT 1;
  IF notif_group_id IS NULL THEN
    INSERT INTO notification_group (groupname) VALUES ('Inventory Requests') RETURNING notificationgroupid INTO notif_group_id;
  END IF;

  -- Create a simple notification for admins (uses notif_group_id)
  INSERT INTO notification (notificationtitle, notificationdescription, notificationgroupid, notificationlink, notificationscheduledtime)
  VALUES (
    'New Inventory Request',
    format('User %s requested %s items (request #%s)', p_user_requesting_id, array_length(p_item_ids,1), req_id),
    notif_group_id,
    json_build_object('inventory_request_id', req_id),
    NULL
  );

  RETURN req_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
