import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#E0F7FA" },
        headerTitleStyle: { fontWeight: "600" },
        headerTintColor: "#333",
      }}
    />
  );
}
