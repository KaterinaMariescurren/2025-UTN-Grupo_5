import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, Modal, FlatList } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { GlobalStyles } from "@/constants/GlobalStyles";
import { Colors } from "@/constants/Colors";
import CardButton from "@/components/CardButton";
import CustomButton from "@/components/CustomButton";
// import { useAuth } from '@/contexts/authContext'; 
interface Horario {
    dia: string;
    horario_apertura: string;
    horario_cierre: string;
}

interface Local {
    id: number;
    nombre: string;
    horarios: Horario[];
}

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

export default function DetalleLocal() {
    const { id } = useLocalSearchParams();
    const [local, setLocal] = useState<Local | null>(null);
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    // MOCK TEMPORAL: Reemplazar con const { user } = useAuth();
    const user = { id: 123 };

    useEffect(() => {
        if (!id) return;
        setLoading(true);

        fetch(`${BACKEND_URL}locales/${id}`)
            .then(res => res.json())
            .then(data => setLocal(data as Local))
            .catch(err => console.error(err));

        fetch(`${BACKEND_URL}menus/local/${id}`)
            .then(res => res.json())
            .then(data => {
                const menuData = Array.isArray(data) ? data : (Array.isArray(data.menus) ? data.menus : []);
                setMenus(menuData);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    const notificarCumplimiento = async (cumple: boolean) => {
        setShowModal(false);

        if (!user?.id) {
            Alert.alert("Error", "Debes iniciar sesión para notificar el cumplimiento.");
            return;
        }

        try {
            await fetch(`${BACKEND_URL}notificaciones/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    persona_id: user.id,
                    local_id: parseInt(id as string),
                    tiene_carta: cumple,
                }),
            });
            Alert.alert("Gracias", `Se notificó que el local ${cumple ? "CUMPLE" : "NO cumple"}.`);
        } catch (error) {
            Alert.alert("Error", "No se pudo enviar la notificación.");
        }
    };

    if (loading || !local) return (
        <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando detalle del local...</Text>
        </View>
    );

    return (
        <View style={GlobalStyles.container}>

            <Text style={GlobalStyles.tittle}>{local.nombre}</Text>

            <Text style={styles.sectionTitle}>Horarios</Text>

            <View style={{ marginBottom: 32 }}>
                {local.horarios && local.horarios.length > 0 ? (
                    local.horarios.map((h, index) => (
                        <Text key={index} style={styles.horarioText}>
                            {h.dia}: {h.horario_apertura.substring(0, 5)}hs a {h.horario_cierre.substring(0, 5)}hs
                        </Text>
                    ))
                ) : (
                    <Text style={styles.horarioText}>Horarios no disponibles</Text>
                )}
            </View>

            <View style={styles.containerMenus}>
                <Text style={styles.sectionTitle}>Menús</Text>
                <Text style={styles.menuSubtitle}>Haga clic para más información</Text>

                <FlatList
                    data={menus}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <CardButton
                            name={item.nombre}
                            onPress={() => router.push(`/local/${item.id}`)}
                            accessibilityHintText=""
                            width={"100%"}
                        />
                    )}
                />
            </View>

            <View style={GlobalStyles.containerButton}>
                <CustomButton
                    label="Notificar Cumplimiento"
                    onPress={() => setShowModal(true)}
                    type="primary"
                    accessibilityHint="Acceptar la creacion del plato"
                />
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Notificar cumplimiento</Text>
                        <Text style={styles.modalQuestion}>¿El local cumple con tener el menú en braille y/o el QR?</Text>

                        <TouchableOpacity
                            style={[styles.modalAction, styles.modalCumple]}
                            onPress={() => notificarCumplimiento(true)}
                        >
                            <Text style={[styles.modalActionText, { color: 'white' }]}>Cumple</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modalAction, styles.modalNoCumple]}
                            onPress={() => notificarCumplimiento(false)}
                        >
                            <Text style={[styles.modalActionText, { color: '#333' }]}>No Cumple</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { fontSize: 16, color: '#555' },
    sectionTitle: {
        paddingTop: 16,
        fontSize: 27,
        fontWeight: "bold",
        color: '#333',
        textAlign: 'center',
        marginBottom: 8,
    },
    horarioText: {
        fontSize: 16,
        color: Colors.text,
        fontWeight: 500,
        textAlign: 'center',
        lineHeight: 24,
    },
    menuSubtitle: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginBottom: 25,
    },
    containerMenus: {
        height: "65%",
        marginBottom: 20,
        borderTopColor: Colors.text,
        borderTopWidth: 2,
        borderBottomColor: Colors.text,
        borderBottomWidth: 2
    },
    menuName: {
        fontSize: 18,
        color: '#333',
        fontWeight: '600'
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#333',
    },
    modalQuestion: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 24,
    },
    modalAction: {
        width: '100%',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 15,
    },
    modalCumple: {
        backgroundColor: '#07bcb3',
    },
    modalNoCumple: {
        backgroundColor: '#f4f4f4',
        borderWidth: 1,
        borderColor: '#ddd'
    },
    modalActionText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
});