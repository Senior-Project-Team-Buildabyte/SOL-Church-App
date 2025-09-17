import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, ActivityIndicator, Platform, ViewStyle, TextStyle } from 'react-native';
import { Link } from 'expo-router';
import { inventoryService } from '../../services/inventory.service';

type Item = {
  id: number;
  name: string;
  description: string | null;
  quantity_available: number;
  quantity_total: number;
  location: string | null;
  barcode: string | null;
};

export default function ReturnItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<{[key: number]: number}>({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const allItems = await inventoryService.getItems();
      // Filter items that have been borrowed (quantity_available < quantity_total)
      const borrowedItems = allItems.filter(item => item.quantity_available < item.quantity_total);
      setItems(borrowedItems);
    } catch (error) {
      Alert.alert('Error', 'Failed to load items. Please try again.');
      console.error('Error loading items:', error);
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
    const itemsToReturn = Object.entries(selectedItems)
      .filter(([_, quantity]) => quantity > 0)
      .map(([id, quantity]) => ({
        id: parseInt(id),
        quantity,
      }));

    if (itemsToReturn.length === 0) {
      Alert.alert('No Items Selected', 'Please select at least one item to return.');
      return;
    }

    try {
      await inventoryService.returnItems(itemsToReturn);
      Alert.alert('Success', 'Items returned successfully!');
      setSelectedItems({});
      loadItems(); // Refresh the list
    } catch (error) {
      Alert.alert('Error', 'Failed to return items. Please try again.');
      console.error('Error returning items:', error);
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getMaxReturnable = (item: Item) => {
    return item.quantity_total - item.quantity_available;
  };

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
        <Link href="/(tabs)/borrow" style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Link>
        <Text style={styles.title}>Return Items</Text>
        <View style={{ width: 60 }} />
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search items..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const maxReturnable = getMaxReturnable(item);
          return (
            <View style={styles.itemCard}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.description && <Text style={styles.itemDescription}>{item.description}</Text>}
                <Text style={styles.itemAvailable}>
                  Available: {item.quantity_available} of {item.quantity_total}
                </Text>
                <Text style={styles.itemBorrowed}>
                  Borrowed: {maxReturnable}
                </Text>
                {item.location && <Text style={styles.itemLocation}>Location: {item.location}</Text>}
              </View>
              <View style={styles.quantityContainer}>
                <Text>Qty:</Text>
                <TextInput
                  style={styles.quantityInput}
                  keyboardType="numeric"
                  value={selectedItems[item.id]?.toString() || ''}
                  onChangeText={(text) => handleQuantityChange(item.id, text)}
                  placeholder="0"
                  maxLength={3}
                />
                <Text 
                  style={styles.maxText} 
                  onPress={() => handleQuantityChange(item.id, maxReturnable.toString())}
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
            <Text style={styles.emptyText}>No items to return</Text>
            <Text style={styles.emptySubtext}>All items are currently in stock</Text>
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
    paddingBottom: 80, // Space for the bottom button
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
      web: {
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemDescription: {
    color: '#666',
    marginBottom: 4,
  },
  itemAvailable: {
    color: '#4CAF50',
    fontWeight: '500',
    marginBottom: 2,
  },
  itemBorrowed: {
    color: '#FF9800',
    fontWeight: '500',
    marginBottom: 4,
  },
  itemLocation: {
    color: '#666',
    fontSize: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 4,
    marginHorizontal: 8,
    width: 50,
    textAlign: 'center',
  },
  maxText: {
    color: '#2196F3',
    fontSize: 12,
  },
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
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        zIndex: 10,
      },
      default: {
        elevation: 3,
      },
    }),
  },
  returnButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#999',
    textAlign: 'center',
  },
});