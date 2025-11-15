import { Colors } from "@/constants/Colors";
import React from "react";
import { DimensionValue, StyleSheet, Text, View } from "react-native";

interface CardProductProps {
    title: string;
    description: string;
    price: string | number;
    width?: DimensionValue;
}

export default function CardProduct({ title, description, price, width = "80%" }: CardProductProps) {
    return (
        <View
            style={[styles.card, { width }]}
            accessible
            accessibilityRole="summary"
            accessibilityLabel={`${title}. Precio: ${price} pesos. ${description}`}
        >
            <Text
                style={styles.title}
                accessibilityElementsHidden={true}
                importantForAccessibility="no"
            >
                {title}
            </Text>

            <Text
                style={styles.description}
                accessibilityElementsHidden={true}
                importantForAccessibility="no"
            >
                {description}
            </Text>

            <Text
                style={styles.price}
                accessibilityElementsHidden={true}
                importantForAccessibility="no"            >
                ${price}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
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
