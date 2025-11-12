import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { GlobalStyles } from "@/constants/GlobalStyles";
import { useAuth } from "@/contexts/authContext";
import { useApi } from "@/utils/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";

export default function NuevoMenuScreen() {
  const { apiFetch } = useApi();
  const router = useRouter();
  const { localId } = useLocalSearchParams<{ localId: string }>(); // obtener localId desde la URL
  const [nombre, setNombre] = useState("");

  const handleCrearMenu = async () => {
    if (!nombre.trim()) {
      Alert.alert("Error", "El nombre del menú no puede estar vacío");
      return;
    }

    try {
      const res = await apiFetch(`${process.env.EXPO_PUBLIC_API_URL}menus/`, {
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={GlobalStyles.container}
    >
      <Text style={GlobalStyles.tittle}>Nuevo Menú</Text>

      <CustomInput
        label="Nombre del menú"
        value={nombre}
        onChangeText={setNombre}
        placeholder="Ingrese nombre"
        keyboardType="default"
        accessibilityHint="Ingresa el nombre del menú"
      />

      <View style={GlobalStyles.containerButton}>
        <CustomButton
          label="Aceptar"
          onPress={handleCrearMenu}
          type="primary"
          accessibilityHint="Aceptar la creación del menú"
        />
      </View>
    </KeyboardAvoidingView>
  );

}
