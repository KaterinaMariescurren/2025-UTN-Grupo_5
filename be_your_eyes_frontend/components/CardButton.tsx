import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CardLocalProps {
    name: string;
    address?: string;
    onPress: () => void;
}

export default function CardButton({ name, address, onPress }: CardLocalProps) {

    return (
        <TouchableOpacity style={[styles.button]} onPress={onPress}>
            <View style={styles.textContainer}>
                <Text style={styles.nameText}>{name}</Text>
                {address ? (
                    <Text style={styles.addressText}>{address}</Text>
                ) : null}
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
});