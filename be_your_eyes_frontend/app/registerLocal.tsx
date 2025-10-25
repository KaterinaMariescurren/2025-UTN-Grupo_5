import CustomApertura from "@/components/CustomApertura";
import CustomButton from "@/components/CustomButton";
import CustomDropdown from "@/components/CustomDropdown";
import CustomInput from "@/components/CustomInput";
import CustomTimePicker from "@/components/CustomTimePicker";
import { Colors } from "@/constants/Colors";
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
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterLocalScreen() {
  /** ------------------ ESTADOS ------------------ **/
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Información local
  const [nombreLocal, setNombreLocal] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password2, setPassword2] = useState("");
  const [showPassword2, setShowPassword2] = useState(false);
  const [telefono, setTelefono] = useState("");

  // Dirección
  const [calle, setCalle] = useState("");
  const [numero, setNumero] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");

  // Horarios y tipos de local
  const [horarios, setHorarios] = useState<
    { dia: string; apertura: string; cierre: string }[]
  >([]);
  const [tiposLocales, setTiposLocales] = useState<{ id: number; nombre: string }[]>([]);
  const [tipoLocalSeleccionado, setTipoLocalSeleccionado] = useState<number | null>(null);

  // Modal horarios
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [diaTemp, setDiaTemp] = useState("");
  const [aperturaTemp, setAperturaTemp] = useState(new Date());
  const [cierreTemp, setCierreTemp] = useState(new Date());
  const [showApertura, setShowApertura] = useState(false);
  const [showCierre, setShowCierre] = useState(false);

  const { login } = useAuth();

  /** ------------------ HOOKS ------------------ **/
  useEffect(() => {
    fetch(`${process.env.EXPO_PUBLIC_API_URL}tipos_local`)
      .then((res) => res.json())
      .then((data) => setTiposLocales(data))
      .catch((err) => console.log("Error cargando tipos de local:", err));
  }, []);

  /** ------------------ FUNCIONES MODAL ------------------ **/
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
      }
      return [...prev, newHorario];
    });

    setModalVisible(false);
  };

  const deleteHorario = (index: number) => {
    setHorarios((prev) => prev.filter((_, i) => i !== index));
  };

  /** ------------------ FUNCIONES DE NAVEGACIÓN ------------------ **/
  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  /** ------------------ FUNCION PRINCIPAL: REGISTER ------------------ **/
  const handleRegister = async () => {
    // Validaciones básicas
    if (!nombreLocal.trim()) return Alert.alert("Error", "Ingresa el nombre del local");
    if (!email.trim()) return Alert.alert("Error", "Ingresa un correo electrónico");
    if (!password.trim()) return Alert.alert("Error", "Ingresa una contraseña");
    if (!calle.trim()) return Alert.alert("Error", "Ingresa la calle del local");
    if (!numero.trim()) return Alert.alert("Error", "Ingresa la altura del local");
    if (!codigoPostal.trim()) return Alert.alert("Error", "Ingresa el código postal");
    if (!telefono.trim()) return Alert.alert("Error", "Ingresa el teléfono");
    if (tipoLocalSeleccionado === null) return Alert.alert("Error", "Selecciona un tipo de local");
    if (horarios.length === 0) return Alert.alert("Error", "Agrega al menos un horario");

    for (let h of horarios) {
      if (!h.apertura || !h.cierre) {
        return Alert.alert("Error", `El horario del día ${h.dia} está incompleto`);
      }
    }

    try {
      setLoading(true);

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
        contrasenia: password,
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
  
  return (
    <View style={styles.container}>
      {step === 1 && (
        <View>
          {/* Título principal */}
          <View
            style={styles.titleContainer}
            accessible
            accessibilityRole="header"
            accessibilityLabel="El proceso de registro es rápido y sencillo. Solo necesitarás completar 3 pasos."
          >
            <Text style={styles.title}>
              El proceso de registro es rápido y sencillo,
            </Text>
            <Text style={styles.titleRed}>
              Solo necesitarás{"\n"} completar 3 pasos
            </Text>
          </View>

          {/* Pasos */}
          <View style={styles.pasosContainer}>
            {[
              "Información básica",
              "Tipo de local y horarios",
              "Dirección",
            ].map((texto, index) => (
              <View
                key={index}
                style={styles.pasoItem}
                accessible
                accessibilityRole="text"
                accessibilityLabel={`Paso ${index + 1}: ${texto}`}
              >
                <View style={styles.pasoNumeroContainer}>
                  <Text style={styles.pasoNumero}>{index + 1}</Text>
                </View>
                <Text style={styles.pasoTexto}>{texto}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      {step === 2 && (
        <View>
          <View style={styles.tituloStep}>
            <View
              style={styles.pasoItem}
              accessible
              accessibilityRole="text"
              accessibilityLabel={`Paso 1 Información básica`}
            >
              <View style={styles.pasoNumeroContainer}>
                <Text style={styles.pasoNumero}>1</Text>
              </View>
              <Text style={styles.pasoTexto}>Información básica</Text>
            </View>
          </View>
          <View style={styles.inputsContainer}>
            <CustomInput
              label="Nombre del local"
              value={nombreLocal}
              onChangeText={(text) => setNombreLocal(text)}
              placeholder="Nombre del local"
              keyboardType="default"
              accessibilityHint="Ingresa el nombre del local"
            />
            <CustomInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              placeholder="Contraseña"
              keyboardType="default"
              secureTextEntry={!showPassword}
              accessibilityHint="Ingresa la contraseña"
              rightIconName={showPassword ? "visibility" : "visibility-off"}
              rightIconAccessibilityLabel={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
              rightIconAccessibilityHint="Toca para alternar la visibilidad de la contraseña"
              onRightIconPress={() => setShowPassword(!showPassword)}
            />
            <CustomInput
              label="Contraseña"
              value={password2}
              onChangeText={setPassword2}
              placeholder="Contraseña"
              keyboardType="default"
              secureTextEntry={!showPassword2}
              accessibilityHint="Ingresa la contraseña"
              rightIconName={showPassword2 ? "visibility" : "visibility-off"}
              rightIconAccessibilityLabel={
                showPassword2 ? "Ocultar contraseña" : "Mostrar contraseña"
              }
              rightIconAccessibilityHint="Toca para alternar la visibilidad de la contraseña"
              onRightIconPress={() => setShowPassword2(!showPassword2)}
            />
            <CustomInput
              label="Email"
              value={email}
              onChangeText={(email) => setEmail(email)}
              placeholder="Email"
              keyboardType="email-address"
              accessibilityHint="Ingresa el email del local"
            />
            <CustomInput
              label="Telefono"
              value={telefono}
              onChangeText={(telefono) => setTelefono(telefono)}
              placeholder="Telefono"
              keyboardType="phone-pad"
              accessibilityHint="Ingresa el telefono del local"
            />
          </View>
        </View>
      )}
      {step === 3 && (
        <View>
          <View style={styles.tituloStep}>
            <View
              style={styles.pasoItem}
              accessible
              accessibilityRole="text"
              accessibilityLabel={`Paso 2 Tipo de local y horarios`}
            >
              <View style={styles.pasoNumeroContainer}>
                <Text style={styles.pasoNumero}>2</Text>
              </View>
              <Text style={styles.pasoTexto}>Tipo de local y horarios</Text>
            </View>
          </View>
          <View style={styles.inputsContainer}>
            <CustomDropdown
              label="Tipo de local"
              value={
                tipoLocalSeleccionado
                  ? tiposLocales.find((t) => t.id === tipoLocalSeleccionado)?.nombre || ""
                  : ""
              }
              placeholder="Selecciona tipo de local"
              options={tiposLocales.map((t) => t.nombre)}
              onSelect={(nombre) => {
                const seleccionado = tiposLocales.find((t) => t.nombre === nombre);
                if (seleccionado) setTipoLocalSeleccionado(seleccionado.id);
              }}
              accessibilityHint="Selecciona el tipo de local"
            />
          </View>
          <View style={styles.aperturaContainer}>
            <Text style={styles.pasoTexto}>Días y horarios</Text>

            {horarios.length === 0 ? (
              <Text></Text>
            ) : (
              horarios.map((h, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    marginTop: 8,
                  }}
                >
                  {/* Izquierda: Día y horario */}
                  <View style={{ flex: 1 }}>
                    <CustomApertura
                      fecha={h.dia}
                      horario_inicio={new Date(h.apertura).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                      horario_fin={new Date(h.cierre).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    />
                  </View>

                  {/* Derecha: Botones */}
                  <View
                    style={{
                      flexDirection: "row",
                      flex: 1,
                      gap: 8,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <CustomButton
                        label="Editar"
                        type="primary"
                        onPress={() => openModalForEdit(index)}
                        accessibilityHint="Abre el modal para editar este horario"
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <CustomButton
                        label="Borrar"
                        type="delete"
                        onPress={() => deleteHorario(index)}
                        accessibilityHint="Elimina este horario"
                      />
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>

          <CustomButton
            label="Agregar dia y horario"
            type="secondary"
            onPress={openModalForNew}
            accessibilityHint="Ingresa un dia y horario de apertura"
          />

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
                  width: "80%",
                  backgroundColor: "white",
                  paddingVertical: 40,
                  paddingHorizontal: 20,
                  borderRadius: 24,
                }}
              >
                <Text
                  style={styles.pasoTexto}
                >
                  {editingIndex !== null ? "Editar dia y horario" : "Agregar dia y horario"}
                </Text>

                {/* Picker de días */}
                <CustomDropdown
                  label="Dias de apertura"
                  value={diaTemp}
                  placeholder="Dia"
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
                  accessibilityHint="Selecciona un dia de apertura"
                />
                <CustomTimePicker
                  label="Hora de apertura"
                  value={aperturaTemp}
                  onChange={setAperturaTemp}
                />
                <CustomTimePicker
                  label="Hora de cierre"
                  value={cierreTemp}
                  onChange={setCierreTemp}
                />

                {/* Botones modal */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <CustomButton
                      label="Cancelar"
                      type="delete"
                      onPress={() => setModalVisible(false)} // <-- define esta función
                      accessibilityHint="Cancelar el dia y horario de apertura"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <CustomButton
                      label="Guardar"
                      type="primary"
                      onPress={saveHorario}
                      accessibilityHint="Guardar el dia y horario de apertura"
                    />
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}

      {step === 4 && (
        <View>
          <View style={styles.tituloStep}>
            <View
              style={styles.pasoItem}
              accessible
              accessibilityRole="text"
              accessibilityLabel={`Paso 3 Direccion`}
            >
              <View style={styles.pasoNumeroContainer}>
                <Text style={styles.pasoNumero}>3</Text>
              </View>
              <Text style={styles.pasoTexto}>Direccion</Text>
            </View>
          </View>
          <View style={styles.inputsContainer}>
            <CustomInput
              label="Calle"
              value={calle}
              onChangeText={(text) => setCalle(text)}
              placeholder="Calle del local"
              keyboardType="default"
              accessibilityHint="Ingresa la calle del local"
            />
            <CustomInput
              label="Altura "
              value={numero}
              onChangeText={(text) => setNumero(text)}
              placeholder="Altura del local"
              keyboardType="default"
              accessibilityHint="Ingresa la altura del local"
            />
            <CustomInput
              label="Codigo Postal"
              value={codigoPostal}
              onChangeText={(text) => setCodigoPostal(text)}
              placeholder="Codigo postal"
              keyboardType="default"
              accessibilityHint="Ingresa tu codigo postal"
            />
          </View>

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
        <CustomButton
          label={step < 4 ? "Siguiente" : "Registrar"}
          type="primary"
          onPress={step < 4 ? handleNext : handleRegister}
          accessibilityHint="Siguiente"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "flex-start",
    marginTop: 50,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 72,
  },
  title: {
    fontSize: 27,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
    marginTop: 4,
  },
  titleRed: {
    fontSize: 27,
    fontWeight: "600",
    color: Colors.cta,
    textAlign: "center",
    marginTop: 4,
  },
  pasosContainer: {
    marginHorizontal: 20,
    gap: 30,
    marginBottom: 72,
  },
  pasoItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  pasoNumeroContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  pasoNumero: { color: Colors.text, fontWeight: "700", fontSize: 20 },
  pasoTexto: { fontSize: 20, fontWeight: "700", color: Colors.text, flexShrink: 1 },
  tituloStep: {
    flex: 1,
    alignItems: "center",
    marginBottom: 45
  },
  inputsContainer: {
    width: "100%",
    marginTop: 45,
    marginBottom: 45,
  },
  aperturaContainer: {
    borderTopWidth: 1,
    borderTopColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingVertical: 10,
    alignItems: "center",
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
