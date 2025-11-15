// app/_layout.tsx
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Slot, useRootNavigationState, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";

import { AuthProvider, useAuth } from "@/contexts/authContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ActivityIndicator, View } from "react-native";

// AuthGate para redirigir automáticamente según token
function AuthGate() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState(); // 🔑 Espera a que se monte el árbol
  const [loading, setLoading] = useState(true);

  const redirected = useRef(false);

  useEffect(() => {
    const verificarTipo = async () => {
      // Espera a que el árbol de navegación esté listo
      if (!rootNavigationState?.key || redirected.current) return;
      redirected.current = true;

      // Si no hay token → login
     if (!accessToken) {
        setTimeout(() => router.replace("/"), 0);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/me/tipo`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (!response.ok) {
          throw new Error("Token inválido o sesión expirada");
        }

        const data = await response.json();

        // Redirección según tipo
        if (data.tipo === "local") {
          router.replace("/(local)");
        } else {
          router.replace("/(cliente)/tiporestaurante");
        }
      } catch (error) {
        console.error("Error verificando token:", error);
        setTimeout(() => router.replace("/login"), 0);
      } finally {
        setLoading(false);
      }
    };

    verificarTipo();
  }, [accessToken, rootNavigationState?.key, router]);

  // Loader central mientras verifica el token
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

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
