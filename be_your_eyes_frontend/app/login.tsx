import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { Colors } from "@/constants/Colors";
import { GlobalStyles } from "@/constants/GlobalStyles";
import { useAuth } from "@/contexts/authContext";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login, accessToken } = useAuth();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.replace("/");
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [router])
  );

  useEffect(() => {
    if (accessToken) {
      const checkTipo = async () => {
        try {
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_API_URL}me/tipo`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );

          if (!response.ok) throw new Error("Token inválido");

          const data = await response.json();

          // Redirige según tipo
          switch (data.tipo) {
            case "persona":
              router.replace("/(cliente)/tiporestaurante");
              break;
            case "local":
              router.replace("/(local)");
              break;
            case "admin":
              router.replace("/(admin)");
              break;
            default:
              break;
          }
        } catch (error) {
          console.error("Error verificando token:", error);
          // Si hay un problema, no hace nada (permite ver el login)
        }
      };

      checkTipo();
    }
  }, [accessToken, router]);

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
        body: JSON.stringify({ email, contrasenia: password }),
      });

      if (!response.ok) {
        throw new Error("Credenciales inválidas");
      }
      const data = await response.json();
      await login(data.access_token);
      console.log(data);
      switch (data.tipo) {
        case "persona":
          router.replace("/(cliente)/tiporestaurante");
          break;
        case "local":
          router.replace("/(local)");
          break;
        case "admin":
          router.replace("/(admin)");
          break;
        default:
          break;
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={GlobalStyles.container}
      accessible
      accessibilityLabel="Pantalla de Iniciar sesión"
    >
      <View style={styles.titleContainer} accessible accessibilityRole="header">
        <Text style={styles.titleBig}>Hola,</Text>
        <Text style={styles.titleSmall}>Vamos a iniciar sesión</Text>
      </View>

      <View style={GlobalStyles.containerInputs}>
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

      <View style={GlobalStyles.containerButton}>
        <CustomButton
          label={loading ? "Ingresando..." : "Iniciar Sesión"}
          type="primary"
          onPress={handleLogin}
          accessibilityHint="Abre la pantalla de inicio de sesión"
        />
      </View>

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
    color: Colors.text,
    textAlign: "center",
    marginTop: 4,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
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
