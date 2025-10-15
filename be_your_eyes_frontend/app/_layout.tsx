// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Slot, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { AuthProvider, useAuth } from "@/contexts/authContext";
import { useColorScheme } from "@/hooks/use-color-scheme";

// AuthGate para redirigir automáticamente según token
function AuthGate() {
  const { accessToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (accessToken) {
      router.replace("/(local)");
    }
  }, [accessToken, router]);

  return <Slot />;

}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AuthGate />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
