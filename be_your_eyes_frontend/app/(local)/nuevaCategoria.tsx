import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { GlobalStyles } from "@/constants/GlobalStyles";
import { useAuth } from "@/contexts/authContext";
import { useApi } from "@/utils/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";

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

      router.back(); // volver a la pantalla de categorías
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={GlobalStyles.container}
      accessibilityLabel="Pantalla de creacion de una nueva Categoría"
    >
      <Text
        style={GlobalStyles.tittle}
        accessibilityElementsHidden={true}
        importantForAccessibility="no"
      >
        Nueva Categoría
      </Text>

      <CustomInput
        label="Nombre de la categoría"
        value={nombre}
        onChangeText={setNombre}
        placeholder="Ingrese nombre"
        keyboardType="default"
        accessibilityHint="Ingresa el nombre de la categoría"
      />
      <View style={GlobalStyles.containerButton}>
        <CustomButton
          label="Acceptar"
          onPress={handleCrearCategoria}
          type="primary"
          accessibilityHint="Acceptar la creacion de la categoria"
        />
      </View>
    </KeyboardAvoidingView>
  );
}
