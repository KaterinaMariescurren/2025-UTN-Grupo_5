import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, TextInput, View, TouchableOpacity } from "react-native";
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
    onRightIconPress?: () => void;
    rightIconAccessibilityLabel?: string; // Etiqueta para el lector de pantalla del icono
    rightIconAccessibilityHint?: string;  // Hint para el lector de pantalla del icono
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
    onRightIconPress,
    rightIconAccessibilityLabel,
    rightIconAccessibilityHint,
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

                {rightIconName && onRightIconPress && (
                    <TouchableOpacity
                        style={styles.iconWrapper}
                        onPress={onRightIconPress}
                        accessibilityRole="button"
                        accessibilityLabel={
                            rightIconAccessibilityLabel || `Acción del icono de ${label}`
                        }
                        accessibilityHint={
                            rightIconAccessibilityHint || `Toca para realizar la acción de ${label}`
                        }
                    >
                        <MaterialIcons name={rightIconName} size={24} color="#000000" />
                    </TouchableOpacity>
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
