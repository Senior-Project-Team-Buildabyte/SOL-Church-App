import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import { 
  StyleSheet, 
  SafeAreaView, 
  View, 
  Text, 
  Pressable, 
  FlatList, 
  TextInput, 
  Image, 
  ScrollView, 
  NativeSyntheticEvent, 
  NativeScrollEvent, 
  LayoutChangeEvent,
  ActivityIndicator,
  Button,
  ImageSourcePropType
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Link, useRouter } from "expo-router";

// Database types
type DBCategory = {
  item_category_id: number;
  item_category_name: string;
};

type DBInventoryItem = {
  inventory_item_id: number;
  item_name: string;
  item_image_id: number | null;
  item_category_id: number | null;
  item_category: DBCategory | null;
  quanityAvailable: number;
};

// UI types
type Category = {
  id: string;
  name: string;
};

type Item = { 
  id: string;
  name: string; 
  imageUrl: string | null;
  category: string;
  categoryId: string;
  isAvailable: boolean;
  addedDate: string;
};

const CATEGORIES: Category[] = [
  { id: 'all', name: 'All Items' }
];

const DEFAULT_IMAGE = require("../../assets/images/no-image-available.jpg");
const SCROLL_ARROW_DIAMETER = 40;

const BorrowTakeItems = () => {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [listHeight, setListHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [showScrollArrow, setShowScrollArrow] = useState(false);
  const SCROLL_END_OFFSET = 8;
  const scrollViewRef = useRef<ScrollView>(null);

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('item_category')
          .select('item_category_id, item_category_name')
          .order('item_category_name', { ascending: true })
          .returns<DBCategory[]>();

        if (error) throw error;
        
        if (data?.length) {
          setCategories([
            { id: 'all', name: 'All Items' },
            ...data.map((cat) => ({
              id: cat.item_category_id.toString(),
              name: cat.item_category_name
            }))
          ]);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch items from database
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        
        const { data: itemsData, error: itemsError } = await supabase
          .from('inventory_items')
          .select(`
            inventory_item_id,
            item_name,
            item_image_id,
            item_category_id,
            item_category:item_category_id(item_category_id, item_category_name),
            quanityAvailable
          `)
          .not('item_name', 'is', 'null')
          .gt('quanityAvailable', 0)
          .returns<DBInventoryItem[]>();

        if (itemsError) throw itemsError;
        
        if (!itemsData?.length) {
          setItems([]);
          return;
        }

        // Format items with image URLs and category names
        const formattedItems: Item[] = itemsData
          .filter((item): item is DBInventoryItem => {
            return (
              item.inventory_item_id !== undefined && 
              item.item_name !== undefined &&
              item.quanityAvailable !== undefined
            );
          })
          .map((item) => ({
            id: item.inventory_item_id.toString(),
            name: item.item_name,
            imageUrl: item.item_image_id ? `https://example.com/images/${item.item_image_id}` : null,
            category: item.item_category?.item_category_name || 'Other',
            categoryId: item.item_category_id?.toString() || 'other',
            isAvailable: item.quanityAvailable > 0,
            addedDate: new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
          }));

        setItems(formattedItems);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to load items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Derived filtered list
  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    
    return items.filter(item => {
      // Filter by category
      const matchesCategory = selectedCategory === 'all' || 
                            item.categoryId === selectedCategory;
      
      // Filter by search query
      const matchesSearch = !normalizedQuery || 
                          item.name.toLowerCase().includes(normalizedQuery);
      
      return matchesCategory && matchesSearch;
    });
  }, [items, searchQuery, selectedCategory]);

  // Handle scroll arrow visibility
  const recomputeScrollArrow = (currListHeight = listHeight, currContentHeight = contentHeight) => {
    const canScroll = currContentHeight > currListHeight + 1;
    setShowScrollArrow(canScroll);
  };

  const onListLayout = (layoutEvent: LayoutChangeEvent) => {
    const { height } = layoutEvent.nativeEvent.layout;
    setListHeight(height);
    recomputeScrollArrow(height, contentHeight);
  };

  const onContentSizeChange = (_unusedWidth: number, nextContentHeight: number) => {
    setContentHeight(nextContentHeight);
    recomputeScrollArrow(listHeight, nextContentHeight);
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - SCROLL_END_OFFSET;
    setShowScrollArrow(!isAtBottom);
  };

  const toggleSelection = (id: string) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id);
    } else {
      newSelectedIds.add(id);
    }
    setSelectedIds(newSelectedIds);
  };

  const handleBorrowPress = () => {
    if (selectedIds.size > 0) {
      // Navigate to borrow confirmation screen with selected items
      router.push({
        pathname: "/borrow/confirm" as const,
        params: { selectedIds: Array.from(selectedIds).join(",") },
      } as any);
    }
  };

  const selectedCount = selectedIds.size;

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator testID="loading" size="large" color="#3b82f6" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
        <Button title="Retry" onPress={() => window.location.reload()} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Image
            source={require("../../assets/images/availableItems.jpg")}
            style={styles.headerImg}
            resizeMode="cover"
          />
          <Text style={styles.headerTitle}>Available Items</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
        </View>

        {/* Categories */}
        <View style={styles.categoryOuterContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContainer}
          >
            {categories.map((category) => (
              <Pressable
                key={category.id}
                style={[
                  styles.categoryPill,
                  selectedCategory === category.id && styles.categoryPillActive
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive
                ]}>
                  {category.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Items List */}
        <View style={styles.listCard} onLayout={onListLayout}>
          {filteredItems.length > 0 ? (
            <ScrollView
              ref={scrollViewRef}
              onContentSizeChange={onContentSizeChange}
              onScroll={onScroll}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
            >
              {filteredItems.map((item) => (
                <View key={item.id} style={styles.itemWrapper}>
                  <Pressable
                    style={styles.itemRow}
                    onPress={() => toggleSelection(item.id)}
                  >
                    <View style={styles.thumb}>
                      <Image
                        source={item.imageUrl ? { uri: item.imageUrl } : DEFAULT_IMAGE}
                        style={styles.thumbImg}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={styles.itemTextContainer}>
                      <View style={styles.itemHeader}>
                        <Text style={styles.itemTitle} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text style={styles.itemDate}>
                          {item.addedDate}
                        </Text>
                      </View>
                      <View style={styles.itemInfoRow}>
                        <Text style={styles.itemCategory} numberOfLines={1}>
                          {item.category}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.checkboxOuter}>
                      {selectedIds.has(item.id) && (
                        <View style={styles.checkboxInner} />
                      )}
                    </View>
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={[styles.container, styles.centerContent]}>
              <Text>No items found</Text>
            </View>
          )}
        </View>

        {/* Scroll to top button */}
        {showScrollArrow && (
          <Pressable
            style={styles.scrollArrow}
            onPress={() => {
              scrollViewRef.current?.scrollTo({ y: 0, animated: true });
            }}
          >
            <MaterialIcons name="keyboard-arrow-up" size={24} color="#3b82f6" />
          </Pressable>
        )}

        {/* Borrow Button */}
        <Pressable 
          onPress={handleBorrowPress} 
          disabled={selectedCount === 0}
          style={({ pressed }) => ({
            opacity: selectedCount === 0 ? 0.6 : pressed ? 0.8 : 1,
          })}
        >
          <LinearGradient
            colors={["#5AA4FF", "#2B55C3"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.borrowButton}
          >
            <Text style={styles.borrowButtonText}>
              {selectedCount > 0 ? `Borrow Items (${selectedCount})` : "Borrow Items"}
            </Text>
            <Text style={styles.borrowButtonArrow}>→</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerImg: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#1e293b',
  },
  categoryOuterContainer: {
    marginBottom: 16,
  },
  categoryContainer: {
    paddingVertical: 8,
  },
  categoryPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#e2e8f0',
    marginRight: 8,
  },
  categoryPillActive: {
    backgroundColor: '#3b82f6',
  },
  categoryText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  listCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  itemWrapper: {
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
    marginRight: 12,
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  itemTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 4,
  },
  itemInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  itemCategory: {
    fontSize: 12,
    color: '#6b7280',
    marginRight: 8,
  },
  itemDate: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 8,
    fontStyle: 'normal',
  },
  checkboxOuter: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#3b82f6',
  },
  scrollArrow: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  borrowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
  },
  borrowButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  borrowButtonArrow: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BorrowTakeItems;



