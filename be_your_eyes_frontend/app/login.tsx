import { useAuth } from "@/contexts/authContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !contrasenia) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    try {
      setLoading(true);

      // 🚀 Cambia esta URL por la de tu backend
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contrasenia }),
      });

      if (!response.ok) {
        throw new Error("Credenciales inválidas");
      }

      const data = await response.json();

      // Suponiendo que tu backend devuelve { token: "...", user: {...} }
      await login(data.access_token);

      router.replace("/(local)"); // navega a home o la pantalla principal
    } catch (error: any) {
      Alert.alert("Error", error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hola,{"\n"}Vamos a Iniciar Sesión</Text>

      <View style={styles.inputContainer}>
        <MaterialIcons
          name="email"
          size={24}
          color="#273431"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Correo"
          placeholderTextColor="#273431" // Color del placeholder
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      {/* Contraseña input con icono */}
      <View style={styles.inputContainer}>
        <MaterialIcons
          name="lock"
          size={24}
          color="#273431"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#273431"
          secureTextEntry
          value={contrasenia}
          onChangeText={setContrasenia}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Ingresando..." : "Iniciar Sesión"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 49,
    color: "#273431",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#BFEAE4",
    borderWidth: 1,
    borderColor: "#BDC3C7",
    borderRadius: 8,
    marginBottom: 34,
    height: 60,
  },
  icon: {
    padding: 10,
  },

  input: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    color: "#273431",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#BFEAE4",
    padding: 15,
    borderRadius: 8,
    height: 60,
    alignItems: "center",
    marginTop: 60,
  },
  buttonText: {
    color: "#230808",
    fontWeight: 600,
    fontSize: 23,
  },
});
