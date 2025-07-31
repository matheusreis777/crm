import React, { useState } from "react";
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
  Button as RNButton, // botão nativo simples só pra demo
} from "react-native";
import { Button } from "./../components/button";
import { Input } from "./../components/input";
import Constants from "expo-constants";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

export default function Index() {
  // Estado para controlar tema manualmente
  const [isDark, setIsDark] = useState(false);

  const { signIn } = useAuth();
  const [cpf, setCpf] = useState("05993791110");
  const [senha, setPassword] = useState("Mt33867756!@#");
  const statusBarHeight = Constants.statusBarHeight;
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  async function loginScreen() {
    if (!cpf || !senha) {
      Alert.alert("Atenção", "Preencha CPF e senha.");
      return;
    }

    setLoading(true);
    try {
      await signIn(cpf, senha);
      Alert.alert("Sucesso", "Login realizado com sucesso!");
      navigation.navigate("Home" as never);
    } catch (error: any) {
      Alert.alert("Falha no login");
    } finally {
      setLoading(false);
    }
  }

  // Estilos que dependem do tema manual
  const styles = StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: isDark ? "#000" : "#fff",
      resizeMode: "cover",
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    view: {
      flex: 1,
      padding: 28,
      gap: 16,
      paddingTop: 0,
      justifyContent: "center",
    },
    title: {
      color: isDark ? "#fff" : "#000",
      fontSize: 32,
      fontWeight: "bold",
      fontFamily: "Poppins",
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      color: isDark ? "#ccc" : "#555",
      fontFamily: "Poppins",
      textAlign: "center",
    },
    toggleButton: {
      marginTop: 20,
      marginBottom: 20,
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
          barStyle={isDark ? "light-content" : "dark-content"}
        />

        <View style={styles.view}>
          <Text style={styles.title}>Seja bem-vindo!</Text>
          <Text style={styles.subtitle}>
            Preencha as informações abaixo para efetuar login.
          </Text>

          <Input
            placeholder="CPF"
            type={"cpf"}
            value={cpf}
            isDark={isDark}
            onChangeText={setCpf}
          />

          <Input
            placeholder="Senha"
            value={senha}
            isDark={isDark}
            onChangeText={setPassword}
            isPassword
          />

          {loading ? (
            <ActivityIndicator size="large" color="#ffffff" />
          ) : (
            <Button title="Login" onPress={loginScreen} />
          )}

          {/* Botão para alternar tema */}
          <View style={styles.toggleButton}>
            <RNButton
              title={isDark ? "Modo Claro" : "Modo Escuro"}
              onPress={() => setIsDark(!isDark)}
              color={isDark ? "#bbb" : "#333"}
            />
          </View>
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}
