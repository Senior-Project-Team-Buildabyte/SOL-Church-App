import React from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ImageBackground, StyleSheet, Text, TextInput, View, ScrollView, ActivityIndicator, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../lib/supabase';
import requestService from '@/services/request.service';

export default function InventoryRequests() {
  const params = useLocalSearchParams();
  const requestIdParam = (params as any)?.requestId;
  const requestId = requestIdParam ? Number(requestIdParam) : null;
  const [loading, setLoading] = React.useState(true);
  const [processing, setProcessing] = React.useState(false);
  const [items, setItems] = React.useState<Array<{ inventory_item_id: number; item_name: string; quanityAvailable: number }>>([]);
  const [debug, setDebug] = React.useState<string>('');
  const router = useRouter();

  // Check if the RPC exists
  React.useEffect(() => {
    const checkRPC = async () => {
      try {
        console.log('Checking RPC existence...');
        const { data, error } = await (supabase.rpc as any)('approve_inventory_request', {
          p_request_id: -1,  // Invalid ID to just test function exists
          p_approver: '00000000-0000-0000-0000-000000000000',
          p_comment: null
        });
        console.log('RPC check result:', { data, error });
        if (error) {
          setDebug(prev => prev + '\nRPC check error: ' + JSON.stringify(error));
        }
      } catch (err) {
        console.error('RPC check failed:', err);
        setDebug(prev => prev + '\nRPC check exception: ' + String(err));
      }
    };
    checkRPC();
  }, []);

  const fetchRequestDetails = async () => {
    if (!requestId) {
      console.log('No requestId provided');
      setDebug(prev => prev + '\nNo requestId in params');
      setLoading(false);
      return;
    }
    console.log('Fetching details for request:', requestId);
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('inventory_request_items')
        .select('inventory_item_id, inventory_items(item_name, quanityAvailable)')
        .eq('inventory_request_id', requestId);

      if (error) throw error;
      console.log('Fetched request items:', data);
      setDebug(prev => prev + '\nFetched items: ' + JSON.stringify(data));

      const mapped = (data || []).map((row: any) => ({
        inventory_item_id: row.inventory_item_id,
        item_name: row.inventory_items?.item_name ?? 'Unknown',
        quanityAvailable: row.inventory_items?.quanityAvailable ?? 0,
      }));

      setItems(mapped);
    } catch (err) {
      console.error('Failed to fetch request details', err);
      Alert.alert('Error', 'Failed to load request details');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRequestDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <Stack.Screen
        options={{
          title: 'Inventory Requests',
          headerShown: true,
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ImageBackground
          source={require('@/assets/images/bg-mission.jpg')}
          style={styles.frontimage}
          resizeMode="cover"
        >
          <View style={styles.headingWrapper}>
            <LinearGradient
              style={styles.pageHeading}
              colors={['rgba(149, 185, 247, 1)', 'rgba(60,129,246,1)']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            >
              <ImageBackground
                source={require('@/assets/images/favicon-drop.png')}
                style={{ height: '100%', aspectRatio: 1 }}
                resizeMode="cover"
              />
              <Text style={styles.headingText}>Inventory Requests</Text>
            </LinearGradient>
          </View>
        </ImageBackground>

        <View style={styles.content}>
          <Text style={styles.instructionText}>
            Please confirm the following items being borrowed/returned
          </Text>
          
          <Text style={styles.requestInfo}>
            Request ID: {requestId || 'None'}
          </Text>
          
          {items.length > 0 ? (
            <View style={styles.itemsList}>
              {items.map(item => (
                <Text key={item.inventory_item_id} style={styles.itemText}>
                  • {item.item_name} (Available: {item.quanityAvailable})
                </Text>
              ))}
            </View>
          ) : (
            <Text style={styles.noItems}>No items in request</Text>
          )}

          {__DEV__ && debug && (
            <ScrollView style={styles.debugBox}>
              <Text style={styles.debugText}>{debug}</Text>
            </ScrollView>
          )}

          <View style={styles.commentContainer}>
            <Text style={styles.commentLabel}>Add a comment (optional):</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Enter any feedback or additional information for the user..."
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.buttonsContainer}>
            {loading ? (
              <ActivityIndicator size="small" />
            ) : (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Pressable
                  onPress={async () => {
                    if (!requestId) return Alert.alert('Missing request id');
                    try {
                      setProcessing(true);
                      const session = await supabase.auth.getSession();
                      const approverId = session.data.session?.user?.id;
                      if (!approverId) return Alert.alert('You must be signed in to approve requests');

                      // Call raw RPC first to get full response for diagnostics
                      const raw = await requestService.approveInventoryRequestRaw(requestId, approverId as string);
                      if (raw.error) {
                        console.error('RPC error:', raw.error);
                        Alert.alert('RPC Error', JSON.stringify(raw.error, Object.getOwnPropertyNames(raw.error)));
                        return;
                      }
                      console.log('Raw RPC response:', raw);
                      setDebug(prev => prev + '\nRPC response: ' + JSON.stringify(raw));

                      // Raw succeeded; call the normal wrapper which will throw on error
                      await requestService.approveInventoryRequest(requestId, approverId as string);

                      // Remove any admin notification that referenced this request so it no longer appears in the inbox
                      try {
                        // Delete only the original admin notification for this request (title 'New Inventory Request') and return deleted rows
                        const { data: deleted, error: delErr } = await supabase
                          .from('notification')
                          .delete()
                          .eq('notificationtitle', 'New Inventory Request')
                          .contains('notificationlink', { inventory_request_id: requestId })
                          .select();
                        if (delErr) {
                          console.warn('Failed to delete notification for request', requestId, delErr);
                        } else if (!deleted || deleted.length === 0) {
                          console.warn('No matching admin notification found to delete for request', requestId);
                        } else {
                          console.log('Deleted admin notification(s) for request', requestId, deleted.length);
                        }
                      } catch (delEx) {
                        console.warn('Exception deleting notification for request', requestId, delEx);
                      }

                      Alert.alert('Success', 'Request approved');

                      // After approving, navigate back to the notifications inbox so admin sees it removed
                      try {
                        router.replace('/settings/notification-inbox');
                        return;
                      } catch (navErr) {
                        console.warn('Failed to navigate to inbox after approve', navErr);
                      }

                      await fetchRequestDetails();
                    } catch (err: any) {
                      console.error('Approve failed:', err);
                      // Show detailed error when possible
                      const msg = err?.message || (err?.toString && err.toString()) || 'Failed to approve request';
                      Alert.alert('Error', msg);
                    } finally {
                      setProcessing(false);
                    }
                  }}
                  disabled={processing}
                  style={{ flex: 1, marginRight: 8 }}
                >
                  <LinearGradient
                    colors={[ '#4CAF50', '#43A047' ]}
                    style={{ padding: 12, borderRadius: 8, alignItems: 'center' }}
                  >
                    {processing ? <ActivityIndicator color="#fff" /> : <Text style={{ color: 'white', fontWeight: '600' }}>Approve</Text>}
                  </LinearGradient>
                </Pressable>

                <Pressable
                  onPress={async () => {
                    if (!requestId) return Alert.alert('Missing request id');
                    try {
                      setProcessing(true);
                      const session = await supabase.auth.getSession();
                      const approverId = session.data.session?.user?.id;
                      if (!approverId) return Alert.alert('You must be signed in to deny requests');
                      // Deny: simple update without decrementing quantities
                      const { error } = await supabase
                        .from('inventory_request')
                        .update({ is_approved: false, user_reviewing_id: approverId })
                        .eq('inventory_request_id', requestId);
                      if (error) throw error;

                      // Remove admin notification for this request so it no longer shows up
                      try {
                        const { data: deleted, error: delErr } = await supabase
                          .from('notification')
                          .delete()
                          .eq('notificationtitle', 'New Inventory Request')
                          .contains('notificationlink', { inventory_request_id: requestId })
                          .select();
                        if (delErr) {
                          console.warn('Failed to delete notification for denied request', requestId, delErr);
                        } else if (!deleted || deleted.length === 0) {
                          console.warn('No matching admin notification found to delete for denied request', requestId);
                        } else {
                          console.log('Deleted admin notification(s) for denied request', requestId, deleted.length);
                        }
                      } catch (delEx) {
                        console.warn('Exception deleting notification for denied request', requestId, delEx);
                      }

                      Alert.alert('Denied', 'Request has been denied');
                      try {
                        router.replace('/settings/notification-inbox');
                        return;
                      } catch (navErr) {
                        console.warn('Failed to navigate to inbox after deny', navErr);
                      }

                      await fetchRequestDetails();
                    } catch (err: any) {
                      console.error(err);
                      Alert.alert('Error', err?.message || 'Failed to deny request');
                    } finally {
                      setProcessing(false);
                    }
                  }}
                  disabled={processing}
                  style={{ flex: 1, marginLeft: 8 }}
                >
                  <LinearGradient
                    colors={[ '#F44336', '#E53935' ]}
                    style={{ padding: 12, borderRadius: 8, alignItems: 'center' }}
                  >
                    <Text style={{ color: 'white', fontWeight: '600' }}>Deny</Text>
                  </LinearGradient>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  frontimage: {
    width: '100%',
    height: 250,
  },
  headingWrapper: {
    maxWidth: 650,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageHeading: {
    height: 60,
    backgroundColor: 'rgba(58, 120, 227, 1)',
    width: '70%',
    maxWidth: 350,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headingText: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    flexGrow: 1,
    fontWeight: 'bold',
    textShadowColor: '#333',
    textShadowRadius: 10,
    textShadowOffset: { width: 1, height: 2 },
  },
  requestInfo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  itemsList: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  itemText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  noItems: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 16,
  },
  debugBox: {
    marginVertical: 16,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    maxHeight: 200,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  content: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
    padding: 20,
  },
  instructionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  commentContainer: {
    marginBottom: 20,
  },
  commentLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  commentInput: {
    width: '100%',
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  buttonsContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});

