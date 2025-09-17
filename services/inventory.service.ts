import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

// Create a typed Supabase client
const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ''
);

type Item = Database['public']['Tables']['items']['Row'];
type ItemInsert = Database['public']['Tables']['items']['Insert'];
type ItemUpdate = Database['public']['Tables']['items']['Update'];

// Helper type for item quantity updates
type ItemQuantityUpdate = {
  id: number;
  quantity: number;
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
    let query = supabase.from('items').select('*');

    if (filters.availableOnly) {
      query = query.gt('quantity_available', 0);
    }

    if (filters.searchTerm) {
      query = query.ilike('name', `%${filters.searchTerm}%`);
    }

    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }

    const { data, error } = await query.order('name', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  // Get item by ID
  getItem: async (id: number): Promise<Item> => {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new item
  createItem: async (item: ItemInsert): Promise<Item> => {
    const { data, error } = await supabase
      .from('items')
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
      .from('items')
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
      .from('items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Checkout items (decrease quantity)
  checkoutItems: async (items: ItemQuantityUpdate[]): Promise<Item[]> => {
    return await Promise.all(
      items.map(async ({ id, quantity }) => {
        // Use a stored procedure for atomic updates
        const { data: updatedItem, error } = await (supabase.rpc as any)('decrease_item_quantity', {
          item_id: id,
          amount: quantity
        });
        
        if (error) throw error;
        return updatedItem as Item;
      })
    );
  },

  // Return items (increase quantity)
  returnItems: async (items: ItemQuantityUpdate[]): Promise<Item[]> => {
    return await Promise.all(
      items.map(async ({ id, quantity }) => {
        // Use a stored procedure for atomic updates
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
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }
};
