import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons';

interface Direccion {
    id: number;
    altura: string;
    calle: string;
    codigo_postal: string;
}

interface LocalItem {
    id: number;
    nombre: string;
    telefono: string;
    direccion_id: number;
    tipo_local_id: number;
    tiene_menu_accesible: boolean;
    tiene_qr: boolean;
    direccion: Direccion; 
}

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

export default function RestaurantesPorTipo() {
    const { tipoId } = useLocalSearchParams();
    const [locales, setLocales] = useState<LocalItem[]>([]);
    const [nombreTipo, setNombreTipo] = useState("Cargando...");
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!tipoId) return;

        setLoading(true);

        fetch(`${BACKEND_URL}tipos_local/${tipoId}`)
            .then(res => res.json())
            .then(data => setNombreTipo(data.nombre || "Tipo Desconocido"))
            .catch(err => {
                console.error("Error al cargar el nombre del tipo:", err);
                setNombreTipo("Tipo Desconocido");
            });
            
        fetch(`${BACKEND_URL}locales/buscar/?tipo_local_id=${tipoId}`)
            .then(res => res.json())
            .then(data => {
                setLocales(data as LocalItem[]); 
                setLoading(false);
            })
            .catch(err => {
                console.error("Error al cargar locales:", err);
                setLoading(false);
            });
    }, [tipoId]);

    const filteredLocales = locales.filter(item =>
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (
            item.direccion && 
            `${item.direccion.calle} ${item.direccion.altura}`.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const renderContent = () => {
        if (loading) {
            return <ActivityIndicator size="large" color="#07bcb3" style={styles.loadingIndicator} />;
        }

        if (locales.length === 0) {
            return (
                <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}> No hay locales disponibles para este tipo.</Text>
                </View>
            );
        }
        
        return (
            <FlatList
                data={filteredLocales}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => router.push(`/local/${item.id}`)}
                    >
                        <Text style={styles.name}>{item.nombre}</Text>
                        <Text style={styles.address}>
                            {item.direccion ? `${item.direccion.calle} ${item.direccion.altura}` : 'Dirección no disponible'}
                        </Text>
                        {item.tiene_menu_accesible && (
                            <Text style={styles.accesible}>✅ Carta accesible</Text>
                        )}
                    </TouchableOpacity>
                )}
            />
        );
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>{nombreTipo}</Text>
            <Text style={styles.subtitle}>Haga clic para más información</Text>

            <View style={styles.searchBar}>
                <Feather name="search" size={20} color="#888" style={{ marginRight: 10 }} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar ..."
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
            </View>

            {renderContent()}

        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        paddingHorizontal: 20, 
        paddingTop: 10,
        backgroundColor: "#fff" 
    },
    
    title: { 
        fontSize: 24, 
        fontWeight: "bold",
        color: '#333', 
        textAlign: 'center', 
        marginTop: 10 
    },
    subtitle: { 
        fontSize: 14, 
        color: '#888',
        textAlign: 'center', 
        marginBottom: 20 
    },

    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#eee',
    },
    searchInput: { flex: 1, fontSize: 16 },

    card: {
        backgroundColor: '#E6F8F6', 
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
    },
    name: { 
        fontSize: 18, 
        fontWeight: "bold", 
        color: '#333', 
        marginBottom: 5,
    },
    address: {
        fontSize: 14,
        color: '#666',
    },
    accesible: { 
        color: "green", 
        marginTop: 5,
        fontWeight: '500', 
    },
    loadingIndicator: { marginTop: 50 },
    noDataContainer: { padding: 30, alignItems: 'center' },
    noDataText: { fontSize: 16, color: '#888', textAlign: 'center' }
});