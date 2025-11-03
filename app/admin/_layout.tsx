import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="inventory_requests"
        options={{
          title: "Inventory Requests",
          headerBackTitle: "Back",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
