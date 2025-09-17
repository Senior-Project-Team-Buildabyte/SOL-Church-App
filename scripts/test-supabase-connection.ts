import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test connection by fetching a single item
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error connecting to Supabase:', error);
      return;
    }
    
    console.log('Successfully connected to Supabase!');
    console.log(`Found ${data?.length || 0} items in the database`);
    
    if (data && data.length > 0) {
      console.log('First item:', JSON.stringify(data[0], null, 2));
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testConnection();
