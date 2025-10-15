import { useAuth } from "@/contexts/authContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function NuevoPlatoScreen() {
  const { accessToken } = useAuth();
  const { menuId, categoriaId } = useLocalSearchParams<{
    menuId: string;
    categoriaId: string;
  }>();
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");

  const handleCrearPlato = async () => {
    if (!nombre.trim() || !precio.trim()) {
      Alert.alert("Error", "Nombre y precio son obligatorios");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}menus/${menuId}/categorias/${categoriaId}/platos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre,
            descripcion,
            precio: parseFloat(precio),
          }),
        }
      );

      if (res.status === 401) {
        router.replace("/login");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Error al crear el plato");
      }

      Alert.alert("Éxito", "Plato creado correctamente");
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
        Nuevo Plato
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
          marginVertical: 30,
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
          marginVertical: 30,
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
        onPress={handleCrearPlato}
      >
        <Text
          style={{
            fontSize: 23,
            fontWeight: 600,
            color: "#000000",
          }}
        >
          Crear Plato
        </Text>
      </TouchableOpacity>
    </View>
  );
}
