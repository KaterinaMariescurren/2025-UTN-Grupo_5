import { Avatar } from "@/components/Avatar";
import CustomApertura from "@/components/CustomApertura";
import CustomButton from "@/components/CustomButton";
import CustomDropdown from "@/components/CustomDropdown";
import CustomTimePicker from "@/components/CustomTimePicker";
import { DeleteModal } from "@/components/DeleteModal";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/authContext";
import { useApi } from "@/utils/api";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerPerfilLocalScreen() {
    const { accessToken, logout } = useAuth();
    const { apiFetch } = useApi();

    const [loading, setLoading] = useState(true);
    const [localId, setLocalId] = useState<number | null>(null);
    const [localData, setLocalData] = useState<any>(null);
    const [showModalDelete, setShowModalDelete] = useState(false);

    // Horarios
    const [horarios, setHorarios] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [diaTemp, setDiaTemp] = useState("Lunes");
    const [aperturaTemp, setAperturaTemp] = useState(new Date());
    const [cierreTemp, setCierreTemp] = useState(new Date());

    // Carga de datos
    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                if (!accessToken) return;
                try {
                    // Obtener local_id
                    const resLocal = await apiFetch(`${process.env.EXPO_PUBLIC_API_URL}me/local_id`);
                    const dataLocal = await resLocal.json();
                    setLocalId(dataLocal.local_id);

                    // Obtener datos del local
                    const resLocalData = await apiFetch(`${process.env.EXPO_PUBLIC_API_URL}locales/${dataLocal.local_id}`);
                    const data = await resLocalData.json();
                    console.log(data);
                    setLocalData(data);

                    // Obtener horarios del local desde el endpoint de horarios
                    const resHorarios = await apiFetch(`${process.env.EXPO_PUBLIC_API_URL}horarios/local/${dataLocal.local_id}`);
                    const dataHorarios = await resHorarios.json();
                    setHorarios(
                        dataHorarios.map((h: any) => ({
                            id: h.id,
                            dia: h.dia,
                            apertura: new Date(`1970-01-01T${h.horario_apertura}`),
                            cierre: new Date(`1970-01-01T${h.horario_cierre}`),
                        }))
                    );
                } catch (error) {
                    console.error("Error al obtener datos del local:", error);
                    Alert.alert(
                        "Error",
                        "No se pudieron cargar los datos. Por favor, vuelve a iniciar sesión."
                    );
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }, [accessToken, apiFetch])
    );

    // ----------------- Agregar nuevo horario -----------------
    const openModalForNew = () => {
        setDiaTemp("Lunes");
        setAperturaTemp(new Date());
        setCierreTemp(new Date());
        setModalVisible(true);
    };

    const saveHorario = async () => {
        if (!diaTemp || !aperturaTemp || !cierreTemp) {
            return Alert.alert("Error", "Completa todos los campos del horario");
        }

        try {
            const body = {
                dia: diaTemp,
                horario_apertura: aperturaTemp.getHours().toString().padStart(2, "0") + ":" + aperturaTemp.getMinutes().toString().padStart(2, "0"),
                horario_cierre: cierreTemp.getHours().toString().padStart(2, "0") + ":" + cierreTemp.getMinutes().toString().padStart(2, "0"),
                local_id: localId,
            };


            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}horarios/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(body),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Error al guardar el horario");
            }

            const nuevoHorario = await response.json();
            setHorarios((prev) => [
                ...prev,
                {
                    id: nuevoHorario.id,
                    dia: nuevoHorario.dia,
                    apertura: new Date(`1970-01-01T${nuevoHorario.horario_apertura}`),
                    cierre: new Date(`1970-01-01T${nuevoHorario.horario_cierre}`),
                },
            ]);
            setModalVisible(false);
        } catch (error: any) {
            Alert.alert("Error", error.message || "Ocurrió un problema al guardar el horario");
        }
    };
    const handleDeleteProfile = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}locales/${localId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                await logout();
                setShowModalDelete(false);
            } else if (response.status === 401) {
                Alert.alert("Sesión expirada", "Por favor, vuelve a iniciar sesión.");
                logout();
            } else {
                Alert.alert("Error", "No se pudo eliminar el perfil. Intenta de nuevo.");
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

    if (!localData) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>No se encontró información del local.</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Avatar name={localData.nombre} size={80} />
                    <Text style={styles.title}> Hola {localData.nombre}</Text>
                </View>

                {/* Información básica */}
                <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Nombre</Text>
                    <Text style={styles.input}>{localData.nombre}</Text>

                    <Text style={styles.fieldLabel}>Correo electrónico</Text>
                    <Text style={styles.input}>{localData.email}</Text>

                    <Text style={styles.fieldLabel}>Teléfono</Text>
                    <Text style={styles.input}>{localData.telefono}</Text>

                    <Text style={styles.fieldLabel}>Calle</Text>
                    <Text style={styles.input}>{localData.direccion.calle}</Text>

                    <Text style={styles.fieldLabel}>Altura</Text>
                    <Text style={styles.input}>{localData.direccion.altura}</Text>

                    <Text style={styles.fieldLabel}>Codigo Postal</Text>
                    <Text style={styles.input}>{localData.direccion.codigo_postal}</Text>
                </View>

                {/* Horarios */}
                <View style={styles.horariosSection}>
                    <View style={styles.horariosHeader}>
                        <Text style={styles.horariosTitle}>Días y Horarios</Text>
                        <TouchableOpacity onPress={openModalForNew} accessibilityLabel="Agregar nuevo horario" >
                            <MaterialIcons name="add" size={26} color={Colors.text} />
                        </TouchableOpacity>
                    </View>

                    {horarios.length > 0 ? (
                        horarios.map((h, index) => (
                            <CustomApertura
                                key={index}
                                fecha={h.dia}
                                horario_inicio={h.apertura.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                })}
                                horario_fin={h.cierre.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                })}
                            />
                        ))
                    ) : (
                        <Text style={styles.noHorarios}>Sin horarios cargados</Text>
                    )}
                </View>

                {/* Botones */}
                <CustomButton
                    label="Editar perfil"
                    onPress={() => router.push("/perfil/editar")}
                    type="primary"
                />
                <CustomButton
                    label="Eliminar perfil"
                    onPress={() => setShowModalDelete(true)}
                    type="secondary"
                />

                {/* Modal eliminar perfil */}
                <DeleteModal
                    visible={showModalDelete}
                    onCancel={() => setShowModalDelete(false)}
                    onConfirm={handleDeleteProfile}
                />

                {/* Modal Agregar Horario */}
                <Modal visible={modalVisible} animationType="slide" transparent>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#000000aa",
                        }}
                    >
                        <View
                            style={{
                                width: "80%",
                                backgroundColor: "white",
                                paddingVertical: 30,
                                paddingHorizontal: 20,
                                borderRadius: 24,
                            }}
                        >
                            <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 20 }}>
                                Agregar nuevo horario
                            </Text>

                            <CustomDropdown
                                label="Día"
                                value={diaTemp}
                                placeholder="Selecciona un día"
                                options={[
                                    "Lunes",
                                    "Martes",
                                    "Miércoles",
                                    "Jueves",
                                    "Viernes",
                                    "Sábado",
                                    "Domingo",
                                ]}
                                onSelect={setDiaTemp}
                            />

                            <CustomTimePicker label="Hora de apertura" value={aperturaTemp} onChange={setAperturaTemp} />
                            <CustomTimePicker label="Hora de cierre" value={cierreTemp} onChange={setCierreTemp} />

                            <View style={{ marginTop: 20 }}>
                                <CustomButton label="Guardar" type="primary" onPress={saveHorario} />
                                <CustomButton
                                    label="Cancelar"
                                    type="secondary"
                                    onPress={() => setModalVisible(false)}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: Colors.background },
    container: { padding: 20, backgroundColor: Colors.background },
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    header: { alignItems: "center", marginBottom: 25 },
    title: { fontSize: 22, fontWeight: "700", color: Colors.text, marginTop: 10 },
    fieldGroup: { marginBottom: 16 },
    fieldLabel: { fontSize: 16, fontWeight: "600", color: Colors.text, marginBottom: 4 },
    input: { marginVertical: 8, borderRadius: 8, paddingVertical: 16, paddingHorizontal: 16, fontSize: 16, color: Colors.text, backgroundColor: Colors.secondary },
    horariosSection: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.text, paddingVertical: 10, marginVertical: 20 },
    horariosHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
    horariosTitle: { fontSize: 18, fontWeight: "700", color: Colors.text },
    noHorarios: { fontSize: 16, color: Colors.text, textAlign: "center", marginBottom: 10 },
    errorText: { color: Colors.text, fontSize: 16 },
});
