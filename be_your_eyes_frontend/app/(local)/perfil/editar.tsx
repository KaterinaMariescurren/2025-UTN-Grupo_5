import { Avatar } from "@/components/Avatar";
import CustomApertura from "@/components/CustomApertura";
import CustomButton from "@/components/CustomButton";
import CustomDropdown from "@/components/CustomDropdown";
import CustomInput from "@/components/CustomInput";
import CustomTimePicker from "@/components/CustomTimePicker";
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

export default function EditarPerfilLocalScreen() {
    const { accessToken } = useAuth();
    const { apiFetch } = useApi();

    const [loading, setLoading] = useState(true);
    const [localId, setLocalId] = useState<number | null>(null);
    const [localData, setLocalData] = useState<any>(null);
    const [form, setForm] = useState({
        nombre: "",
        email: "",
        telefono: "",
        calle: "",
        altura: "",
        codigo_postal: "",
    });

    // Horarios
    const [horarios, setHorarios] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingHorario, setEditingHorario] = useState<any | null>(null);
    const [diaTemp, setDiaTemp] = useState("Lunes");
    const [aperturaTemp, setAperturaTemp] = useState(new Date());
    const [cierreTemp, setCierreTemp] = useState(new Date());

    // ---------------- Load Local & Horarios ----------------
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
                    setLocalData(data);

                    setForm({
                        nombre: data.nombre ?? "",
                        email: data.email ?? "",
                        telefono: data.telefono ?? "",
                        calle: data.direccion?.calle ?? "",
                        altura: data.direccion?.altura?.toString() ?? "",
                        codigo_postal: data.direccion?.codigo_postal?.toString() ?? "",
                    });

                    // Obtener horarios desde /horarios/local/{localId}
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
                    Alert.alert("Error", "No se pudieron cargar los datos.");
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }, [accessToken, apiFetch])
    );

    const handleChange = (key: string, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleSave = async () => {
        if (!localId) return;
        try {
            const body = {
                nombre: form.nombre,
                email: form.email,
                telefono: form.telefono,
                direccion: {
                    calle: form.calle,
                    altura: parseInt(form.altura),
                    codigo_postal: form.codigo_postal,
                },
            };

            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}locales/${localId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error("Error al actualizar el local");
            Alert.alert("✅ Éxito", "Los datos se actualizaron correctamente");
            router.replace("/perfil");
        } catch (error) {
            console.error("Error al guardar cambios:", error);
            Alert.alert("❌ Error", "No se pudieron guardar los cambios");
        }
    };

    // ----------------- Horarios -----------------
    const openModalForNew = () => {
        setEditingHorario(null);
        setDiaTemp("Lunes");
        setAperturaTemp(new Date());
        setCierreTemp(new Date());
        setModalVisible(true);
    };

    const openModalForEdit = (horario: any) => {
        setEditingHorario(horario);
        setDiaTemp(horario.dia);
        setAperturaTemp(horario.apertura);
        setCierreTemp(horario.cierre);
        setModalVisible(true);
    };

    const saveHorario = async () => {
        if (!diaTemp || !aperturaTemp || !cierreTemp || !localId) {
            return Alert.alert("Error", "Completa todos los campos del horario");
        }

        try {
            const body = {
                dia: diaTemp,
                horario_apertura: aperturaTemp.getHours().toString().padStart(2, "0") + ":" + aperturaTemp.getMinutes().toString().padStart(2, "0"),
                horario_cierre: cierreTemp.getHours().toString().padStart(2, "0") + ":" + cierreTemp.getMinutes().toString().padStart(2, "0"),
                local_id: localId,
            };

            let url = `${process.env.EXPO_PUBLIC_API_URL}horarios/`;
            let method = "POST";

            if (editingHorario) {
                url = `${process.env.EXPO_PUBLIC_API_URL}horarios/${editingHorario.id}`;
                method = "PUT";
            }

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Error al guardar el horario");
            }

            const savedHorario = await response.json();

            setHorarios((prev) => {
                if (editingHorario) {
                    return prev.map((h) =>
                        h.id === savedHorario.id
                            ? {
                                id: savedHorario.id,
                                dia: savedHorario.dia,
                                apertura: new Date(`1970-01-01T${savedHorario.horario_apertura}`),
                                cierre: new Date(`1970-01-01T${savedHorario.horario_cierre}`),
                            }
                            : h
                    );
                } else {
                    return [
                        ...prev,
                        {
                            id: savedHorario.id,
                            dia: savedHorario.dia,
                            apertura: new Date(`1970-01-01T${savedHorario.horario_apertura}`),
                            cierre: new Date(`1970-01-01T${savedHorario.horario_cierre}`),
                        },
                    ];
                }
            });

            setModalVisible(false);
        } catch (error: any) {
            Alert.alert("Error", error.message || "Ocurrió un problema al guardar el horario");
        }
    };

    const deleteHorario = async (horarioId: number) => {
        try {
            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}horarios/${horarioId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (!res.ok) throw new Error("Error al eliminar horario");

            setHorarios((prev) => prev.filter((h) => h.id !== horarioId));
        } catch (error) {
            Alert.alert("Error", "No se pudo eliminar el horario");
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
        <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: Colors.background }}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Avatar name={form.nombre} size={80} />
                    <Text style={styles.title}>Editando {form.nombre}</Text>
                </View>

                <CustomInput label="Nombre" value={form.nombre} onChangeText={(v) => handleChange("nombre", v)} />
                <CustomInput label="Correo electrónico" value={form.email} onChangeText={(v) => handleChange("email", v)} />
                <CustomInput label="Teléfono" value={form.telefono} onChangeText={(v) => handleChange("telefono", v)} keyboardType="phone-pad" />
                <CustomInput label="Calle" value={form.calle} onChangeText={(v) => handleChange("calle", v)} />
                <CustomInput label="Altura" value={form.altura} onChangeText={(v) => handleChange("altura", v)} keyboardType="numeric" />
                <CustomInput label="Código Postal" value={form.codigo_postal} onChangeText={(v) => handleChange("codigo_postal", v)} />

                {/* Horarios */}
                <View style={styles.horariosSection}>
                    <View style={styles.horariosHeader}>
                        <Text style={styles.horariosTitle}>Días y Horarios</Text>
                        <TouchableOpacity onPress={openModalForNew}>
                            <MaterialIcons name="add" size={26} color={Colors.text} />
                        </TouchableOpacity>
                    </View>

                    {horarios.length ? (
                        horarios.map((h) => (
                            <View
                                key={h.id}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: 10, // separación entre horarios
                                }}
                            >
                                <View style={{ flex: 1 }}>
                                    <CustomApertura
                                        fecha={h.dia}
                                        horario_inicio={h.apertura.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}
                                        horario_fin={h.cierre.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}
                                    />
                                </View>
                                <View style={{ flexDirection: "row", marginLeft: 10 }}>
                                    <TouchableOpacity onPress={() => openModalForEdit(h)} style={{ marginRight: 10 }}>
                                        <MaterialIcons name="edit" size={24} color={Colors.primary} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => deleteHorario(h.id)}>
                                        <MaterialIcons name="delete" size={24} color={Colors.cta} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noHorarios}>Sin horarios cargados</Text>
                    )}
                </View>

                {/* Modal Agregar/Editar Horario */}
                <Modal visible={modalVisible} animationType="slide" transparent>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000000aa" }}>
                        <View style={{ width: "80%", backgroundColor: "white", paddingVertical: 30, paddingHorizontal: 20, borderRadius: 24 }}>
                            <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 20 }}>
                                {editingHorario ? "Editar horario" : "Agregar nuevo horario"}
                            </Text>

                            <CustomDropdown
                                label="Día"
                                value={diaTemp}
                                placeholder="Selecciona un día"
                                options={["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]}
                                onSelect={setDiaTemp}
                            />

                            <CustomTimePicker label="Hora de apertura" value={aperturaTemp} onChange={setAperturaTemp} />
                            <CustomTimePicker label="Hora de cierre" value={cierreTemp} onChange={setCierreTemp} />

                            <View style={{ marginTop: 20 }}>
                                <CustomButton label="Guardar" type="primary" onPress={saveHorario} />
                                <CustomButton label="Cancelar" type="secondary" onPress={() => setModalVisible(false)} />
                            </View>
                        </View>
                    </View>
                </Modal>

                <CustomButton label="Guardar cambios" onPress={handleSave} type="primary" />
                <CustomButton label="Cancelar" onPress={() => router.back()} type="secondary" />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    header: { alignItems: "center", marginBottom: 20 },
    title: { fontSize: 22, fontWeight: "700", color: Colors.text, marginTop: 10 },
    horariosSection: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.text,
        paddingVertical: 10,
        marginVertical: 20,
    },
    horariosHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    horariosTitle: { fontSize: 18, fontWeight: "700", color: Colors.text },
    noHorarios: { fontSize: 16, color: Colors.text, textAlign: "center", marginBottom: 10 },
});
