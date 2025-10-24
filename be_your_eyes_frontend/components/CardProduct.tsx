import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface CardProductProps {
    title: string;
    description: string;
    price: string | number;
}

export default function CardProduct({ title, description, price }: CardProductProps) {
    return (
        <View
            style={styles.card}
            accessible
            accessibilityRole="summary" // 👈 indica que es una tarjeta de resumen o información
            accessibilityLabel={`${title}. ${description}. Precio: ${price} pesos.`}
            accessibilityHint="Tarjeta de producto con título, descripción y precio."
        >
            <Text
                style={styles.title}
                accessibilityRole="header" // 👈 el lector lo anuncia como título principal
                accessibilityLabel={`Título: ${title}`}
            >
                {title}
            </Text>

            <Text
                style={styles.description}
                accessibilityLabel={`Descripción: ${description}`}
            >
                {description}
            </Text>

            <Text
                style={styles.price}
                accessibilityLabel={`Precio: ${price} pesos`}
            >
                ${price}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: "80%",
        backgroundColor: Colors.secondary,
        borderRadius: 8,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginVertical: 8,

        // sombra
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        color: Colors.text,
        fontWeight: "700",
        fontSize: 20,
        marginBottom: 12,
        textAlign: "left",
    },
    description: {
        color: Colors.text,
        fontWeight: "400",
        fontSize: 16,
        marginBottom: 12,
        textAlign: "left",
    },
    price: {
        color: Colors.text,
        fontWeight: "600",
        fontSize: 18,
        marginBottom: 18,
        textAlign: "left",
    },
});
