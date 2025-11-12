import { StyleSheet } from "react-native";
import { Colors } from "./Colors";

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
    paddingBottom: 150,
    paddingTop: 45
  },
  tittle: {
    fontSize: 27,
    color: Colors.text,
    fontWeight: "700",
    marginBottom: 32,
    textAlign: "center",
  },
  tittleCliente: {
    fontSize: 27,
    color: Colors.text,
    fontWeight: "700",
    textAlign: "center",
  },
  containerButton: {
    paddingHorizontal: 31,
    marginTop: 45
  },
  containerInputs: {
    gap: 16,
    flexDirection: "column",
    alignItems: "center",
  },
  subtitle: {
    fontSize: 14, 
    color: '#888', 
    textAlign: 'center', 
    marginBottom: 20
  },

});
