import CustomButton from "@/components/CustomButton";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function GoodbyeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lamentamos verte ir.</Text>
      <Text style={styles.message}>
        Queremos agradecerte por haber sido parte de nuestra comunidad.{"\n\n"}
        Tu contribución ha sido valiosa para nosotros.{"\n\n"}
        Esperamos haberte brindado un buen servicio y, si en el futuro decides regresar, estaremos aquí para ayudarte con todo lo que necesites.{"\n\n"}
        ¡Gracias y hasta pronto!
      </Text>

      <CustomButton
        label="Volver al inicio"
        onPress={() => router.replace("/login")}
        type="primary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.cta,
    marginBottom: 20,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: Colors.text,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
  },
});
