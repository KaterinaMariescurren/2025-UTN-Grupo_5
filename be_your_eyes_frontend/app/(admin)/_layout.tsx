import { Colors } from '@/constants/Colors';
import { Stack, useRouter, Router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "@/contexts/authContext";
import { useEffect } from "react";


const BackButton = ({ router }: { router: Router }) => (
  <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
    <Feather name="arrow-left" size={24} color="#000" />
  </TouchableOpacity>
);

const LogoutButton = ({ logout }: { logout: () => void }) => (
  <TouchableOpacity onPress={() => logout()} style={styles.iconButton}>
    <Feather name="log-out" size={24} color="#000" />
  </TouchableOpacity>
);

export default function RootLayout() {
  const router = useRouter();

  const { accessToken, logout } = useAuth();

  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
    }
  }, [accessToken, router]);

  const commonOptions = {
    headerTitle: "",
    headerLeft: () => <BackButton router={router} />,
    headerRight: () => <LogoutButton logout={logout} />,
    headerStyle: {
      backgroundColor: Colors.background,
      shadowColor: 'transparent',
    },
    headerShadowVisible: false,
  };

  return (
    <Stack>
      <Stack.Screen name="index" options={commonOptions} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    paddingHorizontal: 10,
  },
});
