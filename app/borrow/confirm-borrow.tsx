import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList, Button, StyleSheet, Modal, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import { requestService } from '../../services/request.service';
import BackHeaderBar from '../../components/universal/header-back-button';

type DBItem = {
    inventory_item_id: number;
    item_name: string;
    item_image_id: number | null;
    quantity_available: number;
};

const ConfirmBorrow = () => {
    const { selectedIds } = useLocalSearchParams();
    const router = useRouter();
    const [items, setItems] = useState<DBItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchSelectedItems = async () => {
            if (!selectedIds) {
                setItems([]);
                return;
            }

            // selectedIds is expected as a comma-separated string like "1,2,3"
            const ids = (selectedIds as string)
                .split(",")
                .map(s => s.trim())
                .filter(Boolean)
                .map(Number)
                .filter(n => !Number.isNaN(n));

            if (ids.length === 0) {
                setItems([]);
                return;
            }

            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from("inventory_items")
                    .select("inventory_item_id, item_name, item_image_id, quantity_available")
                    .in("inventory_item_id", ids)
                    .returns<DBItem[]>();

                if (error) throw error;
                setItems(data || []);
            } catch (err) {
                console.error("Error fetching selected items:", err);
                setError("Failed to load selected items.");
            } finally {
                setLoading(false);
            }
        };

        fetchSelectedItems();
    }, [selectedIds]);

    const [submitting, setSubmitting] = useState(false);

    const handleConfirm = async () => {
        if (!selectedIds) return;

        const ids = (selectedIds as string)
            .split(',')
            .map(s => Number(s.trim()))
            .filter(n => !Number.isNaN(n));

        if (ids.length === 0) return;

        try {
            setSubmitting(true);

            // Get current user id from session
            const { data: sessionData } = await supabase.auth.getSession();
            const userId = sessionData?.session?.user?.id;

            if (!userId) {
                setError('You must be signed in to request items.');
                return;
            }

            await requestService.createInventoryRequest(userId, ids);

            // Show success modal
            setModalVisible(true);
        } catch (err: any) {
            console.error('Failed to create inventory request', err);
            setError(err?.message || 'Failed to submit request');
        } finally {
            setSubmitting(false);
        }
    };

    const handleModalClose = () => {
        setModalVisible(false);
        router.back(); // Navigate back one screen
    };

    if (!selectedIds) {
        return (
            <View style={styles.center}>
                <Text>No items selected.</Text>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Confirm Borrow</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <FlatList
                data={items}
                keyExtractor={(i) => i.inventory_item_id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.itemRow}>
                        <Text style={styles.itemName}>{item.item_name}</Text>
                        <Text style={styles.itemQty}>Available: {item.quantity_available}</Text>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <View style={styles.center}>
                        <Text>No items found for the selected IDs.</Text>
                    </View>
                )}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={handleModalClose}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Request Submitted!</Text>
                        <Text style={styles.modalSubText}>Your request has been sent for approval.</Text>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={handleModalClose}
                        >
                            <Text style={styles.textStyle}>Done</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <View style={styles.actions}>
                <Button title="Confirm Borrow" onPress={handleConfirm} disabled={submitting} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
    itemRow: { paddingVertical: 10, borderBottomWidth: 1, borderColor: '#e6e6e6' },
    itemName: { fontSize: 16, fontWeight: '500' },
    itemQty: { fontSize: 12, color: '#6b7280', marginTop: 4 },
    actions: { marginTop: 16 },
    error: { color: 'red', marginBottom: 8 },
    // Modal styles
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 8,
        textAlign: "center",
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalSubText: {
        marginBottom: 15,
        textAlign: "center",
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        minWidth: 100,
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
});

export default ConfirmBorrow;