import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import CardButton from "@/components/CardButton";
import { GlobalStyles } from "@/constants/GlobalStyles";
import CustomButton from "@/components/CustomButton";
import Buscardor from "@/components/Buscador";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

export default function TipoRestaurantes() {
  const [tipos, setTipos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch(`${BACKEND_URL}tipos_local/`)
      .then((res) => res.json())
      .then((data) => setTipos(data))
      .catch((err) => console.error(err));
  }, []);

  const handleTypePress = (id: number) => {
    router.push(`/restaurantes/${id}`);
  };

  const handleAllRestaurants = () => {
    router.push(`/restaurantes/all`);
  };

  const filteredTipos = tipos.filter((item) =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={GlobalStyles.container}
    >
      <FlatList
        data={filteredTipos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CardButton
            name={item.nombre}
            onPress={() => handleTypePress(item.id)}
            accessibilityHintText={
              "Toca para ver las diferentes categorías del menu " + item.nombre
            }
            width={"100%"}
          />
        )}
        ListHeaderComponent={
          <>
            <Text style={GlobalStyles.tittleCliente}>Tipo de Restaurantes</Text>
            <Text style={GlobalStyles.subtitle}>
              Haga clic para más información
            </Text>
            <Buscardor
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Buscar restaurantes..."
              accessibilityLabel="Buscar restaurantes"
            />
          </>
        }
        ListFooterComponent={
          <View style={GlobalStyles.containerButton}>
            <CustomButton
              label="Todos los restaurantes"
              onPress={handleAllRestaurants}
              type="primary"
              accessibilityHint="Muestra todos los restaurantes"
            />
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: Colors.background,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 20,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#eee",
  },
  searchInput: { flex: 1, fontSize: 16 },

  card: {
    backgroundColor: "#DCF0F0",
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  cardText: {
    fontSize: 18,
    color: "#242424",
    fontWeight: "600",
  },

  allRestaurantsButton: {
    backgroundColor: "#07bcb3",
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  allRestaurantsText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});
