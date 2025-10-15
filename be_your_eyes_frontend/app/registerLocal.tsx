import { useAuth } from "@/contexts/authContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterLocalScreen() {
  const [nombreLocal, setNombreLocal] = useState("");
  const [email, setEmail] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [calle, setCalle] = useState("");
  const [numero, setNumero] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [telefono, setTelefono] = useState("");
  const [loading, setLoading] = useState(false);
  const [horarios, setHorarios] = useState<
    { dia: string; apertura: string; cierre: string }[]
  >([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [diaTemp, setDiaTemp] = useState("Lunes");
  const [aperturaTemp, setAperturaTemp] = useState(new Date());
  const [cierreTemp, setCierreTemp] = useState(new Date());
  const [showApertura, setShowApertura] = useState(false);
  const [showCierre, setShowCierre] = useState(false);
  const [tiposLocales, setTiposLocales] = useState<
    { id: number; nombre: string }[]
  >([]);
  const [tipoLocalSeleccionado, setTipoLocalSeleccionado] = useState<
    number | null
  >(null);

  useEffect(() => {
    // Traer tipos de local desde backend
    fetch(`${process.env.EXPO_PUBLIC_API_URL}tipos_local`)
      .then((res) => res.json())
      .then((data) => setTiposLocales(data))
      .catch((err) => console.log("Error cargando tipos de local:", err));
  }, []);

  const openModalForNew = () => {
    setEditingIndex(null);
    setDiaTemp("Lunes");
    setAperturaTemp(new Date());
    setCierreTemp(new Date());
    setModalVisible(true);
  };

  const openModalForEdit = (index: number) => {
    const h = horarios[index];
    setEditingIndex(index);
    setDiaTemp(h.dia);
    setAperturaTemp(new Date(h.apertura));
    setCierreTemp(new Date(h.cierre));
    setModalVisible(true);
  };

  const saveHorario = () => {
    const newHorario = {
      dia: diaTemp,
      apertura: aperturaTemp.toISOString(),
      cierre: cierreTemp.toISOString(),
    };

    setHorarios((prev) => {
      if (editingIndex !== null) {
        const copy = [...prev];
        copy[editingIndex] = newHorario;
        return copy;
      } else {
        return [...prev, newHorario];
      }
    });

    setModalVisible(false);
  };

  const deleteHorario = (index: number) => {
    setHorarios((prev) => prev.filter((_, i) => i !== index));
  };

  const { login } = useAuth();
  const handleRegister = async () => {
    // Validación básica de campos obligatorios
    if (!nombreLocal.trim()) {
      Alert.alert("Error", "Ingresa el nombre del local");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Error", "Ingresa un correo electrónico");
      return;
    }
    if (!contrasenia.trim()) {
      Alert.alert("Error", "Ingresa una contraseña");
      return;
    }
    if (!calle.trim()) {
      Alert.alert("Error", "Ingresa la calle del local");
      return;
    }
    if (!numero.trim()) {
      Alert.alert("Error", "Ingresa la altura del local");
      return;
    }
    if (!codigoPostal.trim()) {
      Alert.alert("Error", "Ingresa el código postal");
      return;
    }
    if (!telefono.trim()) {
      Alert.alert("Error", "Ingresa el teléfono");
      return;
    }
    if (tipoLocalSeleccionado === null) {
      Alert.alert("Error", "Selecciona un tipo de local");
      return;
    }
    if (horarios.length === 0) {
      Alert.alert("Error", "Agrega al menos un horario");
      return;
    }
    // Validar que cada horario tenga apertura y cierre
    for (let h of horarios) {
      if (!h.apertura || !h.cierre) {
        Alert.alert("Error", `El horario del día ${h.dia} está incompleto`);
        return;
      }
    }

    try {
      setLoading(true);

      // Ajustar horarios para el backend
      const horariosBackend = horarios.map((h) => ({
        dia: h.dia,
        horario_apertura: new Date(h.apertura).toLocaleTimeString("es-AR", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        }),
        horario_cierre: new Date(h.cierre).toLocaleTimeString("es-AR", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      const body = {
        email,
        contrasenia,
        tipo: "local",
        local: {
          nombre: nombreLocal,
          telefono,
          tipo_local_id: tipoLocalSeleccionado,
          direccion: {
            calle,
            altura: numero,
            codigo_postal: codigoPostal,
          },
          horarios: horariosBackend,
        },
      };

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error en el registro");
      }

      const resp = await response.json();
      login(resp.access_token);
      router.replace("/(local)");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  const [step, setStep] = useState(1);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);
  return (
    <View style={styles.container}>
      {step === 1 && (
        <View>
          <Text style={styles.title}>
            El proceso de registro es rápido y sencillo.{" "}
          </Text>
          <Text style={styles.subtitle}>
            {" "}
            Solo necesitarás completar 3 pasos.
          </Text>
          <View style={styles.pasosContainer}>
            <Text style={styles.pasos}>1: Información básica del local</Text>
            <Text style={styles.pasos}>2: Tipo de local y horarios</Text>
            <Text style={styles.pasos}>3: Direccion</Text>
          </View>
        </View>
      )}

      {step === 2 && (
        <View style={{ marginBottom: 50 }}>
          <Text style={styles.pasoText}>
            Paso 1: Información básica del local
          </Text>
          <TextInput
            style={styles.input}
            value={nombreLocal}
            onChangeText={(text) => setNombreLocal(text)}
            placeholder="Nombre del local"
            placeholderTextColor={"#273431"}
          />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder="Correo electronico"
            placeholderTextColor={"#273431"}
          />
          <TextInput
            style={styles.input}
            value={contrasenia}
            onChangeText={(text) => setContrasenia(text)}
            placeholder="Contraseña"
            secureTextEntry
            placeholderTextColor={"#273431"}
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            value={telefono}
            onChangeText={(text) => setTelefono(text)}
            keyboardType="phone-pad"
            placeholderTextColor={"#273431"}
          />
        </View>
      )}

      {step === 3 && (
        <View style={{ marginBottom: 50 }}>
          <Text style={styles.pasoText}>Paso 2: Dirección</Text>
          <TextInput
            style={styles.input}
            placeholder="Calle"
            value={calle}
            onChangeText={(text) => setCalle(text)}
            placeholderTextColor={"#273431"}
          />
          <TextInput
            style={styles.input}
            placeholder="Altura"
            value={numero}
            onChangeText={(text) => setNumero(text)}
            keyboardType="numeric"
            placeholderTextColor={"#273431"}
          />
          <TextInput
            style={styles.input}
            placeholder="Código postal"
            value={codigoPostal}
            onChangeText={(text) => setCodigoPostal(text)}
            keyboardType="numeric"
            placeholderTextColor={"#273431"}
          />
        </View>
      )}

      {step === 4 && (
        <View style={{ marginBottom: 0 }}>
          <Text style={styles.pasoText}>Paso 3: Tipo de local y horarios</Text>
          <View
            style={[
              styles.input,
              { justifyContent: "center", paddingHorizontal: 15 },
            ]}
          >
            <Picker
              selectedValue={tipoLocalSeleccionado}
              onValueChange={(val) => setTipoLocalSeleccionado(val)}
              style={{ color: "#273431" }} // opcional, para el color del texto
              dropdownIconColor="#273431" // en Android
            >
              <Picker.Item label="Tipo de local" value={null} />
              {tiposLocales.map((t) => (
                <Picker.Item key={t.id} label={t.nombre} value={t.id} />
              ))}
            </Picker>
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#273431",
              marginBottom: 10,
              marginTop: 20,
            }}
          >
            Horarios:
          </Text>

          {horarios.length === 0 && (
            <Text
              style={{
                textAlign: "center",
                marginBottom: 15,
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              No hay horarios agregados.
            </Text>
          )}

          {horarios.map((h, i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginVertical: 5,
              }}
            >
              {/* Texto del horario a la izquierda */}
              <Text
                style={{
                  flex: 1,
                  fontSize: 16,
                  fontWeight: "500",
                  color: "#273431",
                }}
              >
                {h.dia}: {new Date(h.apertura).toLocaleTimeString()} -{" "}
                {new Date(h.cierre).toLocaleTimeString()}
              </Text>

              {/* Contenedor de botones a la derecha */}
              <View
                style={{
                  flexDirection: "row",
                  marginLeft: 10,
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => openModalForEdit(i)}
                  style={[
                    styles.smallButton,
                    {
                      backgroundColor: "#BFEAE4",
                      paddingVertical: 10,
                      paddingHorizontal: 16,
                      minHeight: 40, // misma altura para todos
                      justifyContent: "center",
                    },
                  ]}
                >
                  <Text style={[styles.smallButtonText, { fontSize: 16 }]}>
                    Editar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => deleteHorario(i)}
                  style={[
                    styles.smallButton,
                    {
                      backgroundColor: "#F28B82",
                      paddingVertical: 10,
                      paddingHorizontal: 16,
                      minHeight: 40,
                      justifyContent: "center",
                      marginLeft: 8, // espacio entre botones
                    },
                  ]}
                >
                  <Text style={[styles.smallButtonText, { fontSize: 16 }]}>
                    Borrar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity
            onPress={openModalForNew}
            style={{ ...styles.button, flex: undefined, width: "100%", marginTop: 20, height: 55, marginBottom: 40 }}
          >
            <Text style={{ ...styles.buttonText, fontSize: 18}}>Agregar horario</Text>
          </TouchableOpacity>

          {/* Modal */}
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
                  width: 300,
                  backgroundColor: "white",
                  padding: 20,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{ fontWeight: "bold", marginBottom: 10, fontSize: 20 }}
                >
                  {editingIndex !== null ? "Editar Horario" : "Nuevo Horario"}
                </Text>

                {/* Picker de días */}
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "semibold",
                    marginBottom: 10,
                  }}
                >
                  Día:
                </Text>
                <View
                  style={[
                    styles.input,
                    {
                      justifyContent: "center",
                      paddingHorizontal: 15,
                      height: 40,
                    },
                  ]}
                >
                  <Picker
                    selectedValue={diaTemp}
                    onValueChange={setDiaTemp}
                    style={{ color: "#273431", width: "100%" }}
                    dropdownIconColor="#273431"
                  >
                    {[
                      "Lunes",
                      "Martes",
                      "Miércoles",
                      "Jueves",
                      "Viernes",
                      "Sábado",
                      "Domingo",
                    ].map((d) => (
                      <Picker.Item key={d} label={d} value={d} />
                    ))}
                  </Picker>
                </View>

                {/* Hora de apertura */}
                <Text>Hora de apertura:</Text>
                <TouchableOpacity
                  onPress={() => setShowApertura(true)}
                  style={styles.timeButton}
                >
                  <Text style={styles.timeButtonText}>
                    {aperturaTemp.toLocaleTimeString()}
                  </Text>
                </TouchableOpacity>
                {showApertura && (
                  <DateTimePicker
                    value={aperturaTemp}
                    mode="time"
                    display="default"
                    onChange={(e, date) => {
                      setShowApertura(false);
                      if (date) setAperturaTemp(date);
                    }}
                  />
                )}

                {/* Hora de cierre */}
                <Text style={{ marginTop: 10 }}>Hora de cierre:</Text>
                <TouchableOpacity
                  onPress={() => setShowCierre(true)}
                  style={styles.timeButton}
                >
                  <Text style={styles.timeButtonText}>
                    {cierreTemp.toLocaleTimeString()}
                  </Text>
                </TouchableOpacity>
                {showCierre && (
                  <DateTimePicker
                    value={cierreTemp}
                    mode="time"
                    display="default"
                    onChange={(e, date) => {
                      setShowCierre(false);
                      if (date) setCierreTemp(date);
                    }}
                  />
                )}

                {/* Botones modal */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 20,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={[styles.modalButton, { backgroundColor: "#F28B82" }]}
                  >
                    <Text style={styles.modalButtonText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={saveHorario}
                    style={[styles.modalButton, { backgroundColor: "#BFEAE4" }]}
                  >
                    <Text style={styles.modalButtonText}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}

      <View style={{ flexDirection: "row", marginTop: 20, gap: 10 }}>
        {step > 1 && (
          <TouchableOpacity
            style={{ ...styles.button, flex: 1 }}
            onPress={handleBack}
          >
            <Text style={styles.buttonText}>Atrás</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={{ ...styles.button, flex: 1 }}
          onPress={step < 4 ? handleNext : handleRegister}
        >
          <Text style={styles.buttonText}>
            {step < 4 ? "Siguiente" : "Registrar"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFFFFF" },
  title: {
    fontSize: 27,
    marginBottom: 26,
    marginHorizontal: 72,
    color: "#273431",
    fontWeight: 700,
    marginTop: 150,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 27,
    fontWeight: 600,
    color: "#03A8B2",
    marginBottom: 43,
    textAlign: "center",
  },
  button: {
    flex: 1,
    backgroundColor: "#BFEAE4",
    padding: 15,
    borderRadius: 8,
    marginBottom: 76,
    alignItems: "center",
    height: 65,
    justifyContent: "center",
  },
  buttonText: { color: "#0E0202", fontWeight: 600, fontSize: 25 },
  pasosContainer: { marginHorizontal: 45, gap: 8, marginBottom: 129 },
  pasos: { fontSize: 24, fontWeight: 600, color: "#273431", marginBottom: 19 },
  pasoText: {
    marginTop: 150,
    fontSize: 24,
    fontWeight: 600,
    color: "#273431",
    marginBottom: 118,
  },
  input: {
    backgroundColor: "#BFEAE4",
    borderWidth: 1,
    borderColor: "#BDC3C7",
    borderRadius: 0,
    marginBottom: 34,
    padding: 15,
    height: 60,
    width: "90%",
    alignSelf: "center",
  },
  timeButton: {
    backgroundColor: "#BFEAE4",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  timeButtonText: {
    color: "#273431",
    fontSize: 16,
    fontWeight: "500",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  modalButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0E0202",
  },
  smallButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  smallButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0E0202",
  },
});
