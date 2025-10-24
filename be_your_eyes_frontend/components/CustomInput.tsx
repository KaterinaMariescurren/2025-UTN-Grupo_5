import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface CustomInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  secureTextEntry?: boolean;
  accessibilityHint?: string;
  rightIconName?: keyof typeof MaterialIcons.glyphMap;
}

export default function CustomInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  secureTextEntry = false,
  accessibilityHint,
  rightIconName,
}: CustomInputProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, rightIconName ? { paddingRight: 40 } : {}]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          accessible
          accessibilityLabel={label}
          accessibilityHint={
            accessibilityHint || `Campo de texto para ${label.toLowerCase()}`
          }
        />
        {rightIconName && (
          <View style={styles.iconWrapper} accessible={false} pointerEvents="none">
            <MaterialIcons name={rightIconName} size={24} color="#000000" />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 8,
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
  },
  input: {
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.secondary,
  },
  iconWrapper: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
});
