// components/Navbar.tsx
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface NavbarProps {
  onBack: () => void;
  onProfile?: () => void;
  onLogout?: () => void;
  showProfile?: boolean;
  showLogout?: boolean;
}

export default function Navbar({
  onBack,
  onProfile,
  onLogout,
  showProfile = false,
  showLogout = false,
}: NavbarProps) {
  return (
    <View
      style={styles.container}
      accessible
      accessibilityRole="header"
      accessibilityLabel="Barra de navegación superior"
    >
      {/* Botón Back */}
      <TouchableOpacity
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Volver atrás"
        accessibilityHint="Vuelve a la pantalla anterior"
      >
        <Ionicons name="arrow-back" size={24} color={Colors.text} />
      </TouchableOpacity>

      <View style={styles.rightIcons}>
        {/* Botón Perfil */}
        {showProfile && (
          <TouchableOpacity
            onPress={onProfile}
            accessibilityRole="button"
            accessibilityLabel="Perfil de usuario"
            accessibilityHint="Abre la sección de tu perfil"
          >
            <Ionicons
              name="person-circle-outline"
              size={28}
              color={Colors.text}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}

        {/* Botón Logout */}
        {showLogout && (
          <TouchableOpacity
            onPress={onLogout}
            accessibilityRole="button"
            accessibilityLabel="Cerrar sesión"
            accessibilityHint="Cierra tu sesión actual"
          >
            <Ionicons
              name="log-out-outline"
              size={26}
              color={Colors.text}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.background,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 18,
  },
});
