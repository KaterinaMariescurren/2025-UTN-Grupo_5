import CustomButton from "@/components/CustomButton";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RegisterScreen() {
  return (
    <View style={styles.container} accessible accessibilityLabel="Pantalla de Registro de cuenta">

      {/* Títulos */}
      <View style={styles.titleContainer} accessible accessibilityRole="header">
        <Text style={styles.titleBig}>Hola,</Text>
        <Text style={styles.titleSmallBlack}>Gracias por elegir nuestra app {"\n"} Vamos a registrarte</Text>
        <Text style={styles.titleSmall}>Me registro como:</Text>
      </View>

      {/* Botón */}
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

      {/* Registro */}
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
  titleSmallBlack: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
    marginTop: 4,
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
