import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Feather, Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/authContext';
import { Colors } from '@/constants/Colors';

const ProfileButton = ({ router }) => (
  <TouchableOpacity
    onPress={() => {
      router.push("/perfil");
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

export default function LocalLayout() {
  const router = useRouter();
  const { accessToken, logout } = useAuth();

  useEffect(() => {
    if (!accessToken) {
      router.replace('/login');
    }
  }, [accessToken, router]);

  const getScreenOptions = (screenName: string) => ({
    headerTitle: '',
    headerRight: () => {
      // Si estamos en perfil/index o perfil/editar, mostrar logout
      if (screenName === 'perfil/index' || screenName === 'perfil/editar') {
        return <LogoutButton logout={logout} />;
      }
      // En cualquier otra pantalla, mostrar perfil
      return <ProfileButton router={router} />;
    },    // Solo mostrar back si NO es index
    headerLeft: screenName === 'index' ? undefined : () => <BackButton router={router} />,
    headerStyle: {
      backgroundColor: Colors.background,
      shadowColor: 'transparent',
    },
    headerShadowVisible: false,
  });

  return (
    <Stack>
      <Stack.Screen name="index" options={getScreenOptions('index')} />
      <Stack.Screen name="nuevoMenu" options={getScreenOptions('nuevoMenu')} />
      <Stack.Screen name="categorias" options={getScreenOptions('categorias')} />
      <Stack.Screen name="nuevaCategoria" options={getScreenOptions('nuevaCategoria')} />
      <Stack.Screen name="platos" options={getScreenOptions('platos')} />
      <Stack.Screen name="nuevoPlato" options={getScreenOptions('nuevoPlato')} />
      <Stack.Screen name="editarPlato" options={getScreenOptions('editarPlato')} />
      <Stack.Screen name="puntosImpresion" options={getScreenOptions('puntosImpresion')} />
      <Stack.Screen name="perfil/index" options={getScreenOptions('perfil/index')} />
      <Stack.Screen name="perfil/editar" options={getScreenOptions('perfil/editar')} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    paddingHorizontal: 10,
  },
});