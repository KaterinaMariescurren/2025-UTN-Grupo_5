import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require("@/assets/images/logo.png")} style={styles.logo} />
      <Text style={styles.title}>Bienvenido a{"\n"}Be your eyes</Text>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push("/login")}
      >
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.secondaryButton]} 
        onPress={() => router.push("/register")}
      >
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: "center", 
    backgroundColor: "#FFFFFF" 
},
  logo: { 
    height: 250,
    width: 250,
    marginTop: 100,
    marginBottom: 46
},
  title: { 
    fontSize: 36, 
    fontWeight: 700, 
    marginBottom: 47, 
    textAlign: "center", 
    color: "#50C2C9" 
},
  button: { 
    backgroundColor: "#BFEAE4", 
    padding: 15, 
    borderRadius: 11, 
    width: "80%", 
    height: 60,
    alignItems: "center",
    marginBottom: 30,
},
  secondaryButton: {  
    backgroundColor: "#BFEAE4", 
    padding: 15, 
    borderRadius: 11, 
    width: "80%", 
    height: 60,
    alignItems: "center",
    marginBottom: 30
},
  buttonText: { 
    color: "#000000", 
    fontWeight: 600, 
    fontSize: 23 
},
});
