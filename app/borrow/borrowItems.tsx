import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Pressable,
  TextInput,
  Image,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
  ActivityIndicator,
  Button,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

/** =========================
 *  Types that mirror DB
 *  ========================= */
type DBCategory = {
  item_category_id: number;
  item_category_name: string;
};

type DBInventoryItem = {
  inventory_item_id: number;
  item_name: string;
  item_image_id: number | null;
  item_category_id: number | null;
  // joined relations
  item_category: DBCategory | null;
  items_images: { image_link: string } | null; // alias for FK join result
  // availability
  is_available: boolean;
  quantity_available: number | null;
};

/** =========================
 *  UI Types
 *  ========================= */
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

const DEFAULT_IMAGE = require("../../assets/images/no-image-available.jpg");
const CATEGORIES: Category[] = [{ id: "all", name: "All Items" }];
const SCROLL_END_OFFSET = 8;

const BorrowTakeItems = () => {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [listHeight, setListHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [showScrollArrow, setShowScrollArrow] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  /** =========================
   *  Fetch helpers
   *  ========================= */
  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from("item_category")
      .select("item_category_id, item_category_name")
      .order("item_category_name", { ascending: true });

    if (error) throw error;

    if (data?.length) {
      setCategories([
        { id: "all", name: "All Items" },
        ...data.map((cat: DBCategory) => ({
          id: String(cat.item_category_id),
          name: cat.item_category_name,
        })),
      ]);
    }
  }, []);

  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase
      .from("inventory_items")
      .select(
        `
        inventory_item_id,
        item_name,
        item_image_id,
        item_category_id,
        is_available,
        quantity_available,
        item_category:item_category_id(item_category_id,item_category_name),
        items_images:inventory_items_item_image_id_fkey(image_link)
      `
      )
      .eq("is_available", true) // only items marked available
      .gt("quantity_available", 0) // and with stock
      .not("item_name", "is", null);

    if (error) throw error;

    const formatted: Item[] = (data as DBInventoryItem[]).map((row) => ({
      id: String(row.inventory_item_id),
      name: row.item_name,
      imageUrl: row.items_images?.image_link ?? null,
      category: row.item_category?.item_category_name ?? "Other",
      categoryId: row.item_category_id ? String(row.item_category_id) : "other",
      isAvailable: row.is_available && (row.quantity_available ?? 0) > 0,
      // you can replace this with a real created_date if you later expose it
      addedDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    }));

    setItems(formatted);
  }, []);

  const loadAll = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      await Promise.all([fetchCategories(), fetchItems()]);
    } catch (e: any) {
      console.error("Error loading data:", e);
      setError(e?.message ?? "Failed to load items. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [fetchCategories, fetchItems]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  /** =========================
   *  Derived list (search + filter)
   *  ========================= */
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.categoryId === selectedCategory;
      const matchesSearch = !q || item.name.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [items, searchQuery, selectedCategory]);

  /** =========================
   *  Scroll helpers
   *  ========================= */
  const recomputeScrollArrow = (
    currListHeight = listHeight,
    currContentHeight = contentHeight
  ) => {
    setShowScrollArrow(currContentHeight > currListHeight + 1);
  };

  const onListLayout = (e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout;
    setListHeight(height);
    recomputeScrollArrow(height, contentHeight);
  };

  const onContentSizeChange = (_w: number, nextContentHeight: number) => {
    setContentHeight(nextContentHeight);
    recomputeScrollArrow(listHeight, nextContentHeight);
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isAtBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - SCROLL_END_OFFSET;
    setShowScrollArrow(!isAtBottom);
  };

  /** =========================
   *  Selection + navigate
   *  ========================= */
  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBorrowPress = () => {
    if (selectedIds.size > 0) {
      // Navigate to confirmation screen
      router.push({
        pathname: "/borrow/confirm" as const,
        params: { selectedIds: Array.from(selectedIds).join(",") },
      } as any);
    }
  };

  const selectedCount = selectedIds.size;

  /** =========================
   *  Render
   *  ========================= */
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
        <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
        <Button title="Retry" onPress={loadAll} />
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
          <MaterialIcons
            name="search"
            size={20}
            color="#64748b"
            style={styles.searchIcon}
          />
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
                  selectedCategory === category.id && styles.categoryPillActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.id &&
                      styles.categoryTextActive,
                  ]}
                >
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
                        <Text style={styles.itemDate}>{item.addedDate}</Text>
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

        {/* Scroll to top */}
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
              {selectedCount > 0
                ? `Borrow Items (${selectedCount})`
                : "Borrow Items"}
            </Text>
            <Text style={styles.borrowButtonArrow}>→</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

/** =========================
 *  Styles
 *  ========================= */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "bold",
    color: "#1e293b",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
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
    height: "100%",
    fontSize: 16,
    color: "#1e293b",
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
    backgroundColor: "#e2e8f0",
    marginRight: 8,
  },
  categoryPillActive: {
    backgroundColor: "#3b82f6",
  },
  categoryText: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "#ffffff",
  },
  listCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  itemWrapper: {
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
    marginRight: 12,
  },
  thumbImg: {
    width: "100%",
    height: "100%",
  },
  itemTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: 4,
  },
  itemInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  itemCategory: {
    fontSize: 12,
    color: "#6b7280",
    marginRight: 8,
  },
  itemDate: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 8,
    fontStyle: "normal",
  },
  checkboxOuter: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: "#3b82f6",
  },
  scrollArrow: {
    position: "absolute",
    bottom: 80,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  borrowButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
  },
  borrowButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  borrowButtonArrow: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default BorrowTakeItems;