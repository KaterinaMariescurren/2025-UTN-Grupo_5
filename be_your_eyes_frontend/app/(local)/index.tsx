import CardButton from "@/components/CardButton";
import CustomButton from "@/components/CustomButton";
import CustomModal from "@/components/CustomModal";
import { Colors } from "@/constants/Colors";
import { GlobalStyles } from "@/constants/GlobalStyles";
import { useAuth } from "@/contexts/authContext";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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
  const { accessToken } = useAuth();
  const [localId, setLocalId] = useState<number | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [menuBorrar, setMenuBorrar] = useState<Menu | null>(null);

  useEffect(() => {
    const fetchLocalId = async () => {
      try {
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}me/local_id`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res.status === 401) {
          // Token inválido, redirigir al login
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
    const fetchMenus = async () => {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}menus/local/${localId}`,
        {}
      );
      const data = await res.json();
      setMenus(data);
    };
    fetchMenus();
  }, [accessToken, localId]);

  const abrirModal = (menu: Menu) => {
    setMenuBorrar(menu);
    setModalVisible(true);
  }

  const handleEliminarMenu = async () => {
    try {
      await fetch(`${process.env.EXPO_PUBLIC_API_URL}menus/${menuBorrar?.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      // Actualizar la lista local
      setMenus(menus.filter((m) => m.id !== menuBorrar?.id));
    } catch (error) {
      console.error("Error al eliminar menú:", error);
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.tittle}>Menús</Text>
      <FlatList
        data={menus}
        keyExtractor={(item) => item.id.toString()}
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
              accessibilityHintText={"Toca para ver las categorías del menu "+ item.nombre}
            />
            <View style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}>
              <TouchableOpacity
                accessible
                accessibilityRole="button"
                accessibilityLabel="Descargar menú"
                accessibilityHint="Toca para descargar el menú"
              >
                <MaterialIcons name="file-download" size={24} color={Colors.text} />
              </TouchableOpacity>
              <TouchableOpacity
                accessible
                accessibilityRole="button"
                accessibilityLabel="Eliminar menú"
                accessibilityHint={"Toca para abrir la opcion para eliminar el menú" + item.nombre}
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
        onCancel={() => { setModalVisible(false); setMenuBorrar(null) }}
        onAccept={() => handleEliminarMenu()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  itemtext: {
    fontSize: 24,
    fontWeight: 600,
    color: "#000000",
  },
});
