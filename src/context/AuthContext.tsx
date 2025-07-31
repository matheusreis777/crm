// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { login as loginService } from "./../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextData {
  userToken: string | null;
  signIn: (cpf: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);

  const signIn = async (cpf: string, senha: string) => {
    try {
      const response = await loginService({ cpf, senha });
      const token = response.data.token;

      setUserToken(token);
      await AsyncStorage.setItem("@token", token);
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  };

  const signOut = async () => {
    setUserToken(null);
    await AsyncStorage.removeItem("@token");
  };

  return (
    <AuthContext.Provider value={{ userToken, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar mais fácil
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve estar dentro de AuthProvider");
  }
  return context;
};
