import { useAuth } from "@/contexts/authContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function EditarPlatoScreen() {
  const { accessToken } = useAuth();
  const { menuId, categoriaId, platoId } = useLocalSearchParams<{
    menuId: string;
    categoriaId: string;
    platoId: string;
  }>();
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");

  // Cargar los datos del plato al montar
  useEffect(() => {
    const fetchPlato = async () => {
      if (!platoId) return;

      try {
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}platos/${platoId}`, {
          headers: {          },
        });

        if (res.status === 401) {
          router.replace("/login");
          return;
        }

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.detail || "Error al obtener plato");
        }

        const data = await res.json();
        setNombre(data.nombre);
        setDescripcion(data.descripcion || "");
        setPrecio(data.precio.toString());
      } catch (error: any) {
        console.error(error);
        Alert.alert("Error", error.message);
      }
    };

    fetchPlato();
  }, [platoId, accessToken]);

  const handleEditarPlato = async () => {
    if (!nombre.trim() || !precio.trim()) {
      Alert.alert("Error", "Nombre y precio son obligatorios");
      return;
    }

    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}platos/${platoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          nombre,
          descripcion,
          precio: parseFloat(precio),
        }),
      });

      if (res.status === 401) {
        router.replace("/login");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Error al actualizar el plato");
      }

      Alert.alert("Éxito", "Plato actualizado correctamente");
      router.back(); // vuelve a la pantalla de platos
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        justifyContent: "center",
        backgroundColor: "#50C2C9",
      }}
    >
      <Text
        style={{
          fontSize: 36,
          color: "#FFFFFF",
          fontWeight: "bold",
          marginBottom: 30,
          textAlign: "center",
        }}
      >
        Editar Plato
      </Text>

      <TextInput
        value={nombre}
        onChangeText={setNombre}
        placeholder="Nombre del plato"
        placeholderTextColor={"#273431"}
        style={{
          backgroundColor: "#FFFFFF",
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 15,
          borderRadius: 11,
          marginVertical: 15,
          height: 60,
          fontSize: 16,
        }}
      />

      <TextInput
        value={descripcion}
        onChangeText={setDescripcion}
        placeholder="Descripción"
        placeholderTextColor={"#273431"}
        style={{
          backgroundColor: "#FFFFFF",
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 15,
          borderRadius: 11,
          marginVertical: 15,
          height: 60,
          fontSize: 16,
        }}
      />

      <TextInput
        value={precio}
        onChangeText={setPrecio}
        placeholder="Precio"
        keyboardType="numeric"
        placeholderTextColor={"#273431"}
        style={{
          backgroundColor: "#FFFFFF",
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 15,
          borderRadius: 11,
          marginVertical: 15,
          height: 60,
          fontSize: 16,
        }}
      />

      <TouchableOpacity
        style={{
          backgroundColor: "#BFEAE4",
          padding: 15,
          borderRadius: 11,
          alignItems: "center",
          marginTop: 20,
          height: 60,
          justifyContent: "center",
          width: "100%",
          marginBottom: 30,
        }}
        onPress={handleEditarPlato}
      >
        <Text
          style={{
            fontSize: 23,
            fontWeight: 600,
            color: "#000000",
          }}
        >
          Editar Plato
        </Text>
      </TouchableOpacity>
    </View>
  );
}
