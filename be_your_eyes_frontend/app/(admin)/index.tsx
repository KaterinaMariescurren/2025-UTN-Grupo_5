import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useApi } from "@/utils/api";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface Direccion {
  id: number;
  calle: string;
  altura: number;
  codigo_postal: string;
}

interface Local {
  id: number;
  nombre: string;
  direccion: Direccion;
  habilitado: boolean;
}

export default function LocalListScreen() {
  const [locales, setLocales] = useState<Local[]>([]);
  const [loading, setLoading] = useState(true);
  const { apiFetch } = useApi();

  const fetchLocales = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(
        `${process.env.EXPO_PUBLIC_API_URL}locales`
      );
      const data = await response.json();
      const localesOrdenados = data.sort(
        (a: Local, b: Local) => Number(a.habilitado) - Number(b.habilitado)
      );
      setLocales(localesOrdenados);
    } catch (error) {
      console.error("Error al cargar locales:", error);
      Alert.alert("Error", "No se pudieron cargar los locales.");
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (id: number, habilitado: boolean) => {
    const accion = habilitado ? "deshabilitar" : "habilitar";
    Alert.alert(
      "Confirmar acción",
      `¿Seguro que deseas ${accion} este local?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Aceptar",
          onPress: async () => {
            try {
              const response = await apiFetch(
                `${
                  process.env.EXPO_PUBLIC_API_URL
                }locales/${id}/habilitar?habilitado=${!habilitado}`,
                {
                  method: "PATCH",
                }
              );

              if (!response.ok) throw new Error("Error en la petición");
              fetchLocales();
            } catch (error) {
              console.error(`Error al ${accion} local:`, error);
              Alert.alert("Error", `No se pudo ${accion} el local.`);
            }
          },
        },
      ]
    );
  };

  const eliminarLocal = async (id: number) => {
    Alert.alert(
      "Eliminar local",
      "¿Estás seguro de eliminar este local? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await apiFetch(
                `${process.env.EXPO_PUBLIC_API_URL}locales/${id}`,
                {
                  method: "DELETE",
                }
              );

              fetchLocales();
            } catch (error) {
              console.error("Error al eliminar local:", error);
              Alert.alert("Error", "No se pudo eliminar el local.");
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchLocales();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00B4D8" />
      </View>
    );
  }

  return (
    <View style={styles.container} accessible>
      <Text
        style={styles.title}
        accessibilityLabel="Lista de locales registrados"
      >
        Locales registrados
      </Text>

      <FlatList
        data={locales}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              !item.habilitado && {
                opacity: 0.7,
                backgroundColor: Colors.background,
              },
            ]}
            accessible
            accessibilityLabel={`Local ${item.nombre}, ${
              item.habilitado ? "habilitado" : "deshabilitado"
            }`}
          >
            <View>
              <Text style={styles.localName}>{item.nombre}</Text>
              <Text style={styles.localAddress}>
                {item.direccion
                  ? `${item.direccion.calle ?? ""} ${
                      item.direccion.altura ?? ""
                    } (${item.direccion.codigo_postal ?? ""})`
                  : "Sin dirección"}
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => cambiarEstado(item.id, item.habilitado)}
                style={[
                  styles.button,
                  {
                    backgroundColor: item.habilitado ? "#FFB703" : "#219EBC",
                  },
                ]}
                accessible
                accessibilityLabel={`${
                  item.habilitado ? "Deshabilitar" : "Habilitar"
                } local ${item.nombre}`}
              >
                <Feather
                  name={item.habilitado ? "pause" : "check"}
                  size={18}
                  color="#fff"
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => eliminarLocal(item.id)}
                style={[styles.button, { backgroundColor: "#E63946" }]}
                accessible
                accessibilityLabel={`Eliminar local ${item.nombre}`}
              >
                <Feather name="trash-2" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay locales registrados.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 32,
    color: Colors.text,
    textAlign: "center",
  },
  card: {
    backgroundColor: Colors.secondary,
    padding: 16,
    marginBottom: 10,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  localName: { fontSize: 18, fontWeight: "600", color: Colors.text },
  localAddress: { fontSize: 14, color: Colors.text, marginTop: 4 },
  actions: { flexDirection: "row", gap: 8 },
  button: {
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#8E9A9D",
    marginTop: 20,
    fontSize: 16,
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
