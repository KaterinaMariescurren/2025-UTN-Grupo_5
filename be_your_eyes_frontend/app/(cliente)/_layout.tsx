import { Colors } from '@/constants/Colors';
import { Stack, useRouter } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "@/contexts/authContext";
import { useEffect } from "react";

const ProfileButton = ({ router }) => (
  <TouchableOpacity
    onPress={() => {
      router.push("/(cliente)/perfil");
    }}
    style={styles.iconButton}
    accessible
    accessibilityRole="button"
    accessibilityLabel="Abrir perfil"
    accessibilityHint="Toca para ir a tu perfil de usuario"
  >
    <Feather name="user" size={24} color="#000" />
  </TouchableOpacity>
);

const BackButton = ({ router }) => (
  <TouchableOpacity
    onPress={() => router.back()}
    style={styles.iconButton}
    accessible
    accessibilityRole="button"
    accessibilityLabel="Volver atrás"
    accessibilityHint="Toca para regresar a la pantalla anterior"
  >
    <Feather name="arrow-left" size={24} color="#000" />
  </TouchableOpacity>
);

const LogoutButton = ({ logout }) => (
  <TouchableOpacity
    onPress={logout}
    accessibilityRole="button"
    accessibilityLabel="Cerrar sesión"
    accessibilityHint="Cierra tu sesión actual"
  >
    <Ionicons
      name="log-out-outline"
      size={26}
      color={Colors.text}
      style={styles.iconButton}
    />
  </TouchableOpacity>
);

export default function ClienteLayout() {
  const router = useRouter();
  const { accessToken, logout } = useAuth();

  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
    }
  }, [accessToken, router]);

  const getScreenOptions = (screenName: string) => ({
    headerTitle: "",
    headerRight: () => {
      // Si estamos en perfil o perfil/editar, mostrar logout
      if (screenName === "perfil" || screenName === "editarPerfil") {
        return <LogoutButton logout={logout} />;
      }
      // En cualquier otra pantalla, mostrar perfil
      return <ProfileButton router={router} />;
    },
    // Solo mostrar back si NO es tiporestaurante (pantalla principal)
    headerLeft: screenName === "tiporestaurante" ? undefined : () => <BackButton router={router} />,
    headerStyle: {
      backgroundColor: Colors.background,
      shadowColor: 'transparent',
    },
    headerShadowVisible: false,
  });

  return (
    <Stack>
      <Stack.Screen name="tiporestaurante" options={getScreenOptions("tiporestaurante")} />
      <Stack.Screen name="restaurantes/[tipoId]" options={getScreenOptions("restaurantes/[tipoId]")} />
      <Stack.Screen name="local/[id]" options={getScreenOptions("local/[id]")} />
      <Stack.Screen name="restaurantes/all" options={getScreenOptions("restaurantes/all")} />
      <Stack.Screen name="menu/[id]" options={getScreenOptions("menu/[id]")} />
      <Stack.Screen name="menu/categoria/[id]" options={getScreenOptions("menu/categoria/[id]")} />
      <Stack.Screen name="perfil" options={getScreenOptions("perfil")} />
      <Stack.Screen name="editarPerfil" options={getScreenOptions("editarPerfil")} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    paddingHorizontal: 10,
  },
});