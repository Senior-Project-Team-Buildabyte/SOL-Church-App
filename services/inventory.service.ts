// services/inventory.service.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/types/database.types';

// Create a typed Supabase client
const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ''
);

type Item = Database['public']['Tables']['inventory_items']['Row'];
type ItemInsert = Database['public']['Tables']['inventory_items']['Insert'];
type ItemUpdate = Database['public']['Tables']['inventory_items']['Update'];

// Helper type for item quantity updates
type ItemQuantityUpdate = {
  id: number;
  quantity: number;
};

// ---------- NEW: Borrow/Return (via loans) ----------
export type BorrowItem = Item & {
  loan_id: number;
  my_borrowed_quantity: number;
};

export const inventoryService = {
  // Get a single item by ID
  getItemById: async (id: number): Promise<Item> => {
    const { data, error } = await (supabase as any)
      .from('items')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new Error(error?.message || `Item with ID ${id} not found`);
    }

    return data as Item;
  },

  // Get all items with optional filters
  getItems: async (filters: {
    availableOnly?: boolean;
    searchTerm?: string;
    categoryId?: number;
  } = {}): Promise<Item[]> => {
    let query = supabase.from('inventory_items').select('*');

    if (filters.availableOnly) {
      // NOTE: adjust this column name to your schema if needed
      query = query.gt('quantity_available', 0);
    }

    if (filters.searchTerm) {
      query = query.ilike('item_name', `%${filters.searchTerm}%`);
    }

    if (filters.categoryId) {
      // NOTE: adjust this column name to your schema if needed
      query = query.eq('category_id', filters.categoryId);
    }

    const { data, error } = await query.order('item_name', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get item by ID
  getItem: async (id: number): Promise<Item> => {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Item;
  },

  // Create new item
  createItem: async (item: ItemInsert): Promise<Item> => {
    const { data, error } = await supabase
      .from('inventory_items')
      .insert(item as any) // Type assertion to bypass type checking
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || 'Failed to create item');
    }
    return data as Item;
  },

  // Update item
  updateItem: async (id: number, updates: Partial<Item>): Promise<Item> => {
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await (supabase as any)
      .from('inventory_items')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || 'Failed to update item');
    }
    return data as Item;
  },

  // Delete item
  deleteItem: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Checkout items (decrease quantity) - existing RPC path
  checkoutItems: async (items: ItemQuantityUpdate[]): Promise<Item[]> => {
    return await Promise.all(
      items.map(async ({ id, quantity }) => {
        const { data: updatedItem, error } = await (supabase.rpc as any)('decrease_item_quantity', {
          item_id: id,
          amount: quantity
        });

        if (error) throw error;
        return updatedItem as Item;
      })
    );
  },

  // Return items (increase quantity) - existing RPC path
  returnItems: async (items: ItemQuantityUpdate[]): Promise<Item[]> => {
    return await Promise.all(
      items.map(async ({ id, quantity }) => {
        const { data: updatedItem, error } = await (supabase.rpc as any)('increase_item_quantity', {
          item_id: id,
          amount: quantity
        });

        if (error) throw error;
        return updatedItem as Item;
      })
    );
  },

  // Get all categories
  getCategories: async () => {
    const { data, error } = await supabase
      .from('item_category')
      .select('*')
      .order('item_category_name', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // ---------- NEW: Loans-backed return flow ----------

  /**
   * Load the signed-in user's active loans, joined with inventory_items for display.
   * Requires RLS: SELECT on loans where auth.uid() = user_id.
   */
  getMyBorrowedItems: async (): Promise<BorrowItem[]> => {
    const { data, error } = await (supabase.from as any)('loans')
      .select(`
        id,
        item_id,
        quantity,
        checked_out_at,
        inventory_items:item_id (
          inventory_item_id,
          item_name,
          item_description,
          item_location,
          quanityTotal,
          quanityAvailable
        )
      `)
      .is('returned_at', null);

    if (error) throw error;

    return (data ?? []).map((row: any) => ({
      ...row.inventory_items,
      loan_id: row.id,
      my_borrowed_quantity: row.quantity,
    }));
  },

  /**
   * Full returns: set returned_at on the given loan IDs.
   * Requires RLS: UPDATE on loans where auth.uid() = user_id.
   */
  returnLoans: async (loanIds: number[]): Promise<void> => {
    if (!loanIds?.length) return;
    const { error } = await (supabase.from as any)('loans')
      .update({ returned_at: new Date().toISOString() })
      .in('id', loanIds);

    if (error) throw error;
  },
};

