import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

export default function DetalleLocal() {
  const { id } = useLocalSearchParams();
  const [local, setLocal] = useState<any>(null);
  const [menus, setMenus] = useState<any[]>([]);
  const [loadingMenus, setLoadingMenus] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch del local
    fetch(`${BACKEND_URL}locales/${id}`)
      .then(res => res.json())
      .then(data => setLocal(data))
      .catch(err => console.error(err));

    // Fetch de los menús
    fetch(`${BACKEND_URL}menus/local/${id}`)
      .then(res => res.json())
      .then(data => {
        // Asegurarse de que sea un arreglo
        if (Array.isArray(data)) setMenus(data);
        else if (Array.isArray(data.menus)) setMenus(data.menus);
        else setMenus([]);
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingMenus(false));
  }, [id]);

  const notificarCumplimiento = async (cumple: boolean) => {
    try {
      await fetch(`${BACKEND_URL}notificaciones/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona_id: user.id, // cambiar por el ID real del usuario logueado
          local_id: parseInt(id as string),
          tiene_carta: cumple,
        }),
      });
      Alert.alert("Gracias", cumple ? "Se notificó que el local CUMPLE" : "Se notificó que NO cumple");
    } catch (error) {
      Alert.alert("Error", "No se pudo enviar la notificación");
    }
  };

  if (!local) return <Text>Cargando local...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{local.nombre}</Text>
      <Text style={styles.subtitle}>{local.direccion}</Text>

      {local.tiene_menu_accesible ? (
        <Text style={styles.accesible}>✅ Carta accesible confirmada</Text>
      ) : (
        <Text style={styles.noAccesible}>⚠️ Carta no confirmada</Text>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.notifyButton, { backgroundColor: "#07bcb3" }]}
          onPress={() => notificarCumplimiento(true)}
        >
          <Text style={styles.notifyText}>Cumple</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.notifyButton, { backgroundColor: "#ff5a5f" }]}
          onPress={() => notificarCumplimiento(false)}
        >
          <Text style={styles.notifyText}>No cumple</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Menús</Text>

      {loadingMenus ? (
        <Text>Cargando menús...</Text>
      ) : menus.length === 0 ? (
        <Text>No hay menús disponibles</Text>
      ) : (
        menus.map(menu => (
          <TouchableOpacity
            key={menu.id}
            style={styles.menuCard}
            onPress={() => router.push(`/menu/${menu.id}`)}
          >
            <Text style={styles.menuName}>{menu.nombre}</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { fontSize: 16, color: "#555", marginBottom: 8 },
  accesible: { color: "green", fontWeight: "600", marginBottom: 8 },
  noAccesible: { color: "red", fontWeight: "600", marginBottom: 8 },
  buttonRow: { flexDirection: "row", gap: 10, marginVertical: 12 },
  notifyButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  notifyText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginTop: 16, marginBottom: 8 },
  menuCard: {
    backgroundColor: "#daf3ef",
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
  },
  menuName: { fontSize: 18, color: "#07bcb3", fontWeight: "600" },
});
