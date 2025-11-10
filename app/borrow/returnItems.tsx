import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, ActivityIndicator, Platform } from 'react-native';
import { Link } from 'expo-router';
import { inventoryService } from '../../services/inventory.service';
import { Database } from '@/src/types/database.types';

type ItemBase = Database['public']['Tables']['inventory_items']['Row'];
type BorrowItem = ItemBase & {
  loan_id: number;
  my_borrowed_quantity: number; // how many THIS user has out for this item (for this loan)
};

export default function ReturnItems() {
  const [items, setItems] = useState<BorrowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<{[key: number]: number}>({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      // now pulls *my* active loans joined with inventory_items
      const mine = await inventoryService.getMyBorrowedItems();
      setItems(mine);
    } catch (error) {
      Alert.alert('Error', 'Failed to load your borrowed items. Please try again.');
      console.error('Error loading borrowed items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (itemId: number, value: string) => {
    const quantity = parseInt(value) || 0;
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: quantity
    }));
  };

  const handleReturn = async () => {
    // We’ll support full returns per-loan (no partials in this version)
    const entries = Object.entries(selectedItems).filter(([_, q]) => q > 0);

    if (entries.length === 0) {
      Alert.alert('No Items Selected', 'Please select at least one item to return.');
      return;
    }

    // Build loan IDs for items where user chose >= their borrowed qty
    const loanIds: number[] = [];
    for (const [itemIdStr, qty] of entries) {
      const itemId = Number(itemIdStr);
      const item = items.find(i => i.inventory_item_id === itemId);
      if (!item) continue;

      if (qty >= item.my_borrowed_quantity) {
        loanIds.push(item.loan_id);
      } else {
        Alert.alert(
          'Partial return not supported',
          'Right now you must return the full borrowed amount for a selected item.'
        );
        return;
      }
    }

    if (loanIds.length === 0) {
      Alert.alert('Nothing to return', 'Select the full quantity for at least one item.');
      return;
    }

    try {
      await inventoryService.returnLoans(loanIds); // sets returned_at = now() on those loans
      Alert.alert('Success', 'Items returned successfully!');
      setSelectedItems({});
      await loadItems(); // Refresh
    } catch (error) {
      Alert.alert('Error', 'Failed to return items. Please try again.');
      console.error('Error returning items:', error);
    }
  };

  const filteredItems = items.filter(item =>
    (item.item_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.item_description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );


  // Max is simply what this user borrowed for that loan
  const getMaxReturnable = (item: BorrowItem) => item.my_borrowed_quantity || 0;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Return Items</Text>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search items..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.inventory_item_id.toString()}
        renderItem={({ item }) => {
          const maxReturnable = getMaxReturnable(item);
          return (
            <View style={styles.itemCard}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.item_name}</Text>
                {!!item.item_description && <Text style={styles.itemDescription}>{item.item_description}</Text>}

                <Text style={styles.itemAvailable}>
                  Borrowed by you: {item.my_borrowed_quantity}
                </Text>

                {/* Optional: keep global stock context */}
                <Text style={styles.itemBorrowed}>
                  Available (global): {item.quanityAvailable} of {item.quanityTotal}
                </Text>

                {!!item.item_location && <Text style={styles.itemLocation}>Location: {item.item_location}</Text>}
              </View>

              <View style={styles.quantityContainer}>
                <Text>Qty:</Text>
                <TextInput
                  style={styles.quantityInput}
                  keyboardType="numeric"
                  value={selectedItems[item.inventory_item_id]?.toString() || ''}
                  onChangeText={(text) => handleQuantityChange(item.inventory_item_id, text)}
                  placeholder="0"
                  maxLength={3}
                />
                <Text
                  style={styles.maxText}
                  onPress={() => handleQuantityChange(item.inventory_item_id, maxReturnable.toString())}
                >
                  MAX
                </Text>
              </View>
            </View>
          );
        }}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No borrowed items</Text>
            <Text style={styles.emptySubtext}>You don’t have anything checked out.</Text>
          </View>
        }
      />

      {items.length > 0 && (
        <TouchableOpacity
          style={styles.returnButton}
          onPress={handleReturn}
        >
          <Text style={styles.returnButtonText}>Return Selected Items</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2196F3',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 80,
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' },
      default: { elevation: 2 },
    }),
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  itemDescription: { color: '#666', marginBottom: 4 },
  itemAvailable: { color: '#4CAF50', fontWeight: '500', marginBottom: 2 },
  itemBorrowed: { color: '#FF9800', fontWeight: '500', marginBottom: 4 },
  itemLocation: { color: '#666', fontSize: 12 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 4,
    marginHorizontal: 8,
    width: 50,
    textAlign: 'center',
  },
  maxText: { color: '#2196F3', fontSize: 12 },
  returnButton: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', zIndex: 10 },
      default: { elevation: 3 },
    }),
  },
  returnButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#666', marginBottom: 8 },
  emptySubtext: { color: '#999', textAlign: 'center' },
});
