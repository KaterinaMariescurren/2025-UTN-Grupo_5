import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Bienvenido.{"\n"}Gracias por elegir nuestra app.{"\n"}Vamos a Registrarte:
      </Text>

      <Text style={styles.subtitle}>Me registro como:</Text>

      <TouchableOpacity style={styles.button} onPress={() => {router.push("/registerPersona")}}>
        <Text style={styles.buttonText}>Cliente</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => {router.push("/registerLocal")}}>
        <Text style={styles.buttonText}>Local</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFFFFF" },
  title: { fontSize: 24, marginBottom: 32, color: "#273431", fontWeight: 700, marginTop: 150 },
  subtitle: { fontSize: 32, fontWeight: 700, color: "#03A8B2", marginBottom: 65,  },
  button: { backgroundColor: "#BFEAE4", padding: 15, borderRadius: 8, marginBottom: 76, alignItems: "center", height: 60, justifyContent: "center", },
  buttonText: { color: "#0E0202", fontWeight: 600, fontSize: 25 },
});
