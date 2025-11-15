import React, { useEffect, useRef, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, findNodeHandle, AccessibilityInfo } from "react-native";
import { useRouter } from "expo-router";
import CardButton from "@/components/CardButton";
import { GlobalStyles } from "@/constants/GlobalStyles";
import CustomButton from "@/components/CustomButton";
import Buscardor from "@/components/Buscador";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

export default function TipoRestaurantes() {
  const [tipos, setTipos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const allRestaurantsButtonRef = useRef(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}tipos_local/`)
      .then(res => res.json())
      .then(data => setTipos(data))
      .catch(err => console.error(err));
  }, []);

  const handleTypePress = (id: number) => {
    router.push(`/restaurantes/${id}`);
  };

  const handleAllRestaurants = () => {
    router.push(`/restaurantes/all`);
  };

  const filteredTipos = tipos.filter(item =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSkipList = () => {
    const nodeHandle = findNodeHandle(allRestaurantsButtonRef.current);
    if (nodeHandle) {
      setTimeout(() => {
        AccessibilityInfo.setAccessibilityFocus(nodeHandle);
      }, 100);
    }
  };

  return (
    <View
      style={GlobalStyles.container}
      accessibilityLabel="Pantalla de selección de tipos de restaurantes"
      accessibilityHint="Desliza hacia abajo o usa el rotor para navegar por los tipos de restaurantes disponibles."
    >
      <Text
        style={GlobalStyles.tittleMarginVertical}
        accessibilityElementsHidden={true}
        importantForAccessibility="no"
      >
        Tipo de Restaurantes
      </Text>
      <Text
        style={GlobalStyles.subtitle}
        accessibilityElementsHidden={true}
        importantForAccessibility="no"
      >
        Haga clic para más información
      </Text>

      <Buscardor
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Buscar tipos de restaurantes..."
        accessibilityLabel="Buscar tipos de restaurantes"
      />

      <TouchableOpacity
        onPress={handleSkipList}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Saltar lista de tipos de restaurantes"
        accessibilityHint="Salta directamente al botón Todos los restaurantes"
        style={{
          height: 1,
        }}
      >
        <Text>Saltar lista</Text>
      </TouchableOpacity>
      <FlatList
        data={filteredTipos}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        accessibilityRole="list"
        accessibilityLabel="Lista de tipos de restaurantes disponibles"
        renderItem={({ item }) => (
          <CardButton
            name={item.nombre}
            onPress={() => handleTypePress(item.id)}
            accessibilityHintText={"Toca para ver los diferentes locales del tipo" + item.nombre}
            width={"100%"}
          />
        )}
      />
      <View style={GlobalStyles.containerButton}>
        <CustomButton
          label="Todos los restaurantes"
          onPress={handleAllRestaurants}
          type="primary"
          accessibilityHint="Muestra todos los restaurantes"
          ref={allRestaurantsButtonRef}
        />
      </View>
    </View>
  );
}