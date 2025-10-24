import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface ButtonProps {
    label: string;
    onPress: () => void;
    type?: "primary" | "secondary";
}

export default function Button({ label, onPress, type = "primary" }: ButtonProps) {
    const backgroundColor = type === "primary" ? Colors.primary : Colors.secondary;

    return (
        <TouchableOpacity style={[styles.button, { backgroundColor }]} onPress={onPress}>
            <Text style={styles.text}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
        marginVertical: 8,
        width:"100%"
    },
    text: {
        color: Colors.text,
        fontWeight: "600",
        fontSize: 16,
    },
});