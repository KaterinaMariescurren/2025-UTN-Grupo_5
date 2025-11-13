import { Colors } from "@/constants/Colors";
import { GlobalStyles } from "@/constants/GlobalStyles";
import React from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
} from "react-native";
import CustomButton from "./CustomButton";

interface ConfirmModalProps {
    visible: boolean;
    nombre: string;
    descripcion?: string; 
    onAccept: () => void;
    onCancel: () => void;
}

export default function CustomModal({
    visible,
    nombre,
    onAccept,
    onCancel,
}: ConfirmModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={GlobalStyles.tittle}>¿Estás seguro que deseas eliminar {nombre}?</Text>

                    <View style={GlobalStyles.containerButton}>
                        <CustomButton
                            label="Aceptar"
                            onPress={onAccept}
                            type="primary"
                            accessibilityHint={"Eliminar" + { nombre }}
                        />
                        <CustomButton
                            label="Cancelar"
                            onPress={onCancel}
                            type="secondary"
                            accessibilityHint={"Cancelar la eliminacion de " + { nombre }}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.2)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 17
    },
    modalContainer: {
        backgroundColor: Colors.background,
        borderRadius: 24,
        paddingVertical: 44,
    },

});
