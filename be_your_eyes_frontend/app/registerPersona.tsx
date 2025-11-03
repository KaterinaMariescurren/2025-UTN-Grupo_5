import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { Colors } from "@/constants/Colors";
import { GlobalStyles } from "@/constants/GlobalStyles";
import { useAuth } from "@/contexts/authContext";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

export default function RegisterPersonaScreen() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

  const handleRegister = async () => {
    if (!nombre || !email || !contrasenia) {
      Alert.alert("Error", "Por favor, complete todos los campos.");
      return;
    }
    try {
      setLoading(true);
      const body = {
        email,
        contrasenia,
        tipo: "persona",
        persona: {
          nombre,
          tipo: "usuario",
        },
      };
      console.log("Cuerpo de la solicitud de registro:", body);
      const response = await fetch(`${BACKEND_URL}register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al registrar el usuario.");
      }
      const data = await response.json();
      await login(email, contrasenia);
      router.replace("/(cliente)/tiporestaurante");
    } catch (error: any) {
      console.error("Error en el registro:", error);
      Alert.alert("Error", error.message || "Error al registrar el usuario.");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <View
        style={styles.loadingContainer}
        accessible
        accessibilityRole="alert"
        accessibilityLabel="Cargando. Por favor espera."
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={GlobalStyles.container}
      accessible
      accessibilityLabel="Pantalla de registro de cliente"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          accessible
          accessibilityRole="header"
          accessibilityLabel="Completa los siguientes campos para registrarte como cliente."
        >
          <Text style={GlobalStyles.tittle}>Completa los siguientes {"\n"}campos para poder {"\n"}registrarte como cliente{" "}</Text>
        </View>
        <View
          style={GlobalStyles.containerInputs}
          accessible
          accessibilityLabel="Formulario de registro de cliente. Contiene tres campos: nombre, email y contraseña."
        >
          <CustomInput
            label="Nombre"
            value={nombre}
            onChangeText={(text) => setNombre(text)}
            placeholder="Nombre"
            keyboardType="default"
            accessibilityHint="Ingresa tu nombre"
          />
          <CustomInput
            label="Email"
            value={email}
            onChangeText={(email) => setEmail(email)}
            placeholder="Email"
            keyboardType="email-address"
            accessibilityHint="Ingresa tu email"
          />
          <CustomInput
            label="Contraseña"
            value={contrasenia}
            onChangeText={setContrasenia}
            placeholder="Contraseña"
            keyboardType="default"
            secureTextEntry={!showPassword}
            accessibilityHint="Ingresa la contraseña"
            rightIconName={showPassword ? "visibility" : "visibility-off"}
            rightIconAccessibilityLabel={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
            rightIconAccessibilityHint="Toca para alternar la visibilidad de la contraseña"
            onRightIconPress={() => setShowPassword(!showPassword)}
          />
        </View>
        <View style={GlobalStyles.containerButton}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Botón para registrarte como cliente"
          accessibilityHint="Toca para enviar el formulario de registro"
        >
          <CustomButton
            label="Registrarse"
            onPress={handleRegister}
            type="primary"
            accessibilityHint="Registrarse como cliente"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  }
});
