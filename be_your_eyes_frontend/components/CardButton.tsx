import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { DimensionValue, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CardLocalProps {
    name: string;
    address?: string;
    tieneMenuAccesible?: boolean;
    onPress: () => void;
    accessibilityHintText: string;
    width?: DimensionValue;
}

export default function CardButton({ name, address, onPress, accessibilityHintText, width = "80%", tieneMenuAccesible }: CardLocalProps) {

    let accessibilityLabel = address
        ? `${name}, ubicado en ${address}`
        : name;

    if (tieneMenuAccesible != null) {
        if (tieneMenuAccesible) {
            accessibilityLabel += ", con carta accesible.";
        } else {
            accessibilityLabel += ", sin carta accesible.";
        }
    }

    return (
        <TouchableOpacity
            style={[styles.button, { width: width }]}
            onPress={onPress}
            accessible
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHintText}
        >
            <View style={styles.textContainer}>
                <Text style={styles.nameText}>{name}</Text>
                {address ? (
                    <Text style={styles.addressText}>{address}</Text>
                ) : null}
                {tieneMenuAccesible && (
                    <View style={styles.accesibleContainer}>
                        <MaterialIcons name="accessible" size={20} color={Colors.text} />
                        <Text style={styles.accesibleText}>Carta accesible</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 12,
        alignItems: "center",
        marginVertical: 8,
        width: "80%",
        backgroundColor: Colors.secondary,

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    textContainer: {
        alignItems: "center",
    },
    nameText: {
        color: Colors.text,
        fontWeight: "700",
        fontSize: 20,
        marginBottom: 4,
    },
    addressText: {
        color: Colors.text,
        fontWeight: "400",
        fontSize: 16,
    },
    accesibleContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    accesibleText: {
        fontFamily: "Inter",
        fontWeight: "400",
        fontSize: 14,
        lineHeight: 17,
        color: "#273431",
        marginLeft: 4,
    },
});