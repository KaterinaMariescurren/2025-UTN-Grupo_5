import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { useApi } from "@/utils/api";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

export default function TodosLosRestaurantes() {
  const [locales, setLocales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { apiFetch } = useApi();

  useEffect(() => {
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
  }, []);

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
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}> No hay locales disponibles en este momento.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredLocales}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/local/${item.id}`)}
          >
            <Text style={styles.name}>{item.nombre}</Text>
            <Text style={styles.address}>
              {item.direccion ? `${item.direccion.calle} ${item.direccion.altura}` : 'Dirección no disponible'}
            </Text>
            {item.tiene_menu_accesible && (
              <Text style={styles.accesible}>✅ Carta accesible</Text>
            )}
          </TouchableOpacity>
        )}
      />
    );
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todos los restaurantes</Text>
      <Text style={styles.subtitle}>Encuentra tu local</Text> 

      <View style={styles.searchBar}>
        <Feather name="search" size={20} color="#888" style={{ marginRight: 10 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar local..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", color: '#333', textAlign: 'center', marginTop: 10 },
  subtitle: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 25, paddingHorizontal: 15, paddingVertical: 8, marginBottom: 20, borderWidth: 1, borderColor: '#eee', },
  searchInput: { flex: 1, fontSize: 16 },
  card: { backgroundColor: '#E6F8F6', padding: 16, borderRadius: 12, marginBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 2, },
  name: { fontSize: 18, fontWeight: "bold", color: '#333', marginBottom: 5, },
  address: { fontSize: 14, color: '#666', },
  accesible: { color: "green", marginTop: 5, fontWeight: '500', },
  loadingIndicator: { marginTop: 50 },
  noDataContainer: { padding: 30, alignItems: 'center' },
  noDataText: { fontSize: 16, color: '#888', textAlign: 'center' },
});