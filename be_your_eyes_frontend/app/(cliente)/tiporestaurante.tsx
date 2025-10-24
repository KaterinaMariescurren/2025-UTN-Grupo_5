import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

export default function TipoRestaurantes() {
  const [tipos, setTipos] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch(`${BACKEND_URL}tipos_local/`)
      .then(res => res.json())
      .then(data => setTipos(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tipos de Restaurantes</Text>
      <FlatList
        data={tipos}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/restaurantes/${item.id}`)}
          >
            <Text style={styles.cardText}>{item.nombre}</Text>
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
    backgroundColor: "#daf3ef",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  cardText: { fontSize: 18, color: "#07bcb3", fontWeight: "600" },
});