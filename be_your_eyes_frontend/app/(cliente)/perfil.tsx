import { Avatar } from "@/components/Avatar";
import CustomButton from "@/components/CustomButton";
import { DeleteModal } from "@/components/DeleteModal";
import { Colors } from "@/constants/Colors";
import { GlobalStyles } from "@/constants/GlobalStyles"; 
import { useAuth } from "@/contexts/authContext";
import { useApi } from "@/utils/api";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PersonaData {
    id: number;
    nombre: string;
    email: string;
}

export default function VerPerfilClienteScreen() {
    const { accessToken, logout } = useAuth();
    const { apiFetch } = useApi();

    const [loading, setLoading] = useState(true);
    const [personaId, setPersonaId] = useState<number | null>(null);
    const [personaData, setPersonaData] = useState<PersonaData | null>(null);
    const [showModalDelete, setShowModalDelete] = useState(false);

    // ----------------- Carga de datos -----------------
    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                if (!accessToken) return;
                try {
                    // 1. Obtener el ID de la Persona
                    const resPersona = await apiFetch(`${process.env.EXPO_PUBLIC_API_URL}me/persona_id`);
                    if (resPersona.status === 404) throw new Error("ID de cliente no encontrado.");
                    const dataPersonaId = await resPersona.json();
                    const currentPersonaId = dataPersonaId.persona_id;
                    setPersonaId(currentPersonaId);

                    // 2. Obtener datos de la Persona 
                    const resPersonaData = await apiFetch(`${process.env.EXPO_PUBLIC_API_URL}personas/${currentPersonaId}`);
                    const data = await resPersonaData.json();
                    setPersonaData(data);

                } catch (error) {
                    console.error("Error al obtener datos del cliente:", error);
                    Alert.alert("Error", "No se pudieron cargar los datos.");

                    await logout(); 
                    router.replace("/login");
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }, [accessToken, apiFetch, logout])
    );

    // ----------------- Lógica de eliminación -----------------
    const handleDeleteProfile = async () => {
        if (!personaId) return;
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}personas/${personaId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                await logout();
                setShowModalDelete(false);
                router.replace("/");
            } else if (response.status === 401) {
                Alert.alert("Sesión expirada", "Por favor, vuelve a iniciar sesión.");
                logout();
            } else {
                Alert.alert("Error", "No se pudo eliminar el perfil.");
            }
        } catch (error) {
            console.error("Error eliminando perfil:", error);
            Alert.alert("Error", "Ocurrió un problema al eliminar el perfil.");
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (!personaData) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>No se encontró información del perfil.</Text>
            </View>
        );
    }

    const userName = personaData.nombre;

    return (
        <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
            <ScrollView contentContainerStyle={styles.containerContent}> 
                {/* Header */}
                <View style={styles.header}>
                    <Avatar name={userName} size={80} />
                    <Text style={[GlobalStyles.tittle, {marginTop: 10}]}> Hola {userName}</Text> 
                </View>

                {/* Información básica - Campos no editables */}
                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Nombre Usuario</Text>
                    <Text style={styles.input}>{personaData.nombre}</Text> 

                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.input}>{personaData.email}</Text>

                    <Text style={styles.label}>Contraseña</Text>
                    <Text style={styles.input}>********</Text> 
                </View>

                {/* Botones */}
                <CustomButton
                    label="Editar"
                    onPress={() => router.push("/(cliente)/editarPerfil")}
                    type="primary"
                />
                <CustomButton
                    label="Eliminar Perfil"
                    onPress={() => setShowModalDelete(true)}
                    type="secondary"
                />

                {/* Modal eliminar perfil */}
                <DeleteModal
                    visible={showModalDelete}
                    onCancel={() => setShowModalDelete(false)}
                    onConfirm={handleDeleteProfile}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: Colors.background },
    containerContent: { padding: 20, backgroundColor: Colors.background }, 
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    header: { alignItems: "center", marginBottom: 40 },
    fieldGroup: { marginBottom: 30 },
    label: { fontSize: 14, fontWeight: '500', color: Colors.text, opacity: 0.8, marginTop: 10 },
    input: {
        marginVertical: 4, 
        borderRadius: 8, 
        paddingVertical: 18, 
        paddingHorizontal: 16, 
        fontSize: 16, 
        color: Colors.text, 
        backgroundColor: Colors.secondary,
        borderWidth: 1, 
        borderColor: 'transparent',
    },
    errorText: { color: Colors.text, fontSize: 16 },
});