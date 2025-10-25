import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons';

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

export default function TipoRestaurantes() {
  const [tipos, setTipos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch(`${BACKEND_URL}tipos_local/`)
      .then(res => res.json())
      .then(data => setTipos(data))
      .catch(err => console.error(err));
  }, []);

  const handleTypePress = (id) => {
    router.push(`/restaurantes/${id}`);
  };

  const handleAllRestaurants = () => {
    router.push(`/restaurantes/all`); 
  };

  const filteredTipos = tipos.filter(item =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Tipo de Restaurantes</Text>
      <Text style={styles.subtitle}>Haga clic para más información</Text>

      <View style={styles.searchBar}>
        <Feather name="search" size={20} color="#888" style={{ marginRight: 10 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <FlatList
        data={filteredTipos}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleTypePress(item.id)}
          >
            <Text style={styles.cardText}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }} 
        style={{ flexGrow: 0 }}
      />

      <TouchableOpacity
        style={styles.allRestaurantsButton}
        onPress={handleAllRestaurants}
      >
        <Text style={styles.allRestaurantsText}>Todos los restaurantes</Text>
      </TouchableOpacity>

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
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  cardText: { 
    fontSize: 18, 
    color: '#07bcb3', 
    fontWeight: '600' 
  },

  allRestaurantsButton: {
    backgroundColor: '#07bcb3', 
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  allRestaurantsText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});