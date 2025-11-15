import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { useApi } from "@/utils/api";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface PuntoImpresion {
  id: number;
  nombre: string;
  direccion_texto: string;
  horario: string | null;
  lat: number;
  lng: number;
}

export default function GestionarPuntosImpresionScreen() {
  const [puntos, setPuntos] = useState<PuntoImpresion[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPunto, setEditingPunto] = useState<PuntoImpresion | null>(null);
  
  // Form states
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [horario, setHorario] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const { apiFetch } = useApi();

  const fetchPuntos = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(
        `${process.env.EXPO_PUBLIC_API_URL}puntos-impresion/`
      );
      const data = await response.json();
      setPuntos(data);
    } catch (error) {
      console.error("Error al cargar puntos:", error);
      Alert.alert("Error", "No se pudieron cargar los puntos de impresión.");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingPunto(null);
    setNombre("");
    setDireccion("");
    setHorario("");
    setLat("");
    setLng("");
    setModalVisible(true);
  };

  const openEditModal = (punto: PuntoImpresion) => {
    setEditingPunto(punto);
    setNombre(punto.nombre);
    setDireccion(punto.direccion_texto);
    setHorario(punto.horario || "");
    setLat(punto.lat.toString());
    setLng(punto.lng.toString());
    setModalVisible(true);
  };

  const validateForm = () => {
    if (!nombre.trim()) {
      Alert.alert("Error", "El nombre es obligatorio");
      return false;
    }
    if (!direccion.trim()) {
      Alert.alert("Error", "La dirección es obligatoria");
      return false;
    }
    if (!lat.trim() || isNaN(Number(lat))) {
      Alert.alert("Error", "La latitud debe ser un número válido");
      return false;
    }
    if (!lng.trim() || isNaN(Number(lng))) {
      Alert.alert("Error", "La longitud debe ser un número válido");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const body = {
      nombre: nombre.trim(),
      direccion_texto: direccion.trim(),
      horario: horario.trim() || null,
      lat: Number(lat),
      lng: Number(lng),
    };

    try {
      if (editingPunto) {
        // Actualizar
        await apiFetch(
          `${process.env.EXPO_PUBLIC_API_URL}puntos-impresion/${editingPunto.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
        Alert.alert("Éxito", "Punto actualizado correctamente");
      } else {
        // Crear
        await apiFetch(
          `${process.env.EXPO_PUBLIC_API_URL}puntos-impresion/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
        Alert.alert("Éxito", "Punto creado correctamente");
      }
      setModalVisible(false);
      fetchPuntos();
    } catch (error) {
      console.error("Error al guardar:", error);
      Alert.alert("Error", "No se pudo guardar el punto de impresión");
    }
  };

  const handleDelete = (id: number, nombre: string) => {
    Alert.alert(
      "Eliminar punto",
      `¿Estás seguro de eliminar "${nombre}"? Esta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await apiFetch(
                `${process.env.EXPO_PUBLIC_API_URL}puntos-impresion/${id}`,
                { method: "DELETE" }
              );
              Alert.alert("Éxito", "Punto eliminado correctamente");
              fetchPuntos();
            } catch (error) {
              console.error("Error al eliminar:", error);
              Alert.alert("Error", "No se pudo eliminar el punto");
            }
          },
        },
      ]
    );
  };

  const buscarCoordenadas = () => {
    Alert.alert(
      "Buscar coordenadas",
      "Para obtener las coordenadas:\n\n1. Abre Google Maps en tu navegador\n2. Busca la dirección\n3. Click derecho en el marcador\n4. Copia las coordenadas\n5. Pégalas aquí",
      [{ text: "Entendido" }]
    );
  };

  useEffect(() => {
    fetchPuntos();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#50C2C9" />
        <Text 
          style={styles.loadingText}
          accessible
          accessibilityLabel="Cargando puntos de impresión"
        >
          Cargando...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container} accessible>
      <Text
        style={styles.title}
        accessible
        accessibilityLabel="Gestionar puntos de impresión en braille"
        accessibilityRole="header"
      >
        Gestionar Puntos de Impresión
      </Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={openCreateModal}
        accessible
        accessibilityLabel="Agregar nuevo punto de impresión"
        accessibilityHint="Abre el formulario para crear un nuevo punto"
      >
        <Feather name="plus" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Agregar Nuevo Punto</Text>
      </TouchableOpacity>

      <FlatList
        data={puntos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={styles.card}
            accessible
            accessibilityLabel={`Punto de impresión: ${item.nombre}, ubicado en ${item.direccion_texto}`}
          >
            <View style={styles.cardContent}>
              <Text style={styles.puntoNombre}>{item.nombre}</Text>
              <Text style={styles.puntoDireccion}>{item.direccion_texto}</Text>
              {item.horario && (
                <View style={styles.horarioContainer}>
                  <Feather name="clock" size={14} color="#666" />
                  <Text style={styles.puntoHorario}>{item.horario}</Text>
                </View>
              )}
              <Text style={styles.coordenadas}>
                📍 {item.lat.toFixed(4)}, {item.lng.toFixed(4)}
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => openEditModal(item)}
                style={[styles.button, { backgroundColor: "#FFB703" }]}
                accessible
                accessibilityLabel={`Editar punto ${item.nombre}`}
                accessibilityHint="Abre el formulario de edición"
              >
                <Feather name="edit" size={18} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDelete(item.id, item.nombre)}
                style={[styles.button, { backgroundColor: "#E63946" }]}
                accessible
                accessibilityLabel={`Eliminar punto ${item.nombre}`}
                accessibilityHint="Elimina permanentemente este punto"
              >
                <Feather name="trash-2" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text
            style={styles.emptyText}
            accessible
            accessibilityLabel="No hay puntos de impresión registrados"
          >
            No hay puntos de impresión registrados.
          </Text>
        }
      />

      {/* Modal de Crear/Editar */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
        accessible
        accessibilityLabel={editingPunto ? "Formulario de edición de punto" : "Formulario de nuevo punto"}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text
                style={styles.modalTitle}
                accessible
                accessibilityRole="header"
                accessibilityLabel={
                  editingPunto
                    ? "Editar punto de impresión"
                    : "Crear nuevo punto de impresión"
                }
              >
                {editingPunto ? "Editar Punto" : "Nuevo Punto"}
              </Text>

              <Text style={styles.label}>Nombre *</Text>
              <TextInput
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Ej: Biblioteca Argentina para Ciegos"
                placeholderTextColor="#999"
                accessible
                accessibilityLabel="Campo nombre del punto, obligatorio"
                accessibilityHint="Ingresa el nombre del punto de impresión"
              />

              <Text style={styles.label}>Dirección *</Text>
              <TextInput
                style={styles.input}
                value={direccion}
                onChangeText={setDireccion}
                placeholder="Ej: Lezica 3909, CABA, Buenos Aires"
                placeholderTextColor="#999"
                accessible
                accessibilityLabel="Campo dirección, obligatorio"
                accessibilityHint="Ingresa la dirección completa"
              />

              <Text style={styles.label}>Horario (opcional)</Text>
              <TextInput
                style={styles.input}
                value={horario}
                onChangeText={setHorario}
                placeholder="Ej: Lun a Vie: 9:00 - 17:00"
                placeholderTextColor="#999"
                accessible
                accessibilityLabel="Campo horario, opcional"
                accessibilityHint="Ingresa el horario de atención"
              />

              <View style={styles.coordenadasHeader}>
                <Text style={styles.label}>Coordenadas *</Text>
                <TouchableOpacity
                  onPress={buscarCoordenadas}
                  accessible
                  accessibilityLabel="Ayuda para obtener coordenadas"
                  accessibilityHint="Muestra instrucciones para buscar coordenadas en Google Maps"
                >
                  <Feather name="help-circle" size={20} color="#50C2C9" />
                </TouchableOpacity>
              </View>

              <View style={styles.coordenadasRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sublabel}>Latitud</Text>
                  <TextInput
                    style={styles.input}
                    value={lat}
                    onChangeText={setLat}
                    placeholder="-34.5654"
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                    accessible
                    accessibilityLabel="Campo latitud, obligatorio"
                    accessibilityHint="Ingresa la latitud en formato decimal"
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.sublabel}>Longitud</Text>
                  <TextInput
                    style={styles.input}
                    value={lng}
                    onChangeText={setLng}
                    placeholder="-58.4890"
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                    accessible
                    accessibilityLabel="Campo longitud, obligatorio"
                    accessibilityHint="Ingresa la longitud en formato decimal"
                  />
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                  accessible
                  accessibilityLabel="Cancelar"
                  accessibilityHint="Cierra el formulario sin guardar cambios"
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSave}
                  accessible
                  accessibilityLabel={
                    editingPunto ? "Guardar cambios" : "Crear punto"
                  }
                  accessibilityHint={
                    editingPunto
                      ? "Guarda las modificaciones del punto"
                      : "Crea el nuevo punto de impresión"
                  }
                >
                  <Text style={styles.saveButtonText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: Colors.text,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#50C2C9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  card: {
    backgroundColor: Colors.secondary,
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardContent: {
    flex: 1,
    marginRight: 10,
  },
  puntoNombre: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  puntoDireccion: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  horarioContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 4,
  },
  puntoHorario: {
    fontSize: 13,
    color: "#666",
  },
  coordenadas: {
    fontSize: 12,
    color: "#999",
    marginTop: 6,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#8E9A9D",
    marginTop: 20,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  sublabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#666",
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: "#000",
  },
  coordenadasHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  coordenadasRow: {
    flexDirection: "row",
    gap: 10,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#E0E0E0",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#50C2C9",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});