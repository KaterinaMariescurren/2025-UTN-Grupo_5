import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

export default function MenuDetalle() {
  const { id } = useLocalSearchParams();
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${BACKEND_URL}menus/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMenu(data);
        return fetch(`${BACKEND_URL}menus/${id}/categorias`);
      })
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => {
        console.error(err);
        Alert.alert("Error", "No se pudo cargar el menú.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  if (!menu) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Menú no encontrado.</Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.menuTitle}>Menú {menu.nombre}</Text>
        <Text style={styles.menuSubTitle}>Haga click para mas información</Text>
      </View>
      {categorias.map((categoria) => (
        <TouchableOpacity
          key={categoria.id}
          style={styles.categoriaContainer}
          onPress={() =>
            router.push({
              pathname: `/menu/categoria/${categoria.id}`,
              params: { menu_id: id },
            })
          }
        >
          <Text style={styles.categoriaTitle}>{categoria.nombre}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  menuTitle: {
    fontSize: 27,
    fontWeight: 700,
    marginBottom: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#273431",
  },
  menuSubTitle: {
    marginBottom: 12,
    fontWeight: 500,
    textAlign: "center",
    fontSize: 16,
    color: "#242424",
  },
  categoriaContainer: {
    backgroundColor: "#E6F8F6",
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  categoriaTitle: {
    fontSize: 20,
    fontWeight: 700,
    textAlign: "center",
    color: "#242424",
  },
  header: {
    marginVertical: 45,
  },
});
