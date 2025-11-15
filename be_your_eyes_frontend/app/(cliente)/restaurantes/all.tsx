import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import Buscardor from "@/components/Buscador";
import { GlobalStyles } from "@/constants/GlobalStyles";
import { LocalItem } from "./[tipoId]";
import CardButton from "@/components/CardButton";
import { useApi } from "@/utils/api";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

export default function TodosLosRestaurantes() {
  const [locales, setLocales] = useState<LocalItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { apiFetch } = useApi();

  useFocusEffect(
  useCallback(() => {
    setLoading(true);

    apiFetch(`${BACKEND_URL}locales/`)
      .then(res => res.json())
      .then(data => {
        setLocales(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar todos los locales:", err);
        setLoading(false);
      });
  }, [apiFetch]));

  const filteredLocales = locales.filter(item =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (
      item.direccion &&
      `${item.direccion.calle} ${item.direccion.altura}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#07bcb3" style={styles.loadingIndicator} />;
    }

    if (locales.length === 0) {
      return (
        <View
          style={styles.noDataContainer}
          accessible
          accessibilityRole="alert"
          accessibilityLabel="No hay locales disponibles en este momento"
        >
          <Text style={styles.noDataText}> No hay locales disponibles en este momento.</Text>
        </View>
      );
    }

    if (filteredLocales.length === 0) {
      return (
        <View
          style={styles.noDataContainer}
          accessible
          accessibilityRole="alert"
          accessibilityLabel="No se encontraron restaurantes que coincidan con la búsqueda"
        >
          <Text style={styles.noDataText}>
            No se encontraron restaurantes que coincidan con la búsqueda.
          </Text>
        </View>
      );
    }

    return (

      <FlatList
        data={filteredLocales}
        showsVerticalScrollIndicator={false}
        accessibilityRole="list"
        accessibilityLabel="Lista de todos los restaurantes disponibles"
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <CardButton
            name={item.nombre}
            address={`${item.direccion.calle} ${item.direccion.altura}`}
            tieneMenuAccesible={item.tiene_menu_accesible}
            onPress={() => router.push(`/local/${item.id}`)}
            accessibilityHintText={`Toca para ver la información detallada del restaurante ${item.nombre}`}
            width={"100%"}
          />
        )}
      />
    );
  };

  return (
    <View
      style={GlobalStyles.container}
      accessible
      accessibilityLabel="Pantalla de todos los restaurantes"
      accessibilityHint="Desliza hacia abajo o usa el rotor para explorar los restaurantes disponibles"
    >
      <Text
        style={GlobalStyles.tittleMarginVertical}
        accessibilityElementsHidden={true}
        importantForAccessibility="no"
      >
        Todos los restaurantes
      </Text>
      <Text
        style={GlobalStyles.subtitle}
        accessibilityElementsHidden={true}
        importantForAccessibility="no"
      >
        Encuentra tu local
      </Text>

      <Buscardor
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Buscar restaurantes..."
        accessibilityLabel="Buscar restaurantes"
      />

      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingIndicator: { marginTop: 50 },
  noDataContainer: { padding: 30, alignItems: 'center' },
  noDataText: { fontSize: 16, color: '#888', textAlign: 'center' },
});