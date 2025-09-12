import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  TextInput,
  type ImageSourcePropType,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
  type LayoutChangeEvent,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

// Simple config
const ITEM_COUNT = 12;
const SCROLL_ARROW_DIAMETER = 56;

// Item type
type Item = { id: string; name: string; image: ImageSourcePropType };

// Local dummy items
const ITEMS_SEED: Item[] = [
  { id: "camera", name: "Camera", image: require("../../assets/images/camera.jpg") },
  { id: "tripod", name: "Tripod", image: require("../../assets/images/tripod.jpg") },
  { id: "microphone", name: "Microphone", image: require("../../assets/images/microphone.jpg") },
  { id: "projector", name: "Projector", image: require("../../assets/images/projector.jpg") },
  { id: "speaker", name: "Speaker", image: require("../../assets/images/speaker.jpg") },
  { id: "laptop", name: "Laptop", image: require("../../assets/images/laptop.jpg") },
  { id: "keyboard", name: "Keyboard", image: require("../../assets/images/keyboard.jpg") },
  { id: "mouse", name: "Mouse", image: require("../../assets/images/mouse.jpg") },
  { id: "cord", name: "Cord", image: require("../../assets/images/cord.jpg") },
  { id: "pot", name: "Pot", image: require("../../assets/images/pot.jpg") },
  { id: "blanket", name: "Blanket", image: require("../../assets/images/blanket.jpg") },
  { id: "folding-chair", name: "Folding Chair", image: require("../../assets/images/chair.jpg") },
];

// Build N items with unique IDs for FlatList
function generateItems(count: number): Item[] {
  return ITEMS_SEED.slice(0, Math.min(count, ITEMS_SEED.length)).map((item, index) => ({
    ...item,
    id: `${item.id}-${index}`,
  }));
}

// Component
const BorrowTakeItems: React.FC = () => {
  // Router
  const router = useRouter();

  // Data
  const items = useMemo(() => generateItems(ITEM_COUNT), []);

  // Selection + search state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  // Derived filtered list
  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return items;
    return items.filter((item) => item.name.toLowerCase().includes(normalizedQuery));
  }, [items, searchQuery]);

  // Scroll Arrow visibility state
  const [listHeight, setListHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [showScrollArrow, setShowScrollArrow] = useState(false);
  const SCROLL_END_OFFSET = 8;

  // Recompute Scroll Arrow visibility based on sizes
  const recomputeScrollArrow = (currListHeight = listHeight, currContentHeight = contentHeight) => {
    const canScroll = currContentHeight > currListHeight + 1;
    setShowScrollArrow(canScroll);
  };

  // List layout handler
  const onListLayout = (layoutEvent: LayoutChangeEvent) => {
    const nextListHeight = layoutEvent.nativeEvent.layout.height;
    setListHeight(nextListHeight);
    recomputeScrollArrow(nextListHeight, contentHeight);
  };

  // Content size handler
  const onContentSizeChange = (_unusedWidth: number, nextContentHeight: number) => {
    setContentHeight(nextContentHeight);
    recomputeScrollArrow(listHeight, nextContentHeight);
  };

  // Scroll handler toggling Scroll Arrow at bottom
  const onScroll = (scrollEvent: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = scrollEvent.nativeEvent;
    const offsetY = contentOffset.y;
    const atBottom = offsetY + layoutMeasurement.height >= contentSize.height - SCROLL_END_OFFSET;
    const canScroll = contentSize.height > layoutMeasurement.height + 1;
    setShowScrollArrow(canScroll && !atBottom);
  };

  // Re-evaluate Scroll Arrow after search filtering
  useEffect(() => {
    const timerId = setTimeout(() => recomputeScrollArrow(), 0);
    return () => clearTimeout(timerId);
  }, [searchQuery]);

  // Toggle checkbox selection
  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Action handler (passes selected items forward)
  const handleBorrowPress = () => {
    const selectedItems = items.filter((item) => selectedIds.has(item.id));
    router.push({
      pathname: "/borrow/returnItems",
      params: { payload: encodeURIComponent(JSON.stringify(selectedItems)) },
    });
  };

  const selectedCount = selectedIds.size;

  // Render
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header image + title */}
        <View style={styles.headerRow}>
          <Image
            source={require("../../assets/images/availableItems.jpg")}
            style={styles.headerImg}
            resizeMode="cover"
          />
          <Text style={styles.headerTitle}>Available Items</Text>
        </View>

        {/* Blue card with search + list */}
        <View style={styles.listCard}>
          {/* Search bar */}
          <View style={styles.searchBox}>
            <FontAwesome name="search" size={16} color="#64748B" style={styles.searchIcon} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search Available Items"
              placeholderTextColor="#64748B"
              style={styles.searchInput}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
          </View>

          {/* Scrollable items */}
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8, paddingBottom: SCROLL_ARROW_DIAMETER + 8 }}
            renderItem={({ item }) => (
              <View style={styles.itemWrapper}>
                <View style={styles.itemRow}>
                  <View style={styles.thumb}>
                    <Image source={item.image} style={styles.thumbImg} resizeMode="cover" />
                  </View>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  <Pressable
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: selectedIds.has(item.id) }}
                    onPress={() => toggleSelection(item.id)}
                    hitSlop={10}
                    style={styles.checkboxOuter}
                  >
                    {selectedIds.has(item.id) && <View style={styles.checkboxInner} />}
                  </Pressable>
                </View>
              </View>
            )}
            onLayout={onListLayout}
            onContentSizeChange={onContentSizeChange}
            onScroll={onScroll}
            scrollEventThrottle={16}
          />

          {/* Floating Scroll Arrow */}
          {showScrollArrow && (
            <View style={styles.scrollArrow} pointerEvents="none">
              <Image
                source={require("../../assets/images/arrow.png")}
                style={styles.scrollArrowImage}
                resizeMode="contain"
              />
            </View>
          )}
        </View>

        {/* Borrow Button */}
        <Pressable onPress={handleBorrowPress} accessibilityRole="button">
          <LinearGradient
            colors={["#5AA4FF", "#2B55C3"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.borrowButton, selectedCount === 0 && { opacity: 0.6 }]}
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

