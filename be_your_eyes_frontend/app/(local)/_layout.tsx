import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/authContext';
import { Colors } from '@/constants/Colors';

const ProfileButton = ({ router }) => (
  <TouchableOpacity
    onPress={() => router.push('/profile')}
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

  const commonOptions = {
    headerTitle: '',
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
      <Stack.Screen
        name="index"
        options={commonOptions}
      />
      <Stack.Screen
        name="nuevoMenu"
        options={commonOptions}
      />
      <Stack.Screen
        name="categorias"
        options={commonOptions}
      />
      <Stack.Screen
        name="nuevaCategoria"
        options={commonOptions}
      />
      <Stack.Screen
        name="platos"
        options={commonOptions}
      />
      <Stack.Screen
        name="nuevoPlato"
        options={commonOptions}
      />
      <Stack.Screen
        name="editarPlato"
        options={commonOptions}
      />
      <Stack.Screen
        name="puntosImpresion"
        options={commonOptions}
      />
      {/* Agrega aquí más pantallas del layout del local si las tienes */}
    </Stack>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    paddingHorizontal: 10,
  },
});
