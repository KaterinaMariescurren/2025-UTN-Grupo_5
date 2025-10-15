import { useAuth } from "@/contexts/authContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Plato = {
  id: number;
  nombre: string;
  descripcion?: string;
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

  useEffect(() => {
    const fetchPlatos = async () => {
      if (!menuId || !categoriaId) return;

      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}menus/${menuId}/categorias/${categoriaId}/platos`
        );

        if (res.status === 401) {
          router.replace("/login"); // token inválido
          return;
        }

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

  const handleEliminarPlato = (platoId: number) => {
    Alert.alert(
      "Eliminar Plato",
      "¿Estás seguro de que quieres eliminar este plato?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await fetch(`${process.env.EXPO_PUBLIC_API_URL}platos/${platoId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${accessToken}` },
              });
              setPlatos(platos.filter((p) => p.id !== platoId));
            } catch (error) {
              console.error("Error al eliminar plato:", error);
              Alert.alert("Error", "No se pudo eliminar el plato");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.tittle}>Platos</Text>

      <FlatList
        data={platos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              height: 90,
              padding: 15,
              marginVertical: 10,
              backgroundColor: "#FFFFFF",
              borderRadius: 8,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                {item.nombre}
              </Text>
              {item.descripcion && <Text>{item.descripcion}</Text>}
              <Text style={{ marginTop: 5, fontWeight: "600" }}>
                ${item.precio}
              </Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{
                  padding: 5,
                  marginLeft: 10,
                  backgroundColor: "#4caf50",
                  borderRadius: 5,
                }}
                onPress={() =>
                  router.push(
                    `/(local)/editarPlato?menuId=${menuId}&categoriaId=${categoriaId}&platoId=${item.id}`
                  )
                }
              >
                <Text style={{ color: "white" }}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  padding: 5,
                  marginLeft: 10,
                  backgroundColor: "#ff4d4f",
                  borderRadius: 5,
                }}
                onPress={() => handleEliminarPlato(item.id)}
              >
                <Text style={{ color: "white" }}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          router.push(
            `/(local)/nuevoPlato?menuId=${menuId}&categoriaId=${categoriaId}`
          )
        }
      >
        <Text style={styles.buttontext}>Agregar Plato</Text>
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
