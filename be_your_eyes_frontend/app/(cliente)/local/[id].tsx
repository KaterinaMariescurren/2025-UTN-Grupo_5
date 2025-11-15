import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
  findNodeHandle,
  AccessibilityInfo,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { GlobalStyles } from "@/constants/GlobalStyles";
import { Colors } from "@/constants/Colors";
import CardButton from "@/components/CardButton";
import CustomButton from "@/components/CustomButton";

import { useApi } from "@/utils/api";
import { useAuth } from "@/contexts/authContext";

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
  const { apiFetch } = useApi();
  const { accessToken } = useAuth();

  const notificarRef = useRef(null);
  const menusRef = useRef(null);


  useEffect(() => {
    if (!id) return;
    setLoading(true);

    apiFetch(`${BACKEND_URL}locales/${id}`)
      .then((res) => res.json())
      .then((data) => setLocal(data as Local))
      .catch((err) => console.error(err));

    apiFetch(`${BACKEND_URL}menus/local/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const menuData = Array.isArray(data)
          ? data
          : Array.isArray(data.menus)
            ? data.menus
            : [];
        setMenus(menuData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const notificarCumplimiento = async (cumple: boolean) => {
    setShowModal(false);

    if (!accessToken) {
      Alert.alert(
        "Error",
        "Debes iniciar sesión para notificar el cumplimiento."
      );
      return;
    }

    try {
      const response = await apiFetch(`${BACKEND_URL}me/tipo`);
      const data = await response.json();

      await apiFetch(`${BACKEND_URL}notificaciones/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona_id: data.id,
          local_id: parseInt(id as string),
          tiene_carta: cumple,
        }),
      });
    } catch (error) {
      Alert.alert("Error", "No se pudo enviar la notificación.");
    }
  };

  const handleSkipList = () => {
    const nodeHandle = findNodeHandle(notificarRef.current);
    if (nodeHandle) {
      setTimeout(() => {
        AccessibilityInfo.setAccessibilityFocus(nodeHandle);
      }, 100);
    }
  };

  const handleSkipListHorarios = () => {
    const nodeHandle = findNodeHandle(menusRef.current);
    if (nodeHandle) {
      setTimeout(() => {
        AccessibilityInfo.setAccessibilityFocus(nodeHandle);
      }, 100);
    }
  };

  if (loading || !local)
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando detalle del local...</Text>
      </View>
    );

  return (
    <View
      style={GlobalStyles.container}
      accessibilityLabel={"Pantalla informativa del local " + local.nombre}
      accessibilityHint={"Desliza hacia abajo o usa el rotor para navegar por toda la informacion del local " + local.nombre}
    >
      <Text
        style={GlobalStyles.tittle}
        accessibilityElementsHidden={true}
        importantForAccessibility="no"
      >
        {local.nombre}
      </Text>

      <Text
        style={GlobalStyles.tittleMarginVertical}
        accessibilityElementsHidden={true}
        importantForAccessibility="no"
      >
        Horarios
      </Text>

      <TouchableOpacity
        onPress={handleSkipListHorarios}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Saltar lista de Horarios"
        accessibilityHint="Salta directamente a la lista de Menús"
        style={{
          height: 1,
        }}
      >
        <Text>Saltar lista</Text>
      </TouchableOpacity>

      <View style={{ marginBottom: 15 }}>
        <FlatList
          data={Array.isArray(local.horarios) ? local.horarios : []}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          accessibilityRole="list"
          accessibilityLabel={`Lista de horarios del local ${local.nombre}`}
          scrollEnabled={false} // evita que haya scroll dentro de la lista
          ListEmptyComponent={
            <Text
              style={styles.horarioText}
              accessible
              accessibilityRole="text"
              accessibilityLabel="Horarios no disponibles"
            >
              Horarios no disponibles
            </Text>
          }
          renderItem={({ item }) => (
            <Text
              style={styles.horarioText}
              accessible
              accessibilityRole="text"
              accessibilityLabel={`${item.dia}: de ${item.horario_apertura?.substring(0, 5)} a ${item.horario_cierre?.substring(0, 5)}`}
            >
              {item.dia}: {item.horario_apertura?.substring(0, 5)}hs a{" "}
              {item.horario_cierre?.substring(0, 5)}hs
            </Text>
          )}
        />
      </View>


      <View style={styles.containerMenus}>
        <Text
          style={styles.sectionTitle}
          accessibilityElementsHidden={true}
          importantForAccessibility="no"
        >
          Menús
        </Text>
        <Text
          style={GlobalStyles.subtitle}
          accessibilityElementsHidden={true}
          importantForAccessibility="no"
        >
          Haga clic para más información
        </Text>

        <TouchableOpacity
          onPress={handleSkipList}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Saltar lista de Menús"
          accessibilityHint="Salta directamente al botón notificar cumplimiento"
          style={{
            height: 1,
          }}
        >
          <Text>Saltar lista</Text>
        </TouchableOpacity>

        <FlatList
          data={menus}
          showsVerticalScrollIndicator={false}
          accessibilityRole="list"
          accessibilityLabel={`Lista de Menús del local ${local.nombre}`}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CardButton
              name={item.nombre}
              onPress={() => router.push(`/menu/${item.id}`)}
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
          accessibilityHint={`Abre una ventana para notificar si el local ${local.nombre} cumple con tener menú accesible`}
          ref={notificarRef}
        />
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)} // 🔹 cierra con botón “Atrás”
        accessible
        accessibilityViewIsModal
      >
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPressOut={() => setShowModal(false)} // 🔹 cierra al tocar fuera
          accessibilityHint="Selecciona una de las opciones para continuar o toca fuera de la ventana para cerrarla"
          accessibilityLabel="Cerrar la ventana de confirmación de notificación de cumplimiento"
        >
          <View
            style={styles.modalContainer}
            accessibilityLabel="Ventana de confirmación de notificación de cumplimiento"
          >
            <Text
              style={styles.modalTitle}
            >
              Notificar cumplimiento
            </Text>

            <Text
              style={styles.modalQuestion}
              accessible
              accessibilityRole="text"
            >
              ¿El local {local.nombre} cumple con tener el menú en braille y/o el QR?
            </Text>

            <View style={GlobalStyles.containerButton}>
              <CustomButton
                label="Cumple"
                onPress={() => notificarCumplimiento(true)}
                type="primary"
                accessibilityHint={`Notificar que el local ${local.nombre} tiene el menú en braille y/o el QR`}
              />
              <CustomButton
                label="Cancelar"
                onPress={() => notificarCumplimiento(false)}
                type="secondary"
                accessibilityHint={`Notificar que el local ${local.nombre} no tiene el menú en braille y/o el QR`}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 16, color: "#555" },
  sectionTitle: {
    paddingTop: 16,
    fontSize: 27,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  horarioText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: 500,
    textAlign: "center",
    lineHeight: 24,
  },
  containerMenus: {
    height: "60%",
    marginBottom: 20,
    borderTopColor: Colors.text,
    borderTopWidth: 2,
    borderBottomColor: Colors.text,
    borderBottomWidth: 2,
  },
  menuName: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 17,
    backgroundColor: "rgba(0,0,0,0.2)", // Fondo con blur leve
  },
  modalContainer: {
    backgroundColor: Colors.background,
    borderRadius: 24,
    paddingVertical: 44,
  },
  modalTitle: {
    fontFamily: "Poppins",
    fontWeight: "700",
    fontSize: 27,
    color: "#273431",
    textAlign: "center",
    marginBottom: 32,
  },
  modalQuestion: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: 20,
    color: "#242424",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
});
