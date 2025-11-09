import { useAuth } from "@/contexts/authContext";
import { useApi } from "@/utils/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function NuevaCategoriaScreen() {
  const { apiFetch } = useApi();
  const router = useRouter();
  const { menuId } = useLocalSearchParams<{ menuId: string }>(); // obtener menuId desde la URL

  const [nombre, setNombre] = useState("");

  const handleCrearCategoria = async () => {
    if (!nombre.trim()) {
      Alert.alert("Error", "El nombre de la categoría no puede estar vacío");
      return;
    }

    try {
      const res = await apiFetch(
        `${process.env.EXPO_PUBLIC_API_URL}menus/${menuId}/categorias/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nombre }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Error al crear la categoría");
      }

      Alert.alert("Éxito", data.mensaje || "Categoría creada correctamente");
      router.back(); // volver a la pantalla de categorías
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
        Nueva Categoría
      </Text>

      <TextInput
        value={nombre}
        onChangeText={setNombre}
        placeholder="Ingrese nombre"
        placeholderTextColor={"#273431"}
        style={{
          backgroundColor: "#FFFFFF",
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 15,
          borderRadius: 11,
          marginVertical: 30,
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
        onPress={handleCrearCategoria}
      >
        <Text style={{ color: "#000000", fontWeight: "600", fontSize: 23 }}>
          Crear Categoría
        </Text>
      </TouchableOpacity>
    </View>
  );
}
