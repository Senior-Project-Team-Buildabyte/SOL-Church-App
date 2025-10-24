import { supabase } from '../lib/supabase';

export const requestService = {
  createInventoryRequest: async (userId: string, itemIds: number[]) => {
    // Calls the create_inventory_request RPC on the DB
    const { data, error } = await (supabase.rpc as any)('create_inventory_request', {
      p_user_requesting_id: userId,
      p_item_ids: itemIds,
    });

    if (error) throw error;
    return data as number; // request id
  }
  ,
  approveInventoryRequest: async (requestId: number, approverId: string, comment?: string) => {
    const { data, error } = await (supabase.rpc as any)('approve_inventory_request', {
      p_request_id: requestId,
      p_approver: approverId,
      p_comment: comment ?? null,
    });

    if (error) throw error;
    return data as number;
  }
  ,
  // Raw RPC caller returning full supabase response for debugging
  approveInventoryRequestRaw: async (requestId: number, approverId: string, comment?: string) => {
    return await (supabase.rpc as any)('approve_inventory_request', {
      p_request_id: requestId,
      p_approver: approverId,
      p_comment: comment ?? null,
    });
  }
};

export default requestService;
