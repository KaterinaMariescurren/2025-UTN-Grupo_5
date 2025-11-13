import CardButton from "@/components/CardButton";
import CustomButton from "@/components/CustomButton";
import CustomModal from "@/components/CustomModal";
import { Colors } from "@/constants/Colors";
import { GlobalStyles } from "@/constants/GlobalStyles";
import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { useApi } from "@/utils/api";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";

type Categoria = {
  id: number;
  nombre: string;
};

export default function CategoriasScreen() {
  const { menuId, menuName } = useLocalSearchParams<{
    menuId: string;
    menuName: string;
  }>();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoriaBorrar, setCategoriaBorrar] = useState<Categoria | null>(
    null
  );
  const { apiFetch } = useApi();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      if (!menuId) return;

      const fetchCategorias = async () => {
        const res = await apiFetch(
          `${process.env.EXPO_PUBLIC_API_URL}menus/${menuId}/categorias`
        );
        const data = await res.json();
        setCategorias(data);
      };

      fetchCategorias();
    }, [apiFetch, menuId])
  );

  const abrirModal = (categoria: Categoria) => {
    setCategoriaBorrar(categoria);
    setModalVisible(true);
  };

  const handleEliminarCategoria = async () => {
    try {
      await apiFetch(
        `${process.env.EXPO_PUBLIC_API_URL}categorias/${categoriaBorrar?.id}`,
        {
          method: "DELETE",
        }
      );
      // Actualizar la lista local
      setCategorias(categorias.filter((c) => c.id !== categoriaBorrar?.id));
      setModalVisible(false);
      setCategoriaBorrar(null);
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      Alert.alert("Error", "No se pudo eliminar la categoría");
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.tittle}>
        Categorías del {"\n"} Menú {menuName}
      </Text>
      <FlatList
        data={categorias}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 20,
              marginBottom: 10,
            }}
          >
            <CardButton
              name={item.nombre}
              onPress={() =>
                router.push(
                  `/(local)/platos?menuId=${menuId}&categoriaId=${item.id}`
                )
              }
              accessibilityHintText={
                "Toca para ver los diferentes platos de la categoría" +
                item.nombre
              }
            />
            <TouchableOpacity
              onPress={() => abrirModal(item)}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Eliminar categoría"
              accessibilityHint={
                "Toca para abrir la opcion para eliminar la categoría" +
                item.nombre
              }
            >
              <MaterialIcons name="delete" size={24} color={Colors.cta} />
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={GlobalStyles.containerButton}>
        <CustomButton
          label="Nueva Categoría"
          onPress={() =>
            router.push(`/(local)/nuevaCategoria?menuId=${menuId}`)
          }
          type="primary"
          accessibilityHint="Abre la pantalla para crear una nueva categoría"
        />
      </View>
      <CustomModal
        visible={modalVisible}
        nombre={"la categoría " + categoriaBorrar?.nombre}
        onCancel={() => {
          setModalVisible(false);
          setCategoriaBorrar(null);
        }}
        onAccept={() => handleEliminarCategoria()}
      />
    </View>
  );
}
