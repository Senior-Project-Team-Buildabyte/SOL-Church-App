// inventory.service.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/types/database.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Env + client ------------------------------------------------------------
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anon) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_URL. Set it in .env.development (or .env) before running the app.'
  );
}

const supabase = createClient<Database>(url, anon, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

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

    // --- Loan & Borrowed Items -------------------------------------------------

    getMyBorrowedItems: async (): Promise<any[]> => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    if (!userId) throw new Error('User not signed in');

    const { data, error } = await (supabase as any)
      .from('loans')
      .select(`
        id,
        item_id,
        quantity,
        checked_out_at,
        returned_at,
        item:inventory_items (
          inventory_item_id,
          item_name,
          item_description,
          item_location,
          quantity_available,
          quantity_total
        )
      `)
      .eq('user_id', userId)
      .is('returned_at', null);

    if (error) throw error;

    return (data ?? []).map((row: any) => ({
      loan_id: row.id,
      my_borrowed_quantity: row.quantity,
      checked_out_at: row.checked_out_at,
      returned_at: row.returned_at,
      ...row.item,
    }));
  },

  /** Mark one or more loans as returned */
  returnLoans: async (loanIds: number[]): Promise<void> => {
    const { error } = await (supabase as any)
      .from('loans')
      .update({ returned_at: new Date().toISOString() })
      .in('id', loanIds);

    if (error) throw error;
  },

    /** Approve a user’s request and create a loan for them */
    approveAndCreateLoan: async (requestId: number, itemId: number): Promise<void> => {
      // Step 1: Get the user who made the request
      const { data: request, error: reqError } = await supabase
        .from('inventory_request')
        .select('user_requesting_id')
        .eq('inventory_request_id', requestId)
        .single();

      if (reqError || !request) {
        console.error('Error fetching request:', reqError);
        throw new Error('Could not find requesting user.');
      }

      const userId = request.user_requesting_id;
      if (!userId) throw new Error('Request has no requesting user.');

      // Step 2: Create a loan for that user
      const { error: loanError } = await (supabase as any).from('loans').insert({
        user_id: userId,               // Borrower’s ID (not admin)
        item_id: itemId,
        quantity: 1,
        request_id: requestId,
        checked_out_at: new Date().toISOString(),
      });

      if (loanError) {
        console.error('Error creating loan:', loanError);
        throw new Error('Failed to create loan.');
      }

      // Step 3: Mark the request as approved and record which admin did it
      const { data: currentUser } = await supabase.auth.getUser();

      const { error: updateError } = await supabase
        .from('inventory_request')
        .update({
          is_approved: true,
          user_reviewing_id: currentUser?.user?.id ?? null, // admin who approved
        })
        .eq('inventory_request_id', requestId);

      if (updateError) {
        console.error('Error updating request:', updateError);
        throw new Error('Failed to update approval status.');
      }

      console.log('Loan created successfully for requesting user.');
    },
};
