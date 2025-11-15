import { Avatar } from "@/components/Avatar";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput"; 
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

interface EditForm {
    nombre: string;
    email: string;
    currentPassword: string; 
    newPassword: string;
}

export default function EditarPerfilClienteScreen() {
    const { accessToken } = useAuth();
    const { apiFetch } = useApi();

    const [loading, setLoading] = useState(true);
    const [personaId, setPersonaId] = useState<number | null>(null);
    const [form, setForm] = useState<EditForm>({
        nombre: "",
        email: "",
        currentPassword: "", 
        newPassword: "",
    });

    // ---------------- Load Cliente Data ----------------
    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                if (!accessToken) return;
                try {
                    // 1. Obtener el ID de la Persona
                    const resPersona = await apiFetch(`${process.env.EXPO_PUBLIC_API_URL}me/persona_id`);
                    const dataPersonaId = await resPersona.json();
                    const currentPersonaId = dataPersonaId.persona_id;
                    setPersonaId(currentPersonaId);

                    // 2. Obtener datos de la Persona
                    const resPersonaData = await apiFetch(`${process.env.EXPO_PUBLIC_API_URL}personas/${currentPersonaId}`);
                    const data = await resPersonaData.json();

                    setForm((prev) => ({
                        ...prev,
                        nombre: data.nombre ?? "",
                        email: data.email ?? "",
                    }));
                } catch (error) {
                    console.error("Error al obtener datos del cliente:", error);
                    Alert.alert("Error", "No se pudieron cargar los datos.");
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }, [accessToken, apiFetch])
    );

    const handleChange = (key: keyof EditForm, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    // ----------------- Lógica de Guardado -----------------
    const handleSave = async () => {
        if (!personaId) return;

        if (!form.nombre || !form.email) {
            return Alert.alert("Error", "El nombre y el email son obligatorios.");
        }

        try {
            const body: any = {
                nombre: form.nombre,
                email: form.email,
            };
            
            // Lógica de cambio de contraseña
            if (form.newPassword) {
                if (!form.currentPassword) {
                    return Alert.alert("Error", "Debes ingresar tu contraseña actual para establecer una nueva.");
                }
                body.contrasenia_actual = form.currentPassword; 
                body.contrasenia = form.newPassword; 
            }

            // Endpoint para actualizar el perfil del cliente logueado
            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}personas/${personaId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const errorData = await res.json();
                // Si el error es por credenciales (ej: contraseña actual incorrecta)
                if (res.status === 401) {
                    throw new Error("Contraseña actual incorrecta o credenciales inválidas.");
                }
                throw new Error(errorData.detail || "Error al actualizar el perfil");
            }
            
            Alert.alert("✅ Éxito", "Los datos se actualizaron correctamente");
            router.replace("/(cliente)/perfil"); 
        } catch (error: any) {
            console.error("Error al guardar cambios:", error);
            Alert.alert("❌ Error", error.message || "No se pudieron guardar los cambios");
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView edges={["top"]} style={styles.safeArea}>
            <ScrollView contentContainerStyle={GlobalStyles.container}> 
                <View style={styles.header}>
                    <Avatar name={form.nombre} size={80} />
                    <Text style={GlobalStyles.tittle}>Editando Usuario</Text>
                </View>
                <View style={GlobalStyles.containerInputs}> 
                    <CustomInput 
                        label="Nombre de Usuario" 
                        value={form.nombre} 
                        onChangeText={(v) => handleChange("nombre", v)} 
                        placeholder="Nombre Usuario"
                    />
                    <CustomInput 
                        label="Email" 
                        value={form.email} 
                        onChangeText={(v) => handleChange("email", v)} 
                        keyboardType="email-address"
                        placeholder="Email"
                    />
                    
                    <CustomInput 
                        label="Contraseña Actual" 
                        value={form.currentPassword} 
                        onChangeText={(v) => handleChange("currentPassword", v)} 
                        secureTextEntry 
                        placeholder="Contraseña actual para verificación"
                    />

                    <CustomInput 
                        label="Nueva Contraseña"
                        value={form.newPassword} 
                        onChangeText={(v) => handleChange("newPassword", v)} 
                        secureTextEntry 
                        placeholder="Nueva contraseña"
                    />
                </View>

                <CustomButton label="Guardar cambios" onPress={handleSave} type="primary" />
                <CustomButton label="Cancelar" onPress={() => router.back()} type="secondary" />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: Colors.background },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    header: { alignItems: "center", marginBottom: 20 },
});