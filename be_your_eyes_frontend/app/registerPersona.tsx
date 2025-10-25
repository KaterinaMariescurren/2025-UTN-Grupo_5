import { useAuth } from "@/contexts/authContext";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Completa los siguientes {"\n"}campos para poder {"\n"}registrarte como
        cliente{" "}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={contrasenia}
        onChangeText={setContrasenia}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 27,
    fontWeight: "700",
    marginTop: 100,
    marginBottom: 57,
    textAlign: "center",
    color: "#273431",
  },
  input: {
    height: 56,
    padding: 16,
    backgroundColor: "#DCF0F0",
    borderRadius: 8,
    marginBottom: 40,
    fontSize: 16,
    fontWeight: "400",
    color: "#242424",
  },
  button: {
    backgroundColor: "#36D9E3",
    paddingVertical: 20,
    paddingHorizontal: 62,
    marginHorizontal: 64,
    marginTop: 29,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonText: {
    color: "#242424",
    fontSize: 16,
    fontWeight: "500",
  },
});
