// inventory.service.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/types/database.types';

// --- Env + client ------------------------------------------------------------
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_URL. Set it in .env.development (or .env) before running the app.'
  );
}
if (!anon) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_ANON_KEY. Set it in .env.development (or .env) before running the app.'
  );
}

const supabase = createClient<Database>(url, anon);

// --- Types -------------------------------------------------------------------
const INVENTORY_TABLE = 'inventory_items' as const;

type Item = Database['public']['Tables']['inventory_items']['Row'];
type ItemInsert = Database['public']['Tables']['inventory_items']['Insert'];
type ItemUpdate = Database['public']['Tables']['inventory_items']['Update'];

type ItemQuantityUpdate = {
  id: number;
  quantity: number;
};

// --- Service -----------------------------------------------------------------
export const inventoryService = {
  /** Get a single item by ID */
  getItemById: async (id: number): Promise<Item> => {
    const { data, error } = await supabase
      .from(INVENTORY_TABLE)
      .select('*')
      .eq('inventory_item_id', id)
      .single();

    if (error || !data) {
      throw new Error(error?.message || `Item with ID ${id} not found`);
    }
    return data as Item;
  },

  /**
   * Get items with optional filters
   * - availableOnly: requires is_available = true AND quantity_available > 0
   * - searchTerm: case-insensitive match on item_name
   * - categoryId: exact match on category_id
   */
  getItems: async (filters: {
    availableOnly?: boolean;
    searchTerm?: string;
    categoryId?: number;
  } = {}): Promise<Item[]> => {
    let query = supabase.from(INVENTORY_TABLE).select('*');

    if (filters.availableOnly) {
      // treat "available" as both flag + stock
      query = query.eq('is_available', true).gt('quantity_available', 0);
    }

    if (filters.searchTerm?.trim()) {
      query = query.ilike('item_name', `%${filters.searchTerm.trim()}%`);
    }

    if (filters.categoryId) {
      query = query.eq('item_category_id', filters.categoryId);
    }

    const { data, error } = await query.order('item_name', { ascending: true });
    if (error) throw error;
    return (data ?? []) as Item[];
  },

  /** Shortcut: list only available items */
  listAvailableItems: async (): Promise<Item[]> => {
    const { data, error } = await supabase
      .from(INVENTORY_TABLE)
      .select('*')
      .eq('is_available', true)
      .gt('quantity_available', 0)
      .order('item_name', { ascending: true });

    if (error) throw error;
    return (data ?? []) as Item[];
  },

  /** Get item by ID (alias kept for backwards compatibility) */
  getItem: async (id: number): Promise<Item> => {
    const { data, error } = await supabase
      .from(INVENTORY_TABLE)
      .select('*')
      .eq('inventory_item_id', id)
      .single();

    if (error) throw error;
    return data as Item;
  },

  /** Create an item */
  createItem: async (item: ItemInsert): Promise<Item> => {
    const { data, error } = await supabase
      .from(INVENTORY_TABLE)
      .insert(item as any)
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || 'Failed to create item');
    }
    return data as Item;
  },

  /** Update an item (auto-stamps updated_at) */
  updateItem: async (id: number, updates: Partial<Item>): Promise<Item> => {
    const updateData: ItemUpdate = {
      ...(updates as ItemUpdate),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from(INVENTORY_TABLE)
      .update(updateData)
      .eq('inventory_item_id', id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || 'Failed to update item');
    }
    return data as Item;
  },

  /** Delete an item */
  deleteItem: async (id: number): Promise<void> => {
    const { error } = await supabase.from(INVENTORY_TABLE).delete().eq('inventory_item_id', id);
    if (error) throw error;
  },

  // --- Availability controls -------------------------------------------------

  /** Set item availability flag explicitly */
  setItemAvailability: async (id: number, is_available: boolean): Promise<Item> => {
    const { data, error } = await supabase
      .from(INVENTORY_TABLE)
      .update({ is_available, updated_at: new Date().toISOString() } as ItemUpdate)
      .eq('inventory_item_id', id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || 'Failed to update availability');
    }
    return data as Item;
  },

  /** Toggle availability and return the updated row */
  toggleItemAvailability: async (id: number): Promise<Item> => {
    const current = await inventoryService.getItemById(id);
    return inventoryService.setItemAvailability(id, !current.is_available);
  },

  // --- Quantity mutations (via RPC) -----------------------------------------

  /** Checkout items: decreases quantity atomically via RPC */
  checkoutItems: async (items: ItemQuantityUpdate[]): Promise<Item[]> => {
    return Promise.all(
      items.map(async ({ id, quantity }) => {
        const { data: updatedItem, error } = await (supabase.rpc as any)(
          'decrease_item_quantity',
          { item_id: id, amount: quantity }
        );
        if (error) throw error;

        // Optional: if an item is now 0, mark unavailable
        if (updatedItem?.quantity_available === 0 && updatedItem?.id) {
          try {
            await inventoryService.setItemAvailability(updatedItem.id, false);
          } catch {
            // ignore availability flip failures; quantity already updated
          }
        }

        return updatedItem as Item;
      })
    );
  },

  /** Return items: increases quantity atomically via RPC */
  returnItems: async (items: ItemQuantityUpdate[]): Promise<Item[]> => {
    return Promise.all(
      items.map(async ({ id, quantity }) => {
        const { data: updatedItem, error } = await (supabase.rpc as any)(
          'increase_item_quantity',
          { item_id: id, amount: quantity }
        );
        if (error) throw error;

        // Optional: if an item was out and is now > 0, mark available
        if (updatedItem?.quantity_available > 0 && updatedItem?.id) {
          try {
            await inventoryService.setItemAvailability(updatedItem.id, true);
          } catch {
            // ignore availability flip failures
          }
        }

        return updatedItem as Item;
      })
    );
  },

  // --- Categories ------------------------------------------------------------

  getCategories: async () => {
    const { data, error } = await supabase
      .from('item_category')
      .select('*')
      .order('item_category_name', { ascending: true });

    if (error) throw error;
    return data || [];
  },
};