export default BorrowTakeItems;

// Styles
const styles = StyleSheet.create({
  // Root containers
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 8, gap: 16 },

  // Header
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 4 },
  headerImg: { width: 34, height: 34, borderRadius: 8 },
  headerTitle: { fontSize: 26, fontWeight: "800", color: "#0F172A" },

  // Card
  listCard: { flex: 1, backgroundColor: "#2B55C3", borderRadius: 16, padding: 12, position: "relative", overflow: "hidden" },

  // Search
  searchBox: { height: 44, backgroundColor: "#FFFFFF", borderRadius: 12, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", marginBottom: 8 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: "#0F172A", paddingVertical: 0 },

  // Item row
  itemWrapper: { marginBottom: 12 },
  itemRow: { backgroundColor: "#FFFFFF", borderRadius: 16, paddingVertical: 18, paddingHorizontal: 16, flexDirection: "row", alignItems: "center" },

  // Thumbnail
  thumb: { width: 64, height: 64, borderRadius: 14, overflow: "hidden", backgroundColor: "#F1F5F9", borderWidth: 1, borderColor: "#E5E7EB", alignItems: "center", justifyContent: "center", marginRight: 14 },
  thumbImg: { width: "100%", height: "100%" },

  // Item text
  itemTitle: { fontSize: 22, fontWeight: "800", color: "#0F172A", flex: 1 },

  // Checkbox
  checkboxOuter: { width: 26, height: 26, borderRadius: 6, borderWidth: 2, borderColor: "#2B55C3", alignItems: "center", justifyContent: "center", backgroundColor: "transparent" },
  checkboxInner: { width: 16, height: 16, borderRadius: 3, backgroundColor: "#2B55C3" },

  // Scroll Arrow
  scrollArrow: { position: "absolute", bottom: 10, alignSelf: "center", width: SCROLL_ARROW_DIAMETER, height: SCROLL_ARROW_DIAMETER, borderRadius: SCROLL_ARROW_DIAMETER / 2, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", elevation: 2, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  scrollArrowImage: { width: SCROLL_ARROW_DIAMETER * 0.42, height: SCROLL_ARROW_DIAMETER * 0.42 },

  // Borrow Items Button
  borrowButton: { marginTop: 8, marginBottom: 16, borderRadius: 18, paddingVertical: 18, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "center" },
  borrowButtonText: { fontSize: 20, fontWeight: "800", marginRight: 8, color: "#FFFFFF" },
  borrowButtonArrow: { fontSize: 20, fontWeight: "800", color: "#FFFFFF" },
});
