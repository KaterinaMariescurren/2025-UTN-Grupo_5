import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useApi } from "@/utils/api";
import { GlobalStyles } from "@/constants/GlobalStyles";
import CardButton from "@/components/CardButton";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

export default function MenuDetalle() {
  const { id } = useLocalSearchParams();
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [categorias, setCategorias] = useState([]);
  const { apiFetch } = useApi();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiFetch(`${BACKEND_URL}menus/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMenu(data);
        return apiFetch(`${BACKEND_URL}menus/${id}/categorias`);
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

  // 🔹 Si no hay categorías
  if (categorias.length === 0) {
    return (
      <View
        style={[GlobalStyles.container, styles.noDataContainer]}
        accessible
        accessibilityRole="alert"
        accessibilityLabel={`El menú ${menu.nombre} no tiene categorías disponibles`}
      >
        <Text style={styles.noDataText}>
          No hay categorías disponibles para este menú.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={GlobalStyles.container}
      accessible
      accessibilityLabel={`Pantalla de categorias del menú ${menu.nombre}`}
      accessibilityHint="Desliza o explora para ver las categorías del menú."
    >
      <Text
        style={GlobalStyles.tittle}
        accessibilityElementsHidden={true}
        importantForAccessibility="no"
      >
        Menú {menu.nombre}
      </Text>
      <Text
        style={GlobalStyles.subtitle}
        accessibilityElementsHidden={true}
        importantForAccessibility="no"
      >
        Haga click para mas información
      </Text>
      <FlatList
        data={categorias}
        showsVerticalScrollIndicator={false}
        accessibilityRole="list"
        accessibilityLabel={`Lista de Menús de ${menu.nombre}`}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardButton
            name={item.nombre}
            onPress={() => router.push({
              pathname: `/menu/categoria/${item.id}`,
              params: { menu_id: id },
            })}
            accessibilityHintText={`Toca para ver los platos de la categoría ${item.nombre}`}
            width={"100%"}
          />
        )}
      />
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
  noDataContainer: { padding: 30, alignItems: 'center' },
  noDataText: { fontSize: 16, color: '#888', textAlign: 'center' },
});
