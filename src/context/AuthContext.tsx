// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
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
      cpf = cpf.replace(/\D/g, "");
      const response = await loginService({ cpf, senha });
      const nameUser = response.data.usuarioNome;
      const descriptionProfile = response.data.usuarioPerfilDescricao;
      const login = response.data.usuarioLogin;
      const usuarioId = response.data.usuarioId;
      const token = response.data.token;
      const listaEmpresa = response.data.empresas;
      const phone = response.data.telefone;

      setUserToken(token);
      await AsyncStorage.setItem("@token", token);
      await AsyncStorage.setItem("@nameUser", nameUser);
      await AsyncStorage.setItem("@usuarioId", JSON.stringify(usuarioId));
      await AsyncStorage.setItem("@descriptionProfile", descriptionProfile);
      await AsyncStorage.setItem("@login", login);
      await AsyncStorage.setItem("@phone", JSON.stringify(phone));
      await AsyncStorage.setItem("@empresas", JSON.stringify(listaEmpresa));
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
