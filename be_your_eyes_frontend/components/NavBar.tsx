import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface NavbarProps {
    onBack: () => void;
    onProfile: () => void;
}

export default function Navbar({ onBack, onProfile }: NavbarProps) {
    return (
        <View
            style={styles.container}
            accessible
            accessibilityRole="header"
            accessibilityLabel="Barra de navegación superior"
        >
            <TouchableOpacity
                onPress={onBack}
                accessibilityRole="button"
                accessibilityLabel="Volver atrás"
                accessibilityHint="Vuelve a la pantalla anterior"
            >
                <Ionicons name="arrow-back" size={24} color={Colors.text} />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={onProfile}
                accessibilityRole="button"
                accessibilityLabel="Perfil de usuario"
                accessibilityHint="Abre la sección de tu perfil"
            >
                <Ionicons name="person-circle-outline" size={28} color={Colors.text} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
});
