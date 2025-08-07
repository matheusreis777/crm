import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  ImageBackground,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
  Switch,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "./../components/button";
import { Input } from "./../components/input/input";
import SwitchTheme from "../components/switch-theme/switch-theme";
import { useTheme } from "../context/ThemeContext";

export default function Index() {
  const { theme } = useTheme();
  const { signIn } = useAuth();
  const [cpf, setCpf] = useState("");
  const [senha, setPassword] = useState("");
  const [stayConnected, setStayConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [empresas, setEmpresas] = useState<any[]>([]);

  useEffect(() => {
    loadEmpresas();
    loadSavedCredentials();
  }, []);

  const loadEmpresas = async () => {
    try {
      const empresasStorage = await AsyncStorage.getItem("@empresas");
      setEmpresas(empresasStorage ? JSON.parse(empresasStorage) : []);
    } catch (error) {
      console.error("Erro ao carregar empresas:", error);
    }
  };

  const loadSavedCredentials = async () => {
    try {
      const savedCpf = await AsyncStorage.getItem("@savedCpf");
      const savedSenha = await AsyncStorage.getItem("@savedSenha");

      if (savedCpf && savedSenha) {
        setCpf(savedCpf);
        setPassword(savedSenha);
        setStayConnected(true);
      }
    } catch (error) {
      console.error("Erro ao carregar credenciais salvas:", error);
    }
  };

  const loginScreen = async () => {
    if (!cpf || !senha) {
      Alert.alert("Atenção", "Preencha CPF e senha.");
      return;
    }

    setLoading(true);
    try {
      const response = await signIn(cpf, senha);

      if (stayConnected) {
        await AsyncStorage.setItem("@savedCpf", cpf);
        await AsyncStorage.setItem("@savedSenha", senha);
      } else {
        await AsyncStorage.removeItem("@savedCpf");
        await AsyncStorage.removeItem("@savedSenha");
      }

      const empresasStorage = await AsyncStorage.getItem("@empresas");
      const empresasParsed = empresasStorage ? JSON.parse(empresasStorage) : [];

      if (empresasParsed.length === 1) {
        await AsyncStorage.setItem(
          "@empresaSelecionada",
          JSON.stringify(empresasParsed[0])
        );
        navigation.navigate("Home" as never);
      } else {
        navigation.navigate("Intro" as never);
      }
    } catch (error) {
      Alert.alert("Falha no login", "Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    background: {
      flex: 1,
      resizeMode: "cover",
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.background,
    },
    view: {
      flex: 1,
      padding: 28,
      gap: 16,
      justifyContent: "center",
    },
    title: {
      color: theme.text,
      fontSize: 32,
      fontWeight: "bold",
      fontFamily: "Poppins",
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      color: theme.text || "#888",
      fontFamily: "Poppins",
      textAlign: "center",
    },
    toggleButton: {
      marginTop: 20,
      marginBottom: 20,
      textAlign: "center",
      alignItems: "center",
    },
    switchRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 8,
    },
    switchLabel: {
      color: theme.text,
      fontSize: 14,
      fontFamily: "Poppins",
    },
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require("../assets/background-sem-fundo-invert.png")}
        style={styles.background}
      >
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle={theme.mode === "dark" ? "light-content" : "dark-content"}
        />

        <View style={styles.view}>
          <Text style={styles.title}>Seja bem-vindo!</Text>
          <Text style={styles.subtitle}>
            Preencha as informações abaixo para efetuar login.
          </Text>

          <Input
            placeholder="CPF"
            type="cpf"
            value={cpf}
            onChangeText={(text) => setCpf(text)}
          />

          <Input
            placeholder="Senha"
            value={senha}
            onChangeText={(text) => setPassword(text)}
            isPassword
          />

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Permanecer conectado</Text>
            <Switch
              value={stayConnected}
              onValueChange={(value) => setStayConnected(value)}
              trackColor={{ false: "#999", true: theme.backgroundCard }}
              thumbColor={theme.buttonBackground}
            />
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={theme.buttonBackground} />
          ) : (
            <Button title="Login" onPress={loginScreen} />
          )}

          <View style={styles.toggleButton}>
            <SwitchTheme />
          </View>
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}
