// contexts/AuthContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AuthContextProps {
  accessToken: string | null;
  login: (token: string, userData?: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // cargar token guardado al iniciar la app
    const loadToken = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) setAccessToken(token);
    };
    loadToken();
  }, []);

  const login = async (token: string, userData?: any) => {
    setAccessToken(token);
    await AsyncStorage.setItem("accessToken", token);
  };

  const logout = async () => {
    setAccessToken(null);
    await AsyncStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
