/*
  approve_inventory_request
  - Marks an inventory_request as approved (is_approved = true)
  - Decrements inventory_items.quanityAvailable by 1 for each inventory_request_items row
  - Inserts a notification referencing the inventory_request for the requesting user
*/
CREATE OR REPLACE FUNCTION public.approve_inventory_request(
  p_request_id bigint,
  p_approver uuid,
  p_comment text DEFAULT NULL
) RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  req_row RECORD;
  itm RECORD;
  updated_count INTEGER;
  notif_group_id bigint;
BEGIN
  -- Lock the request row to prevent concurrent handling
  SELECT * INTO req_row FROM public.inventory_request
  WHERE inventory_request_id = p_request_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Inventory request % not found', p_request_id;
  END IF;

  IF req_row.is_approved IS NOT NULL THEN
    RAISE EXCEPTION 'Inventory request % already processed', p_request_id;
  END IF;

  -- For each item requested, decrement available quantity by 1 (schema models single-item rows)
  FOR itm IN
    SELECT inventory_item_id FROM public.inventory_request_items WHERE inventory_request_id = p_request_id
  LOOP
    UPDATE public.inventory_items
    SET "quanityAvailable" = "quanityAvailable" - 1
    WHERE inventory_item_id = itm.inventory_item_id
      AND "quanityAvailable" >= 1;

    GET DIAGNOSTICS updated_count = ROW_COUNT;
    IF updated_count = 0 THEN
      RAISE EXCEPTION 'Insufficient stock for item %', itm.inventory_item_id;
    END IF;
  END LOOP;

  -- Mark request approved and record reviewer
  UPDATE public.inventory_request
  SET is_approved = true,
      user_reviewing_id = p_approver
  WHERE inventory_request_id = p_request_id;

  -- Mark request items as (implicitly) approved - set scanned flag if desired
  UPDATE public.inventory_request_items
  SET is_scanned_borrowed = true
  WHERE inventory_request_id = p_request_id;

  -- Ensure notification group exists
  SELECT notificationgroupid INTO notif_group_id FROM public.notification_group WHERE groupname = 'Inventory Requests' LIMIT 1;
  IF notif_group_id IS NULL THEN
    INSERT INTO public.notification_group (groupname) VALUES ('Inventory Requests') RETURNING notificationgroupid INTO notif_group_id;
  END IF;

  -- Insert a notification targeting the requester (notificationlink includes request id and user id)
  INSERT INTO public.notification (notificationgroupid, notificationtitle, notificationdescription, notificationlink)
  VALUES (
    notif_group_id,
    'Inventory Request Approved',
    'Your inventory request has been approved by an admin.',
    jsonb_build_object('inventory_request_id', p_request_id, 'user_id', req_row.user_requesting_id)
  );

  RETURN p_request_id;
END;
$$;
