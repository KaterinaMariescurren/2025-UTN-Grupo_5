import CardProduct from "@/components/CardProduct";
import CustomButton from "@/components/CustomButton";
import CustomModal from "@/components/CustomModal";
import { Colors } from "@/constants/Colors";
import { GlobalStyles } from "@/constants/GlobalStyles";
import { useAuth } from "@/contexts/authContext";
import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";
import { useApi } from "@/utils/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Plato = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
};

export default function PlatosScreen() {
  const { accessToken } = useAuth();
  const { menuId, categoriaId } = useLocalSearchParams<{
    menuId: string;
    categoriaId: string;
  }>();
  const [platos, setPlatos] = useState<Plato[]>([]);
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [platoBorrar, setPlatoBorrar] = useState<Plato | null>(null);
  const { apiFetch } = useApi();

  useEffect(() => {
    const fetchPlatos = async () => {
      if (!menuId || !categoriaId) return;

      try {
        const res = await apiFetch(
          `${process.env.EXPO_PUBLIC_API_URL}menus/${menuId}/categorias/${categoriaId}/platos`
        );

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.detail || "Error al obtener platos");
        }

        const data: Plato[] = await res.json();
        setPlatos(data);
      } catch (error: any) {
        console.error(error);
        Alert.alert("Error", error.message);
      }
    };

    fetchPlatos();
  }, [accessToken, menuId, categoriaId]);

  const abrirModal = (plato: Plato) => {
    setPlatoBorrar(plato);
    setModalVisible(true);
  }

  const handleEliminarPlato = async () => {
    try {
      await fetch(`${process.env.EXPO_PUBLIC_API_URL}platos/${platoBorrar?.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setPlatos(platos.filter((p) => p.id !== platoBorrar?.id));
    } catch (error) {
      console.error("Error al eliminar plato:", error);
      Alert.alert("Error", "No se pudo eliminar el plato");
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.tittle}>Platos</Text>

      <FlatList
        data={platos}
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
            <CardProduct
              title={item.nombre}
              description={item.descripcion}
              price={item.precio}
            />

            <View style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}>
              <TouchableOpacity
                onPress={() => router.push(`/(local)/editarPlato?menuId=${menuId}&categoriaId=${categoriaId}&platoId=${item.id}`)}
                accessibilityRole="button"
                accessibilityLabel="Editar plato"
                accessibilityHint={"Toca para abrir la opcion para editar el plato" + item.nombre}
              >
                <MaterialIcons name="edit" size={24} color={Colors.text} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => abrirModal(item)}
                accessibilityRole="button"
                accessibilityLabel="Eliminar plato"
                accessibilityHint={"Toca para abrir la opcion para eliminar el plato" + item.nombre}
              >
                <MaterialIcons name="delete" size={24} color={Colors.cta} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <View style={GlobalStyles.containerButton}>
        <CustomButton
          label="Nuevo Plato"
          onPress={() => router.push(`/(local)/nuevoPlato?menuId=${menuId}&categoriaId=${categoriaId}`)}
          type="primary"
          accessibilityHint="Abre la pantalla para crear un nuevo plato"
        />
      </View>
      <CustomModal
        visible={modalVisible}
        nombre={"el plato " + platoBorrar?.nombre}
        onCancel={() => { setModalVisible(false); setPlatoBorrar(null) }}
        onAccept={() => handleEliminarPlato()}
      />
    </View>
  );
}