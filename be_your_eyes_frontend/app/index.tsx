import CustomButton from "@/components/CustomButton";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container} accessible accessibilityLabel="Pantalla de bienvenida">
      <Image
        source={require("@/assets/images/logo.png")}
        style={styles.logo}
        accessible
        accessibilityLabel="Logo de Be your eyes"
      />

      {/* Título dividido en dos partes */}
      <View
        style={styles.titleContainer}
        accessible
        accessibilityLabel="Bienvenido a Be your eyes"
      >
        <Text style={styles.welcomeText} accessible={false}>
          Bienvenido a
        </Text>
        <Text style={styles.appName} accessible={false}>
          Be your eyes
        </Text>
      </View>

      {/* Botones centrados uno debajo del otro */}
      <View style={styles.buttonContainer}>
        <CustomButton
          label="Iniciar sesión"
          type="primary"
          onPress={() => router.push("/login")}
          accessibilityHint="Abre la pantalla de inicio de sesión"
        />

        <CustomButton
          label="Registrarse"
          type="secondary"
          onPress={() => router.push("/register")}
          accessibilityHint="Abre la pantalla de registro de usuario"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  logo: {
    height: 250,
    width: 250,
    marginTop: "10%",
    marginBottom: 46,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 47,
  },
  welcomeText: {
    fontSize: 40, // más grande que antes
    fontWeight: "700",
    color: "#000000",
  },
  appName: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.primary, // color principal
  },
  buttonContainer: {
    width: "80%",
    alignItems: "center",
  },
});
