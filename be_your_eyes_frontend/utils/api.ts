// utils/api.ts
import { useAuth } from "@/contexts/authContext";
import { Alert } from "react-native";

export const useApi = () => {
  const { accessToken, logout } = useAuth();

  const apiFetch = async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    const finalUrl = `${url}`;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers || {}),
    };

    const response = await fetch(finalUrl, { ...options, headers });
    // Si la sesión expiró o el token es inválido
    if (response.status === 401) {
      Alert.alert("Sesión expirada", "Por favor, iniciá sesión nuevamente.");
      logout(); // Limpia el contexto y redirige al login
      throw new Error("No autorizado");
    }

    return response;
  };

  return { apiFetch };
};
