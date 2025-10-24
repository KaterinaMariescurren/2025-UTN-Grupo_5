import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function Navbar({ onBack, onProfile }: { onBack: () => void, onProfile: () => void }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onBack}>
                <Ionicons name="arrow-back" size={24} color={Colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onProfile}>
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
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: Colors.text,
    },
});