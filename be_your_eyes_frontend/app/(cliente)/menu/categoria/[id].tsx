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

export default function CategoriaDetalle() {
  const { id, menu_id } = useLocalSearchParams();
  const [categoria, setCategoria] = useState(null);
  const [platos, setPlatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${BACKEND_URL}categorias/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCategoria(data);
        return fetch(`${BACKEND_URL}menus/${menu_id}/categorias/${id}/platos`);
      })
      .then((res) => res.json())
      .then((data) => setPlatos(data))
      .catch((err) => {
        console.error(err);
        Alert.alert("Error", "No se pudo cargar la categoría.");
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
  if (!categoria) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Categoría no encontrada.</Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.categoriaTitle}>{categoria.nombre}</Text>
      </View>
      <View style={styles.platosContainer}>
        {platos.length === 0 ? (
          <View style={styles.noPlatosContainer}>
            <Text style={styles.noPlatosText}>No hay platos disponibles</Text>
          </View>
        ) : (
          platos.map((plato) => (
            <View key={plato.id} style={styles.itemContainer}>
              <Text style={styles.itemName}>{plato.nombre}</Text>
              <Text style={styles.itemDescription}>{plato.descripcion}</Text>
              <Text style={styles.itemPrice}>
                Precio: ${plato.precio.toFixed(2)}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  header: {
    marginBottom: 45,
    marginTop: 45,
    alignItems: "center",
  },
  categoriaTitle: {
    fontSize: 27,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 20,
    color: "#273431",
  },
  platosContainer: {
    marginHorizontal: 16,
  },
  itemContainer: {
    backgroundColor: "#DCF0F0",
    padding: 16,
    borderBottomWidth: 1,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
    marginBottom: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#242424",
  },
  itemDescription: {
    fontSize: 16,
    fontWeight: "400",
    color: "#242424",
    marginVertical: 12,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "500",
    color: "#242424",
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  noPlatosContainer: {
    backgroundColor: "#F8D7DA",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  noPlatosText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#721C24",
  },
});
