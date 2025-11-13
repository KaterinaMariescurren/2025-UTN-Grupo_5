import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { GlobalStyles } from "@/constants/GlobalStyles";
import { useAuth } from "@/contexts/authContext";
import { useApi } from "@/utils/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function EditarPlatoScreen() {
  const { accessToken } = useAuth();
  const { platoId } = useLocalSearchParams<{
    menuId: string;
    categoriaId: string;
    platoId: string;
  }>();
  const router = useRouter();
  const { apiFetch } = useApi();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");

  // Cargar los datos del plato al montar
  useEffect(() => {
    const fetchPlato = async () => {
      if (!platoId) return;

      try {
        const res = await apiFetch(`${process.env.EXPO_PUBLIC_API_URL}platos/${platoId}`);

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
      const res = await apiFetch(`${process.env.EXPO_PUBLIC_API_URL}platos/${platoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          descripcion,
          precio: parseFloat(precio),
        }),
      });

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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={GlobalStyles.container}
      accessibilityLabel="Pantalla de edicion de un plato"
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
          Editar Plato
        </Text>
        <View style={GlobalStyles.containerInputs}>
          <CustomInput
            label="Nombre del plato"
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ingrese nombre"
            keyboardType="default"
            accessibilityHint="Edita el nombre del plato"
          />
          <CustomInput
            label="Descripción del plato"
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Ingrese la descripción"
            keyboardType="default"
            accessibilityHint="Edita la descripción del plato"
          />
          <CustomInput
            label="Precio del plato"
            value={precio}
            onChangeText={setPrecio}
            placeholder="Ingrese el precio"
            keyboardType="numeric"
            accessibilityHint="Edita el precio del plato"
          />
        </View>
        <View style={GlobalStyles.containerButton}>
          <CustomButton
            label="Acceptar"
            onPress={handleEditarPlato}
            type="primary"
            accessibilityHint="Acceptar la edicion del plato"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
