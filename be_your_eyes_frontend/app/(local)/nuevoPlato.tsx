import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { GlobalStyles } from "@/constants/GlobalStyles";
import { useApi } from "@/utils/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View
} from "react-native";

export default function NuevoPlatoScreen() {
  const { apiFetch } = useApi();
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
      const res = await apiFetch(
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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Error al crear el plato");
      }

      router.back(); // vuelve a la pantalla de platos
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={GlobalStyles.container}
      accessibilityLabel="Pantalla de creacion de un nuevo plato"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          style={GlobalStyles.tittle}
          accessibilityElementsHidden={true}
          importantForAccessibility="no"
        >
          Nuevo Plato
        </Text>
        <View style={GlobalStyles.containerInputs}>
          <CustomInput
            label="Nombre del plato"
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ingrese nombre"
            keyboardType="default"
            accessibilityHint="Ingresa el nombre del plato"
          />
          <CustomInput
            label="Descripción del plato"
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Ingrese la descripción"
            keyboardType="default"
            multiline
            minHeight={80}
            accessibilityHint="Ingresa la descripción del plato"
          />
          <CustomInput
            label="Precio del plato"
            value={precio}
            onChangeText={setPrecio}
            placeholder="Ingrese el precio"
            keyboardType="numeric"
            accessibilityHint="Ingresa el precio del plato"
          />
        </View>
        <View style={GlobalStyles.containerButton}>
          <CustomButton
            label="Acceptar"
            onPress={handleCrearPlato}
            type="primary"
            accessibilityHint="Acceptar la creacion del plato"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
