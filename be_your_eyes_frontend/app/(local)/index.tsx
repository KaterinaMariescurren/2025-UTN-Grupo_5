import { useAuth } from "@/contexts/authContext";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
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

  // 🔐 Permisos de galería
  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso requerido",
          "Necesitás otorgar permiso para guardar imágenes en la galería."
        );
      } else {
        console.log("✅ Permiso concedido para MediaLibrary");
      }
    })();
  }, []);

  // 🏪 Obtener ID del local
  useEffect(() => {
    const fetchLocalId = async () => {
      try {
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}me/local_id`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res.status === 401) {
          router.replace("/login");
          return;
        }

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
  }, [accessToken, router]);

  // 📋 Obtener menús del local
  useEffect(() => {
    if (!localId) return;
    const fetchMenus = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}menus/local/${localId}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const data = await res.json();
        setMenus(data);
      } catch (error) {
        console.error("Error al obtener menus:", error);
      }
    };
    fetchMenus();
  }, [accessToken, localId]);

  // 🗑️ Eliminar menú
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
              await fetch(`${process.env.EXPO_PUBLIC_API_URL}menus/${menuId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${accessToken}` },
              });
              setMenus(menus.filter((m) => m.id !== menuId));
            } catch (error) {
              console.error("Error al eliminar menú:", error);
            }
          },
        },
      ]
    );
  };

  // 📲 Descargar QR del menú
  const handleDescargarQR = async (menuId: number) => {
    try {
      const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;
      const qrUrl = `${BACKEND_URL}qr/menu/${menuId}?download=true`;
      const localPath =
        (FileSystem as any).documentDirectory + `menu_${menuId}_qr.png`;

      console.log("🔗 Descargando QR:", qrUrl);
      const { uri, status } = await FileSystem.downloadAsync(qrUrl, localPath);

      if (status !== 200) {
        Alert.alert("Error", `No se pudo descargar el QR (status ${status})`);
        return;
      }

      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        Alert.alert("Error", "El archivo descargado no existe.");
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("BeYourEyes_QR", asset, false);

      Alert.alert("Listo ✅", "El QR del menú fue guardado en tu galería.");
    } catch (error) {
      console.error("❌ Error al descargar QR:", error);
      Alert.alert("Error", "No se pudo guardar el QR.");
    }
  };

  // 🔓 Cerrar sesión
  const handleLogout = () => {
    logout();
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
          <View style={styles.menuItem}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() =>
                router.push(`/(local)/categorias?menuId=${item.id}`)
              }
            >
              <Text style={styles.itemtext}>{item.nombre}</Text>
            </TouchableOpacity>

            {/* 🟢 Botón QR */}
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#4CAF50" }]}
              onPress={() => handleDescargarQR(item.id)}
            >
              <Text style={styles.actionText}>QR</Text>
            </TouchableOpacity>

            {/* 🔴 Botón Eliminar */}
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#ff4d4f" }]}
              onPress={() => handleEliminarMenu(item.id)}
            >
              <Text style={styles.actionText}>Eliminar</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#50C2C9" },
  tittle: {
    paddingTop: 150,
    fontSize: 36,
    color: "#FFFFFF",
    fontWeight: "700",
    marginBottom: 47,
    textAlign: "center",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
  },
  itemtext: { fontSize: 24, fontWeight: "600", color: "#000000" },
  actionButton: {
    padding: 5,
    marginLeft: 10,
    borderRadius: 5,
    width: 80,
    alignItems: "center",
  },
  actionText: { color: "white", fontWeight: "500" },
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
  buttontext: { fontSize: 23, fontWeight: "600", color: "#000000" },
  logoutButton: { position: "absolute", top: 70, right: 30, zIndex: 1 },
});
