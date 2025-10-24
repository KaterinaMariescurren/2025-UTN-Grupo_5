import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, Modal } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons'; 
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
        <View style={styles.fullContainer}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
            
                <Text style={styles.localNameTitle}>{local.nombre}</Text>

                <Text style={styles.sectionTitle}>Horarios</Text>
                
                {local.horarios && local.horarios.length > 0 ? (
                    local.horarios.map((h, index) => (
                                <Text key={index} style={styles.horarioText}>
                                    {h.dia}: {h.horario_apertura.substring(0, 5)}hs a {h.horario_cierre.substring(0, 5)}hs
                                </Text>
                    ))
                ) : (
                    <Text style={styles.horarioText}>Horarios no disponibles</Text>
                )}

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Menús</Text>
                <Text style={styles.menuSubtitle}>Haga clic para más información</Text>

                {menus.length === 0 ? (
                    <Text style={styles.noMenus}>No hay menús disponibles</Text>
                ) : (
                    menus.map((menu: any) => (
                        <TouchableOpacity
                            key={menu.id}
                            style={styles.menuCard}
                            onPress={() => router.push(`/menu/${menu.id}`)}
                        >
                            <Text style={styles.menuName}>{menu.nombre}</Text> 
                        </TouchableOpacity>
                    ))
                )}
                
                <View style={{ height: 100 }} /> 

            </ScrollView>
            
            <TouchableOpacity
                style={styles.notifyButtonFixed}
                onPress={() => setShowModal(true)}
            >
                <Text style={styles.notifyTextFixed}>Notificar Cumplimiento</Text>
            </TouchableOpacity>

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
    fullContainer: { flex: 1, backgroundColor: "#fff" },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { fontSize: 16, color: '#555' },
    contentContainer: { 
        paddingHorizontal: 20, 
        paddingTop: 10, 
        paddingBottom: 20    },
    
    localNameTitle: { 
        fontSize: 28, 
        fontWeight: "bold", 
        color: '#333', 
        textAlign: 'center', 
        marginBottom: 20 
    },

    sectionTitle: { 
        fontSize: 20, 
        fontWeight: "bold", 
        color: '#333', 
        textAlign: 'center', 
        marginTop: 15,
        marginBottom: 8,
    },
    horarioText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        lineHeight: 24,
    },
    menuSubtitle: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginBottom: 25,
    },
    noMenus: { 
        textAlign: 'center', 
        color: '#888', 
        marginTop: 10 
    },
    
    divider: {
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginVertical: 25,
    },

    menuCard: {
        backgroundColor: '#E6F8F6',
        paddingVertical: 18,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 10,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
    },
    menuName: { 
        fontSize: 18, 
        color: '#333', 
        fontWeight: '600' 
    },
    
    notifyButtonFixed: {
        position: 'absolute',
        bottom: 0,
        left: 20,
        right: 20,
        backgroundColor: '#07bcb3', 
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 20,
        zIndex: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    notifyTextFixed: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
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