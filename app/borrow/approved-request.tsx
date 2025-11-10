import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  View, Text, ActivityIndicator, StyleSheet, FlatList, Image, TouchableOpacity, Alert 
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function ApprovedRequestPage() {
  const params = useLocalSearchParams();
  const requestIdParam = (params as any)?.requestId;
  const requestId = requestIdParam ? Number(requestIdParam) : null;

  const [loading, setLoading] = React.useState(true);
  const [approving, setApproving] = React.useState(false);
  const [request, setRequest] = React.useState<any>(null);
  const [items, setItems] = React.useState<any[]>([]);

  // Fetch the request and items
  React.useEffect(() => {
    const fetch = async () => {
      if (!requestId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);

        const { data: reqData, error: reqErr } = await supabase
          .from('inventory_request')
          .select('*')
          .eq('inventory_request_id', requestId)
          .single();
        if (reqErr) throw reqErr;
        setRequest(reqData);

        // Pull both requested_qty and quantity; use whichever exists (fallback 1)
        const { data: itData, error: itErr } = await supabase
          .from('inventory_request_items')
          .select(`
            inventory_item_id,
            requested_qty,
            quantity,
            inventory_items(item_name, item_image_id, quanityAvailable)
          `)
          .eq('inventory_request_id', requestId);
        if (itErr) throw itErr;

        const mapped = (itData || []).map((r: any) => ({
          id: r.inventory_item_id,
          name: r.inventory_items?.item_name ?? 'Unknown',
          imageId: r.inventory_items?.item_image_id ?? null,
          available: r.inventory_items?.quanityAvailable ?? null,
          // prefer requested_qty if present, else quantity, else 1
          quantity: (typeof r.requested_qty === 'number' ? r.requested_qty
                   : typeof r.quantity === 'number' ? r.quantity
                   : 1),
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

  const handleApprove = async () => {
    if (!request || requestId === null) return;
    try {
      setApproving(true);

      // get admin (approver) user id (optional, just to ensure auth)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'You must be signed in to approve.');
        return;
      }

      const borrowerId = request.user_requesting_id;

      console.log('approving request', requestId, items);

      // 1) Create loans BEFORE flipping is_approved.
      //    Use upsert to avoid duplicates if someone clicks twice.
      for (const item of items) {
        const payload = {
          request_id: request.inventory_request_id,
          item_id: item.id,
          user_id: borrowerId,
          quantity: item.quantity ?? 1,
          checked_out_at: new Date().toISOString(),
          returned_at: null
        };

        // If your unique index is (request_id, item_id) [even with partial WHERE returned_at IS NULL],
        // upsert with onConflict will safely no-op on duplicates.
        const { error } = await (supabase.from as any)('loans')
          .upsert([payload], { onConflict: 'request_id,item_id', ignoreDuplicates: true });

        // If your client lib doesn't support ignoreDuplicates, you can catch 23505 and continue:
        if (error) {
          // @ts-ignore (error may have a code)
          if (error.code === '23505') {
            console.warn('duplicate loan row ignored for', payload);
          } else {
            console.error('insert loans error', error);
            throw error;
          }
        }
      }

      // 2) Flip the approved flag LAST (idempotent)
      const { error: updateError } = await supabase
        .from('inventory_request')
        .update({ is_approved: true })
        .eq('inventory_request_id', requestId);

      if (updateError) throw updateError;

      Alert.alert('Success', 'Loans created and request marked approved!');
      // Optionally refresh the page state:
      setRequest((prev: any) => ({ ...prev, is_approved: true }));
    } catch (err: any) {
      console.error('Approve failed', err);
      Alert.alert('Error', err.message || 'Failed to approve request');
    } finally {
      setApproving(false);
    }
  };

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

        {!request.is_approved && (
          <TouchableOpacity style={styles.approveBtn} onPress={handleApprove} disabled={approving}>
            <Text style={styles.approveBtnText}>
              {approving ? 'Approving...' : 'Approve & Create Loans'}
            </Text>
          </TouchableOpacity>
        )}

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
                <Text style={styles.itemMeta}>
                  Available: {item.available ?? '—'} | Borrow Qty: {item.quantity}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

// Styles unchanged...
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
  approveBtn: {
    backgroundColor: '#10b981',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  approveBtnText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});