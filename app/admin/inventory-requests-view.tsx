import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

interface InventoryRequest {
  inventory_request_id: number;
  user_requesting_id: string | null;
  is_approved: boolean | null;
  start_date: string | null;
}

interface InventoryRequestItem {
  inventory_item_id: number;
  inventory_request: InventoryRequest | null;
  inventory_items: {
    item_name: string;
    quanityAvailable: number;
  } | null;
}

interface JoinedRequest {
  item_name: string;
  inventory_request_items: InventoryRequestItem[];
}

export default function InventoryRequestsViewPage() {
  const [requests, setRequests] = useState<JoinedRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function fetchPendingInventoryRequests() {
    const { data, error } = await supabase
      .from('inventory_items')
      .select(`
        item_name,
        inventory_request_items (
          inventory_item_id,
          inventory_request (
            inventory_request_id,
            user_requesting_id,
            is_approved,
            start_date
          )
        )
      `)
      .is('inventory_request_items.inventory_request.is_approved', null);

    if (error) {
      console.error('Error fetching inventory requests:', error);
      return [];
    }

    return data as JoinedRequest[];
  }

  useEffect(() => {
    async function loadData() {
      const result = await fetchPendingInventoryRequests();
      setRequests(result);
      setLoading(false);
    }
    loadData();
  }, []);

  const handlePress = (inventoryRequest: InventoryRequest, itemId: number) => {
    router.push(`./inventory_requests?requestId=${inventoryRequest.inventory_request_id}&itemId=${itemId}`);
  };

  if (loading) {
    return <Text style={styles.loadingText}>Loading inventory requests...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Pending Inventory Requests</Text>

      {requests.length === 0 ? (
        <Text style={styles.empty}>No pending requests</Text>
      ) : (
        requests.map((req, index) =>
          req.inventory_request_items
            .filter(entry => entry.inventory_request !== null && entry.inventory_item_id != null)
            .map((entry, idx) => {
              const ir = entry.inventory_request!;
              return (
                <Pressable
                  key={`${index}-${idx}`}
                  style={styles.item}
                  onPress={() => handlePress(ir, entry.inventory_item_id)}
                >
                  <Text>
                    <Text style={styles.label}>Item: </Text>
                    {entry.inventory_items?.item_name ?? req.item_name ?? 'Unknown'}
                  </Text>
                  <Text>
                    <Text style={styles.label}>User: </Text>
                    {ir.user_requesting_id ?? 'Unknown User'}
                  </Text>
                  <Text>
                    <Text style={styles.label}>Date: </Text>
                    {ir.start_date ?? 'No Date'}
                  </Text>
                </Pressable>
              );
            })
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#777',
  },
  item: {
    padding: 15,
    backgroundColor: '#eef3ff',
    borderRadius: 12,
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
  },
});



