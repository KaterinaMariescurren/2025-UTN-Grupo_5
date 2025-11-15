import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useApi } from "@/utils/api";
import { GlobalStyles } from "@/constants/GlobalStyles";
import CardProduct from "@/components/CardProduct";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

export default function CategoriaDetalle() {
  const { id, menu_id } = useLocalSearchParams();
  const [categoria, setCategoria] = useState<any>(null);
  const [platos, setPlatos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { apiFetch } = useApi();

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    apiFetch(`${BACKEND_URL}categorias/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCategoria(data);
        return apiFetch(`${BACKEND_URL}menus/${menu_id}/categorias/${id}/platos`);
      })
      .then((res) => res.json())
      .then((data) => setPlatos(data))
      .catch((err) => {
        console.error(err);
        Alert.alert("Error", "No se pudo cargar la categoría.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // --- Estado de carga ---
  if (loading) {
    return (
      <View
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#07bcb3" />
        <Text style={styles.loadingText}>Cargando categoría...</Text>
      </View>
    );
  }

  // --- Error si no hay categoría ---
  if (!categoria) {
    return (
      <View
        style={styles.errorContainer}
        accessible
        accessibilityRole="alert"
        accessibilityLabel="Categoría no encontrada"
      >
        <Text style={styles.errorText}>Categoría no encontrada.</Text>
      </View>
    );
  }

  // --- Contenido principal ---
  return (
    <View
      style={GlobalStyles.container}
      accessible
      accessibilityLabel={`Pantalla de los platos de la categoría ${categoria.nombre}`}
      accessibilityHint="Explora la lista de platos disponibles en esta categoría."
    >
      <Text
        style={GlobalStyles.tittle}
        accessibilityElementsHidden={true}
        importantForAccessibility="no"
      >
        {categoria.nombre}
      </Text>

      {platos.length === 0 ? (
        <View
          style={styles.noPlatosContainer}
          accessible
          accessibilityRole="alert"
          accessibilityLabel="No hay platos disponibles en esta categoría"
        >
          <Text style={styles.noPlatosText}>
            No hay platos disponibles en esta categoría.
          </Text>
        </View>
      ) : (
        <FlatList
          data={platos}
          showsVerticalScrollIndicator={false}
          accessibilityRole="list"
          accessibilityLabel={`Lista de platos de la categoría ${categoria.nombre}`}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CardProduct
              title={item.nombre}
              description={item.descripcion}
              price={item.precio}
              width="100%"
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
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
    textAlign: "center",
  },
});
