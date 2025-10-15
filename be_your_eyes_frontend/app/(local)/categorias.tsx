import { useAuth } from "@/contexts/authContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

type Categoria = {
  id: number;
  nombre: string;
};

export default function CategoriasScreen() {
  const { menuId } = useLocalSearchParams<{ menuId: string }>();
  const { accessToken } = useAuth();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!menuId) return;
    const fetchCategorias = async () => {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}menus/${menuId}/categorias`
      );
      const data = await res.json();
      setCategorias(data);
    };
    fetchCategorias();
  }, [menuId]);

  const handleEliminarCategoria = (categoriaId: number) => {
    Alert.alert(
      "Eliminar Categoría",
      "¿Estás seguro de que quieres eliminar esta categoría?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}categorias/${categoriaId}`,
                {
                  method: "DELETE",
                }
              );
              // Actualizar la lista local
              setCategorias(categorias.filter((c) => c.id !== categoriaId));
            } catch (error) {
              console.error("Error al eliminar categoría:", error);
              Alert.alert("Error", "No se pudo eliminar la categoría");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.tittle}>Categorías</Text>
      <FlatList
        data={categorias}
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
                router.push(
                  `/(local)/platos?menuId=${menuId}&categoriaId=${item.id}`
                )
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
              onPress={() => handleEliminarCategoria(item.id)}
            >
              <Text style={{ color: "white" }}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push(`/(local)/nuevaCategoria?menuId=${menuId}`)}
      >
        <Text style={styles.buttontext}>Crear Categoría</Text>
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
  itemtext:{
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
});
