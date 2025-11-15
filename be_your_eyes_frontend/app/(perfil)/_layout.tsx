// app/(local)/_layout.tsx  (ajusta la ruta si hace falta)
import Navbar from "@/components/NavBar";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/authContext";
import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivateLayout() {
    const { accessToken, logout } = useAuth();
    const router = useRouter();
    const segments = useSegments();

    // estado local para controlar el primer render / chequeo
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // Evitamos redirigir si ya estamos en la zona pública (ej: (auth) / login)
        const inAuthGroup = segments[0] === "login" || segments[0] === "register" || segments[0] === "registerLocal" || segments[0] === "registerPersona";


        // Si no hay token y no estamos en la zona pública, vamos al login
        if (accessToken === null && !inAuthGroup) {
            router.replace("/login");
            setReady(true);
            return;
        }

        // Si hay token seguimos y ocultamos loader
        if (accessToken) {
            setReady(true);
            return;
        }

        // Si accessToken es undefined (no inicializó todavía), seguimos mostrando loader
        // ready queda false hasta que tengamos un valor truthy o null
    }, [accessToken, segments, router]);

    // handler para logout desde la navbar (llama al contexto y fuerza navegación)
    const handleLogout = async () => {
        try {
            await logout(); // tu logout limpia tokens y llama al backend si corresponde
        } catch (e) {
            console.error("Logout error:", e);
        } finally {
            // Forzamos la navegación al login. El efecto anterior también reaccionará al cambio de token,
            // pero hacemos replace acá para que la navegación sea instantánea y consistente.
            router.replace("/login");
        }
    };

    // Mientras no esté listo, mostramos loader (evita parpadeos)
    if (!ready) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    // Si no hay token (ready true y accessToken null) no renderizamos nada
    // porque ya hicimos router.replace("/login") en el useEffect.
    if (!accessToken) return null;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]} edges={["top", "bottom"]}>
            {/* Navbar: le pasamos el handler de logout */}
            <Navbar onBack={() => router.back()} onLogout={handleLogout} showLogout />

            {/* Contenido hijo */}
            <Slot />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loader: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.background },
});
