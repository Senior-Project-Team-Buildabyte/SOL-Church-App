import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  Pressable,
  Alert,
} from "react-native";
import { supabase } from "../../lib/supabase";
import { MaterialIcons } from "@expo/vector-icons";

/** DB row shape we read on this screen */
type DBInventoryItem = {
  inventory_item_id: number;
  item_name: string;
  item_category_id: number | null;
  is_available: boolean;
  quantity_available: number | null;
  item_category?: {
    item_category_id: number;
    item_category_name: string;
  } | null;
};

type UiItem = {
  id: number;
  name: string;
  categoryName: string;
  isAvailable: boolean;
  qtyAvailable: number;
};

const AdminManageItems = () => {
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [items, setItems] = useState<UiItem[]>([]);
  const [search, setSearch] = useState("");
  const [showUnavailable, setShowUnavailable] = useState(true);

  const loadItems = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("inventory_items")
        .select(`
          inventory_item_id,
          item_name,
          item_category_id,
          is_available,
          quantity_available,
          item_category:item_category_id(item_category_id, item_category_name)
        `)
        .order("item_name", { ascending: true });

      if (error) throw error;

      const formatted: UiItem[] = (data as DBInventoryItem[]).map((r) => ({
        id: r.inventory_item_id,
        name: r.item_name,
        categoryName: r.item_category?.item_category_name ?? "Other",
        isAvailable: r.is_available,
        qtyAvailable: r.quantity_available ?? 0,
      }));

      setItems(formatted);
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? "Failed to load items.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((it) => {
      const matchesQ = !q || it.name.toLowerCase().includes(q);
      const matchesAvail = showUnavailable ? true : it.isAvailable;
      return matchesQ && matchesAvail;
    });
  }, [items, search, showUnavailable]);

  /** Toggle availability with optimistic UI */
  const toggleAvailability = async (id: number, next: boolean) => {
    // optimistic update
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, isAvailable: next } : it))
    );
    setSavingId(id);

    try {
      const { data, error } = await supabase
        .from("inventory_items")
        .update({ is_available: next })
        .eq("inventory_item_id", id)
        .select("inventory_item_id, is_available")
        .single();

      if (error) throw error;
      if (!data) throw new Error("No data returned from update.");
    } catch (e: any) {
      // rollback if failed
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, isAvailable: !next } : it))
      );
      console.error(e);
      Alert.alert("Update failed", e?.message ?? "Unable to update item.");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={[styles.container, styles.center]}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={[styles.container, styles.center]}>
          <Text style={{ color: "red", marginBottom: 12 }}>{error}</Text>
          <Pressable style={styles.retryBtn} onPress={loadItems}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <MaterialIcons name="inventory" size={24} color="#1e293b" />
          <Text style={styles.headerTitle}>Manage Items</Text>
        </View>

        {/* Controls row */}
        <View style={styles.controlsRow}>
          <View style={styles.searchBox}>
            <MaterialIcons
              name="search"
              size={20}
              color="#64748b"
              style={{ marginRight: 8 }}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search items..."
              value={search}
              onChangeText={setSearch}
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Show unavailable</Text>
            <Switch
              value={showUnavailable}
              onValueChange={setShowUnavailable}
              thumbColor={showUnavailable ? "#3b82f6" : "#e5e7eb"}
            />
          </View>
        </View>

        {/* List */}
        <ScrollView style={styles.card}>
          {filtered.length === 0 ? (
            <View style={[styles.center, { paddingVertical: 24 }]}>
              <Text>No items found.</Text>
            </View>
          ) : (
            filtered.map((it) => (
              <View key={it.id} style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{it.name}</Text>
                  <Text style={styles.itemMeta}>
                    {it.categoryName} • Qty: {it.qtyAvailable}
                  </Text>
                </View>

                <View style={styles.toggleWrap}>
                  <Text style={styles.availText}>
                    {it.isAvailable ? "Available" : "Hidden"}
                  </Text>
                  <Switch
                    value={it.isAvailable}
                    onValueChange={(next) => toggleAvailability(it.id, next)}
                    disabled={savingId === it.id}
                    thumbColor={it.isAvailable ? "#22c55e" : "#e5e7eb"}
                  />
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },
  container: { flex: 1, padding: 16 },
  center: { justifyContent: "center", alignItems: "center" },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e293b",
  },

  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: { flex: 1, height: "100%", fontSize: 16, color: "#1e293b" },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  switchLabel: { color: "#334155" },

  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  itemName: { fontSize: 16, fontWeight: "600", color: "#0f172a" },
  itemMeta: { fontSize: 12, color: "#64748b", marginTop: 2 },
  toggleWrap: {
    alignItems: "flex-end",
    gap: 4,
  },
  availText: { fontSize: 12, color: "#64748b" },

  retryBtn: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  retryText: { color: "#fff", fontWeight: "600" },
});

export default AdminManageItems;
