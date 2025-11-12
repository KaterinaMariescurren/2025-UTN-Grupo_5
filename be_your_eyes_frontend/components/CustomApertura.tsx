import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface CustomDisplayProps {
    fecha: string;
    horario_inicio?: string;
    horario_fin?: string;
    accessibilityHint?: string;
}

export default function CustomApertura({
    fecha,
    horario_inicio,
    horario_fin,
    accessibilityHint,
}: CustomDisplayProps) {
    const mostrarHorarios = horario_inicio && horario_fin;

    return (
        <View
            style={styles.container}
            accessible
            accessibilityRole="text"
            accessibilityLabel={
                mostrarHorarios
                    ? `Fecha: ${fecha}, Horario: ${horario_inicio} a ${horario_fin}`
                    : `Fecha: ${fecha}`
            }
            accessibilityHint={
                accessibilityHint || "Muestra la fecha y el horario si está disponible"
            }
        >
            <View style={styles.wrapper}>
                <Text style={styles.leftText}>{fecha}:</Text>
                {mostrarHorarios && (
                    <Text style={styles.rightText}>
                        {horario_inicio} - {horario_fin}
                    </Text>
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
    wrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Colors.secondary,
        borderRadius: 8,
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    leftText: {
        fontSize: 16,
        color: Colors.text,
        fontWeight: "500",
    },
    rightText: {
        fontSize: 16,
        color: Colors.text,
        fontWeight: "500",
    },
});
