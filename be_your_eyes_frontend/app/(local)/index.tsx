import { useAuth } from "@/contexts/authContext";
import { useApi } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Menu = {
  id: number;
  nombre: string;
};

export default function MenusScreen() {
  const { accessToken, logout } = useAuth();
  const [localId, setLocalId] = useState<number | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const router = useRouter();
  const { apiFetch } = useApi();

  useEffect(() => {
    const fetchLocalId = async () => {
      if (!accessToken) return;
      try {
        const res = await apiFetch(
          `${process.env.EXPO_PUBLIC_API_URL}me/local_id`
        );
        const data = await res.json();
        setLocalId(data.local_id);
      } catch (error) {
        console.error("Error al obtener localId:", error);
        Alert.alert(
          "Error",
          "No se pudo obtener el local. Por favor, logueate nuevamente."
        );
        router.replace("/login");
      }
    };

    fetchLocalId();
    const fetchMenus = async () => {
      if (!accessToken) return;
      try {
        const res = await apiFetch(
          `${process.env.EXPO_PUBLIC_API_URL}menus/local/${localId}`
        );
        const data = await res.json();
        setMenus(data);
      } catch (error) {
        console.error("Error al obtener menús:", error);
      }
    };
    fetchMenus();
  }, [accessToken, apiFetch, localId, router]); // sólo depende del token

  const handleEliminarMenu = async (menuId: number) => {
    Alert.alert(
      "Eliminar Menú",
      "¿Estás seguro de que quieres eliminar este menú?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await apiFetch(
                `${process.env.EXPO_PUBLIC_API_URL}menus/${menuId}`,
                {
                  method: "DELETE",
                }
              );
              // Actualizar la lista local
              setMenus(menus.filter((m) => m.id !== menuId));
            } catch (error) {
              console.error("Error al eliminar menú:", error);
            }
          },
        },
      ]
    );
  };
  const handleLogout = () => {
    logout(); // limpia token/contexto
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="power" size={28} color="white" />
      </TouchableOpacity>
      <Text style={styles.tittle}>MENÚS</Text>
      <FlatList
        data={menus}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              height: 60,
              padding: 15,
              marginVertical: 10,
              backgroundColor: "#FFFFFF",
              borderRadius: 8,
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() =>
                router.push(`/(local)/categorias?menuId=${item.id}`)
              }
            >
              <Text style={styles.itemtext}>{item.nombre}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                padding: 5,
                marginLeft: 10,
                backgroundColor: "#ff4d4f",
                borderRadius: 5,
              }}
              onPress={() => handleEliminarMenu(item.id)}
            >
              <Text style={{ color: "white" }}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push(`/(local)/nuevoMenu?localId=${localId}`)}
      >
        <Text style={styles.buttontext}>Crear Menú</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push(`/(local)/puntosImpresion`)}
      >
        <Text style={styles.buttontext}>Puntos de impresion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#50C2C9",
  },
  tittle: {
    paddingTop: 150,
    fontSize: 36,
    color: "#FFFFFF",
    fontWeight: "700",
    marginBottom: 47,
    textAlign: "center",
  },
  itemtext: {
    fontSize: 24,
    fontWeight: 600,
    color: "#000000",
  },
  button: {
    backgroundColor: "#BFEAE4",
    padding: 15,
    borderRadius: 11,
    alignItems: "center",
    marginTop: 20,
    height: 60,
    justifyContent: "center",
    width: "100%",
    marginBottom: 30,
  },
  buttontext: {
    fontSize: 23,
    fontWeight: 600,
    color: "#000000",
  },
  logoutButton: {
    position: "absolute",
    top: 70,
    right: 30,
    zIndex: 1,
  },
});
