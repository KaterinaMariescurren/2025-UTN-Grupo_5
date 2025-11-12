import React from "react";
import { View, TextInput, StyleSheet, DimensionValue } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void; 
  placeholder?: string;
  accessibilityLabel?: string;
}

export default function Buscardor({
  value,
  onChangeText,
  placeholder = "Buscar...",
  accessibilityLabel = "Barra de búsqueda",
}: SearchBarProps) {
  return (
    <View
      style={[styles.container]}
      accessible
      accessibilityRole="search"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="Escribe el texto que deseas buscar"
    >
      <Feather
        name="search"
        size={18}
        color="rgba(60, 60, 67, 0.6)"
        style={styles.icon}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#88888B"
        value={value}
        onChangeText={onChangeText}
        accessibilityLabel="Campo de texto de búsqueda"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    backgroundColor: "#F9F9F8",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 42
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: 14,
    color: "#88888B",
    lineHeight: 32,
  },
});
