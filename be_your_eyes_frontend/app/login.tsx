import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Credenciales inválidas");

      const data = await response.json();
      if (data.tipo === "persona") {
        router.replace("/(cliente)/tiporestaurante");
        return;
      }

      await login(data.access_token);

      router.replace("/(local)");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container} accessible accessibilityLabel="Pantalla de Iniciar sesión">

      {/* Títulos */}
      <View style={styles.titleContainer} accessible accessibilityRole="header">
        <Text style={styles.titleBig}>Hola,</Text>
        <Text style={styles.titleSmall}>Vamos a iniciar sesión</Text>
      </View>

      {/* Inputs */}
      <View style={styles.inputsContainer}>
        <CustomInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          accessibilityHint="Ingresa tu correo electrónico"
        />
        <CustomInput
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          placeholder="Contraseña"
          keyboardType="default"
          secureTextEntry={!showPassword}
          rightIconName={showPassword ? "visibility" : "visibility-off"}
          rightIconAccessibilityLabel={
            showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
          }
          rightIconAccessibilityHint="Toca para alternar la visibilidad de la contraseña"
          onRightIconPress={() => setShowPassword(!showPassword)}
        />
      </View>

      {/* Botón */}
      <CustomButton
        label={loading ? "Ingresando..." : "Iniciar Sesión"}
        type="primary"
        onPress={handleLogin}
        accessibilityHint="Abre la pantalla de inicio de sesión"
      />

      {/* Registro */}
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>¿No tenés cuenta? </Text>
        <TouchableOpacity
          onPress={() => router.push("/register")}
          accessibilityRole="link"
          accessibilityLabel="Registrate"
          accessibilityHint="Toca para ir a la pantalla de registro"
        >
          <Text style={styles.registerLink}>Registrate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 50,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  titleBig: {
    fontSize: 40,
    fontWeight: "700",
    color: "#273431",
    textAlign: "center",
  },
  titleSmall: {
    fontSize: 32,
    fontWeight: "400",
    color: Colors.primary,
    textAlign: "center",
    marginTop: 4,
  },
  inputsContainer: {
    width: "100%",
    marginTop: 45,
    marginBottom: 45,
  },
  registerContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  registerText: {
    fontSize: 16,
    color: Colors.text,
  },
  registerLink: {
    fontSize: 16,
    color: Colors.cta,
    textDecorationLine: "underline",
  },
});
