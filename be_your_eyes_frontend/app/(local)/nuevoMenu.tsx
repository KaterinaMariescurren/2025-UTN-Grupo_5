import { useAuth } from "@/contexts/authContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function NuevoMenuScreen() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const { localId } = useLocalSearchParams<{ localId: string }>(); // obtener localId desde la URL
  const [nombre, setNombre] = useState("");

  const handleCrearMenu = async () => {
    if (!nombre.trim()) {
      Alert.alert("Error", "El nombre del menú no puede estar vacío");
      return;
    }

    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}menus/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          local_id: Number(localId),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Error al crear el menú");
      }

      Alert.alert("Éxito", "Menú creado correctamente");
      router.back(); // volver a la pantalla de menus
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
        Nuevo Menú
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
        onPress={handleCrearMenu}
      >
        <Text
          style={{
            fontSize: 23,
            fontWeight: 600,
            color: "#000000",
          }}
        >
          Crear Menú
        </Text>
      </TouchableOpacity>
    </View>
  );
}
