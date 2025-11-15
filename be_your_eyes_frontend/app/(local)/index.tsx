import CardButton from "@/components/CardButton";
import CustomButton from "@/components/CustomButton";
import CustomModal from "@/components/CustomModal";
import { Colors } from "@/constants/Colors";
import { GlobalStyles } from "@/constants/GlobalStyles";
import { useAuth } from "@/contexts/authContext";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import { MaterialIcons } from "@expo/vector-icons";
import { useApi } from "@/utils/api";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState, useRef, useEffect } from "react";
import {
  AccessibilityInfo,
  Alert,
  findNodeHandle,
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
  const { accessToken } = useAuth();
  const [localId, setLocalId] = useState<number | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [menuBorrar, setMenuBorrar] = useState<Menu | null>(null);
  const { apiFetch } = useApi();

  const botonesRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (!accessToken) return;

        try {
          // 1️⃣ Obtener localId
          const resLocal = await apiFetch(
            `${process.env.EXPO_PUBLIC_API_URL}me/local_id`
          );
          const dataLocal = await resLocal.json();
          setLocalId(dataLocal.local_id);

          // 2️⃣ Obtener menús
          const resMenus = await apiFetch(
            `${process.env.EXPO_PUBLIC_API_URL}menus/local/${dataLocal.local_id}`
          );
          const dataMenus = await resMenus.json();
          setMenus(dataMenus);
        } catch (error) {
          console.error("Error al obtener datos:", error);
          Alert.alert(
            "Error",
            "No se pudieron obtener los datos. Por favor, logueate nuevamente."
          );
          router.replace("/login");
        }
      };

      fetchData();
    }, [accessToken, apiFetch, router])
  );

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync(true);
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

  const abrirModal = (menu: Menu) => {
    setMenuBorrar(menu);
    setModalVisible(true);
  };

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

    } catch (error) {
    }
  };

  const handleEliminarMenu = async () => {
    try {
      await fetch(`${process.env.EXPO_PUBLIC_API_URL}menus/${menuBorrar?.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      // Actualizar la lista local
      setMenus(menus.filter((m) => m.id !== menuBorrar?.id));
      setModalVisible(false);
      setMenuBorrar(null);
    } catch (error) {
      console.error("Error al eliminar menú:", error);
    }
  };

  const handleSkipList = () => {
    const nodeHandle = findNodeHandle(botonesRef.current);
    if (nodeHandle) {
      setTimeout(() => {
        AccessibilityInfo.setAccessibilityFocus(nodeHandle);
      }, 100);
    }
  };

  return (
    <View
      style={GlobalStyles.container}
      accessibilityLabel="Pantalla de Menús"
    >
      <Text
        style={GlobalStyles.tittle}
        accessibilityElementsHidden={true}
        importantForAccessibility="no"
      >
        Menús
      </Text>
      <TouchableOpacity
        onPress={handleSkipList}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Saltar lista de Menús"
        accessibilityHint="Salta directamente al botón nuevo Menús"
        style={{
          height: 1,
        }}
      >
        <Text>Saltar lista</Text>
      </TouchableOpacity>
      <FlatList
        data={menus}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        accessibilityRole="list"
        accessibilityLabel="Lista de Menús"
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <CardButton
              name={item.nombre}
              onPress={() => router.push(`/(local)/categorias?menuId=${item.id}&menuName=${item.nombre}`)}
              accessibilityHintText={"Toca para ver las categorías del Menú " + item.nombre}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <TouchableOpacity
                accessible
                accessibilityRole="button"
                accessibilityLabel="Descargar menú"
                accessibilityHint="Toca para descargar el menú"
                onPress={() => handleDescargarQR(item.id)}
              >
                <MaterialIcons
                  name="file-download"
                  size={24}
                  color={Colors.text}
                />
              </TouchableOpacity>
              <TouchableOpacity
                accessible
                accessibilityRole="button"
                accessibilityLabel="Eliminar menú"
                accessibilityHint={
                  "Toca para abrir la opcion para eliminar el menú" +
                  item.nombre
                }
                onPress={() => abrirModal(item)}
              >
                <MaterialIcons name="delete" size={24} color={Colors.cta} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <View style={GlobalStyles.containerButton}>
        <CustomButton
          label="Nuevo Menú"
          onPress={() => router.push(`/(local)/nuevoMenu?localId=${localId}`)}
          type="primary"
          accessibilityHint="Abre la pantalla para crear un nuevo menú"
          ref={botonesRef}
        />
        <CustomButton
          label="Centros de impresion"
          onPress={() => router.push(`/(local)/puntosImpresion`)}
          type="secondary"
          accessibilityHint="Abre la pantalla para buscar los centros de impresion"
        />
      </View>
      <CustomModal
        visible={modalVisible}
        nombre={"el menú " + menuBorrar?.nombre}
        onCancel={() => {
          setModalVisible(false);
          setMenuBorrar(null);
        }}
        onAccept={() => handleEliminarMenu()}
      />
    </View >
  );
}

const styles = StyleSheet.create({
  itemtext: {
    fontSize: 24,
    fontWeight: 600,
    color: "#000000",
  },
});
