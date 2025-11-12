import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { GlobalStyles } from "@/constants/GlobalStyles";
import Buscardor from "@/components/Buscador";
import CardLocal from "@/components/CardLocal";
import CardButton from "@/components/CardButton";
import { useApi } from "@/utils/api";

export interface Direccion {
    id: number;
    altura: string;
    calle: string;
    codigo_postal: string;
}

export interface LocalItem {
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
    const {apiFetch} = useApi();

    useEffect(() => {
        if (!tipoId) return;

        setLoading(true);

        apiFetch(`${BACKEND_URL}tipos_local/${tipoId}`)
            .then(res => res.json())
            .then(data => setNombreTipo(data.nombre || "Tipo Desconocido"))
            .catch(err => {
                console.error("Error al cargar el nombre del tipo:", err);
                setNombreTipo("Tipo Desconocido");
            });
            
        apiFetch(`${BACKEND_URL}locales/buscar/?tipo_local_id=${tipoId}`)
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
                    <CardButton
                        name={item.nombre}
                        address={`${item.direccion.calle} ${item.direccion.altura}`}
                        tieneMenuAccesible={item.tiene_menu_accesible}
                        onPress={() => router.push(`/local/${item.id}`)}
                        accessibilityHintText=""
                        width={"100%"}
                    />
                )}
            />
        );
    };

    return (
        <View style={GlobalStyles.container}>

            <Text style={GlobalStyles.tittleCliente}>{nombreTipo}</Text>
            <Text style={GlobalStyles.subtitle}>Haga clic para más información</Text>

            <Buscardor
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder="Buscar restaurantes..."
                accessibilityLabel="Buscar restaurantes"
            />

            {renderContent()}

        </View>
    );
}

const styles = StyleSheet.create({
    loadingIndicator: { marginTop: 50 },
    noDataContainer: { padding: 30, alignItems: 'center' },
    noDataText: { fontSize: 16, color: '#888', textAlign: 'center' }
});