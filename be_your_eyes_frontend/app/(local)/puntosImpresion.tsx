import { GlobalStyles } from "@/constants/GlobalStyles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Linking,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

type PuntoImpresion = {
  id: number;
  nombre: string;
  direccion_texto: string;
  horario: string | null;
  lat: number;
  lng: number;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const BOTTOM_SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.6;
const BOTTOM_SHEET_MIN_HEIGHT = 100;

export default function PuntosImpresionScreen() {
  const router = useRouter();
  const [puntos, setPuntos] = useState<PuntoImpresion[]>([]);
  const [puntosFiltrados, setPuntosFiltrados] = useState<PuntoImpresion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const animatedHeight = useRef(new Animated.Value(BOTTOM_SHEET_MIN_HEIGHT)).current;
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    fetchPuntos();
  }, []);

  useEffect(() => {
    if (searchText.trim() === "") {
      setPuntosFiltrados(puntos);
    } else {
      const filtered = puntos.filter(
        (punto) =>
          punto.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
          punto.direccion_texto.toLowerCase().includes(searchText.toLowerCase())
      );
      setPuntosFiltrados(filtered);
    }
  }, [searchText, puntos]);

  const fetchPuntos = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}puntos-impresion/`);
      
      if (!res.ok) {
        throw new Error("Error al cargar los puntos");
      }

      const data = await res.json();
      setPuntos(data);
      setPuntosFiltrados(data);
    } catch (error) {
      console.error("Error al obtener puntos de impresión:", error);
      Alert.alert(
        "Error",
        "No se pudieron cargar los puntos de impresión. Verifica tu conexión."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPuntos();
  };

  const toggleBottomSheet = () => {
    const toValue = isExpanded ? BOTTOM_SHEET_MIN_HEIGHT : BOTTOM_SHEET_MAX_HEIGHT;
    
    Animated.spring(animatedHeight, {
      toValue,
      useNativeDriver: false,
      tension: 50,
      friction: 8,
    }).start();
    
    setIsExpanded(!isExpanded);
  };

  const centerOnUserLocation = () => {
    mapRef.current?.animateToRegion({
      latitude: -34.7007,
      longitude: -58.3917,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    }, 1000);
  };

  const openInMaps = (punto: PuntoImpresion) => {
    const scheme = Platform.select({
      ios: 'maps://0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${punto.lat},${punto.lng}`;
    const label = punto.nombre;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url || '').catch(() => {
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latLng}`;
      Linking.openURL(googleMapsUrl);
    });
  };

  const focusOnMarker = (punto: PuntoImpresion) => {
    mapRef.current?.animateToRegion({
      latitude: punto.lat,
      longitude: punto.lng,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }, 1000);
  };

  const renderPuntoItem = ({ item }: { item: PuntoImpresion }) => (
    <View style={styles.puntoCard}>
      <View style={styles.puntoCardHeader}>
        <View style={styles.puntoCardInfo}>
          <Text style={styles.puntoNombre}>{item.nombre}</Text>
          <Text style={styles.puntoDireccion}>{item.direccion_texto}</Text>
          {item.horario && (
            <View style={styles.horarioContainer}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.puntoHorario}>{item.horario}</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.puntoCardActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => {
            focusOnMarker(item);
            toggleBottomSheet();
          }}
        >
          <Ionicons name="eye-outline" size={20} color="#50C2C9" />
          <Text style={styles.viewButtonText}>Ver en mapa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.directionsButton]}
          onPress={() => openInMaps(item)}
        >
          <Ionicons name="navigate-outline" size={20} color="#FFFFFF" />
          <Text style={styles.directionsButtonText}>Cómo llegar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="location-outline" size={64} color="#CCC" />
      <Text style={styles.emptyStateTitle}>
        {searchText ? "No se encontraron puntos" : "No hay puntos disponibles"}
      </Text>
      <Text style={styles.emptyStateText}>
        {searchText 
          ? "Intenta con otra búsqueda" 
          : "Agrega nuevos puntos de impresión desde el panel de administración"}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#50C2C9" />
        <Text style={styles.loadingText}>Cargando puntos de impresión...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <Text style={GlobalStyles.tittle}>Central de impresión</Text>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre o ubicación..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText !== "" && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={{
          latitude: puntosFiltrados.length > 0 ? puntosFiltrados[0].lat : -34.7007,
          longitude: puntosFiltrados.length > 0 ? puntosFiltrados[0].lng : -58.3917,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {puntosFiltrados.map((punto) => (
          <Marker
            key={punto.id}
            coordinate={{
              latitude: punto.lat,
              longitude: punto.lng,
            }}
            title={punto.nombre}
            description={punto.direccion_texto}
            pinColor="#50C2C9"
            onPress={() => focusOnMarker(punto)}
          />
        ))}
      </MapView>

      <TouchableOpacity
        style={styles.locationButton}
        onPress={centerOnUserLocation}
      >
        <Ionicons name="locate" size={24} color="#50C2C9" />
      </TouchableOpacity>

      <Animated.View style={[styles.bottomSheet, { height: animatedHeight }]}>
        <TouchableOpacity
          style={styles.bottomSheetHandle}
          onPress={toggleBottomSheet}
          activeOpacity={0.9}
        >
          <View style={styles.handle} />
          <View style={styles.bottomSheetHeader}>
            <Text style={styles.bottomSheetTitle}>
              Puntos de impresión en braille
            </Text>
            <Text style={styles.bottomSheetSubtitle}>
              {puntosFiltrados.length} {puntosFiltrados.length === 1 ? "punto" : "puntos"} disponibles
            </Text>
          </View>
          <Ionicons
            name={isExpanded ? "chevron-down" : "chevron-up"}
            size={24}
            color="#666"
          />
        </TouchableOpacity>

        {isExpanded && (
          <FlatList
            data={puntosFiltrados}
            renderItem={renderPuntoItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyState}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#50C2C9"]}
                tintColor="#50C2C9"
              />
            }
          />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#50C2C9",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#FFFFFF",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    margin: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
  },
  map: {
    flex: 1,
  },
  locationButton: {
    position: "absolute",
    bottom: BOTTOM_SHEET_MIN_HEIGHT + 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  bottomSheetHandle: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#DDD",
    borderRadius: 3,
    position: "absolute",
    top: 8,
    left: "50%",
    marginLeft: -20,
  },
  bottomSheetHeader: {
    flex: 1,
    marginTop: 15,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
  },
  bottomSheetSubtitle: {
    fontSize: 14,
    color: "#666666",
    marginTop: 2,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  puntoCard: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  puntoCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  puntoCardInfo: {
    flex: 1,
  },
  puntoNombre: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 5,
  },
  puntoDireccion: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 5,
  },
  horarioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  puntoHorario: {
    fontSize: 13,
    color: "#666666",
    marginLeft: 5,
  },
  puntoCardActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    gap: 5,
  },
  viewButton: {
    backgroundColor: "#E8F8F9",
    borderWidth: 1,
    borderColor: "#50C2C9",
  },
  viewButtonText: {
    color: "#50C2C9",
    fontSize: 14,
    fontWeight: "600",
  },
  directionsButton: {
    backgroundColor: "#50C2C9",
  },
  directionsButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#666",
    marginTop: 15,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});