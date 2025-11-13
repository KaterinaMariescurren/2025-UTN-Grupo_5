import CustomButton from "@/components/CustomButton";
import { Colors } from "@/constants/Colors";
import { GlobalStyles } from "@/constants/GlobalStyles";
import { useAuth } from "@/contexts/authContext";
import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RegisterScreen() {
  const { accessToken } = useAuth();
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
    }, [accessToken]);
    
  return (
    <View style={GlobalStyles.container} accessible accessibilityLabel="Pantalla de Registro de cuenta">

      <View style={styles.titleContainer} accessible accessibilityRole="header">
        <Text style={styles.titleBig}>Hola,</Text>
        <Text style={styles.titleSmallBlack}>Gracias por elegir nuestra app {"\n"} Vamos a registrarte</Text>
        <Text style={styles.titleSmall}>Me registro como:</Text>
      </View>
      <View style={GlobalStyles.containerButton}>
        <CustomButton
          label={"Cliente"}
          type="primary"
          onPress={() => router.push("/registerPersona")}
          accessibilityHint="Registrate como Cliente"
        />
        <CustomButton
          label={"Local"}
          type="secondary"
          onPress={() => router.push("/registerLocal")}
          accessibilityHint="Registrate como Local"
        />
      </View>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>¿Ya tenés cuenta? </Text>
        <TouchableOpacity
          onPress={() => router.push("/login")}
          accessibilityRole="link"
          accessibilityLabel="Iniciar sesión"
          accessibilityHint="Toca para ir a la pantalla de Iniciar sesión"
        >
          <Text style={styles.registerLink}>Iniciar sesión</Text>
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
  titleSmallBlack: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
    marginTop: 4,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent:"center",
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
