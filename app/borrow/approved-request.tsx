import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function ApprovedRequestPage() {
  const params = useLocalSearchParams();
  const requestIdParam = (params as any)?.requestId;
  const requestId = requestIdParam ? Number(requestIdParam) : null;

  const [loading, setLoading] = React.useState(true);
  const [request, setRequest] = React.useState<any>(null);
  const [items, setItems] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetch = async () => {
      if (!requestId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // fetch request row
        const { data: reqData, error: reqErr } = await supabase
          .from('inventory_request')
          .select('*')
          .eq('inventory_request_id', requestId)
          .single();
        if (reqErr) throw reqErr;
        setRequest(reqData);

        const { data: itData, error: itErr } = await supabase
          .from('inventory_request_items')
          .select('inventory_item_id, inventory_items(item_name, item_image_id, quanityAvailable)')
          .eq('inventory_request_id', requestId);
        if (itErr) throw itErr;

        const mapped = (itData || []).map((r: any) => ({
          id: r.inventory_item_id,
          name: r.inventory_items?.item_name ?? 'Unknown',
          imageId: r.inventory_items?.item_image_id ?? null,
          available: r.inventory_items?.quanityAvailable ?? null,
        }));

        setItems(mapped);
      } catch (err) {
        console.error('Failed to load approved request', err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [requestId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!request) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <Text style={styles.title}>No request found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Request #{request.inventory_request_id}</Text>
        <Text style={styles.meta}>Requested by: {request.user_requesting_id}</Text>
        <Text style={styles.meta}>Status: {request.is_approved ? 'Approved' : 'Pending'}</Text>

        <Text style={styles.sectionTitle}>Items</Text>
        <FlatList
          data={items}
          keyExtractor={(i) => String(i.id)}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              {item.imageId ? (
                <Image source={{ uri: `https://example.com/images/${item.imageId}` }} style={styles.thumb} />
              ) : (
                <View style={styles.thumbPlaceholder} />
              )}
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemMeta}>Available: {item.available ?? '—'}</Text>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 16, flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  meta: { fontSize: 14, color: '#666', marginBottom: 6 },
  sectionTitle: { marginTop: 12, marginBottom: 8, fontSize: 16, fontWeight: '600' },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee' },
  thumb: { width: 52, height: 52, borderRadius: 8, marginRight: 12, backgroundColor: '#f1f5f9' },
  thumbPlaceholder: { width: 52, height: 52, borderRadius: 8, marginRight: 12, backgroundColor: '#f1f5f9' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '500' },
  itemMeta: { fontSize: 12, color: '#666' },
});
