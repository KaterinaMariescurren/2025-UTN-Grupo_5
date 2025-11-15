import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/authContext';
import { Colors } from '@/constants/Colors';

const ProfileButton = ({ router }) => (
  <TouchableOpacity
    onPress={() => {
      router.replace("/perfil");
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

export default function LocalLayout() {
  const router = useRouter();
  const { accessToken } = useAuth();

  useEffect(() => {
    if (!accessToken) {
      router.replace('/login');
    }
  }, [accessToken, router]);

  const getScreenOptions = (screenName: string) => ({
    headerTitle: '',
    headerRight: () => <ProfileButton router={router} />,
    // Solo mostrar back si NO es index
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
    </Stack>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    paddingHorizontal: 10,
  },
});