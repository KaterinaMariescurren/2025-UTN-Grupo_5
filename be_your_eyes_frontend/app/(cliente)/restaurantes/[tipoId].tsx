import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

export default function RestaurantesPorTipo() {
  const { tipoId } = useLocalSearchParams();
  const [locales, setLocales] = useState([]);
  const [nombreTipo, setNombreTipo] = useState("Cargando...")
  const router = useRouter();

  useEffect(() => {
    fetch(`${BACKEND_URL}tipos_local/${tipoId}`)
      .then(res => res.json())
      .then(data => setNombreTipo(data.nombre)) 
      .catch(err => {
        console.error("Error al cargar el nombre del tipo:", err);
        setNombreTipo("Tipo Desconocido");
      });
    fetch(`${BACKEND_URL}locales/buscar/?tipo_local_id=${tipoId}`)
      .then(res => res.json())
      .then(data => setLocales(data))
      .catch(err => console.error("Error al cargar locales:", err));
  }, [tipoId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{nombreTipo} (Locales)</Text>
      <FlatList
        data={locales}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/local/${item.id}`)}
          >
            <Text style={styles.name}>{item.nombre}</Text>
            {item.tiene_menu_accesible && (
              <Text style={styles.accesible}>✅ Carta accesible</Text>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
  card: {
    backgroundColor: "#f4f4f4",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  name: { fontSize: 18, fontWeight: "600", color: "#333" },
  accesible: { color: "green", marginTop: 5 },
});
