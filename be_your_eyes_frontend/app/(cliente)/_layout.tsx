import { Colors } from '@/constants/Colors';
import { Stack, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "@/contexts/authContext";
import { useEffect } from "react";

const ProfileButton = ({ router }) => (
  <TouchableOpacity
    onPress={() => router.push("/profile")}
    style={styles.iconButton}
  >
    <Feather name="user" size={24} color="#000" />
  </TouchableOpacity>
);

const BackButton = ({ router }) => (
  <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
    <Feather name="arrow-left" size={24} color="#000" />
  </TouchableOpacity>
);

export default function RootLayout() {
  const router = useRouter();

  const { accessToken } = useAuth();

  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
    }
  }, [accessToken, router]);

  const commonOptions = {
    headerTitle: "",
    headerRight: () => <ProfileButton router={router} />,
    headerLeft: () => <BackButton router={router} />,
    headerStyle: {
      backgroundColor: Colors.background,
      shadowColor: 'transparent',
    },
    headerShadowVisible: false,
  };

  return (
    <Stack>
      <Stack.Screen name="tiporestaurante" options={commonOptions} />
      <Stack.Screen name="restaurantes/[tipoId]" options={commonOptions} />
      <Stack.Screen name="local/[id]" options={commonOptions} />
      <Stack.Screen name="restaurantes/all" options={commonOptions} />
      <Stack.Screen name="menu/[id]" options={commonOptions} />
      <Stack.Screen name="menu/categoria/[id]" options={commonOptions} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    paddingHorizontal: 10,
  },
});
