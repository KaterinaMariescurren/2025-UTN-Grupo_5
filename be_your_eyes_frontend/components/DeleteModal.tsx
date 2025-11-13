// components/DeleteProfileModal.tsx
import { Colors } from "@/constants/Colors";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DeleteProfileModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteModal = ({ visible, onCancel, onConfirm }: DeleteProfileModalProps) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>¿Estás seguro de que deseas eliminar tu perfil?</Text>
          <Text style={styles.message}>
            Al eliminar tu perfil, perderás acceso a todas tus configuraciones, datos guardados y cualquier contenido que hayas creado.
            Esta acción no se puede deshacer.{"\n\n"}
            Si decides eliminar tu perfil, queremos que sepas que siempre serás bienvenido/a de vuelta.
          </Text>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={onConfirm}>
              <Text style={styles.deleteText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: Colors.background,
    padding: 20,
    borderRadius: 16,
    width: "85%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.text,
  },
  message: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.secondary,
  },
  cancelText: {
    color: Colors.text,
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.cta,
  },
  deleteText: {
    color: Colors.background,
    fontWeight: "bold",
  },
});
