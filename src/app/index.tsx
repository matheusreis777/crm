import {
  View,
  Text,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  ImageBackground,
  StatusBar,
} from "react-native";
import { Button } from "./../components/button";
import { Input } from "./../components/input";
import { useState } from "react";
import { styles } from "./../app/styles";
import Constants from "expo-constants";
import { useAuth } from "../context/AuthContext";

export default function Index() {
  const { signIn } = useAuth();
  console.log("##### Index.tsx CARREGOU #####");
  const [cpf, setCpf] = useState("05993791110");
  const [senha, setPassword] = useState("Mt33867756!@#");
  const statusBarHeight = Constants.statusBarHeight;

  async function loginScreen() {
    try {
      await signIn(cpf, senha);
      Alert.alert("Login OK");
    } catch (error) {
      Alert.alert("Erro ao fazer login");
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require("../assets/background-sem-fundo-invert.png")}
        style={styles.background}
      >
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
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
            onChangeText={setCpf}
          />

          <Input
            placeholder="Senha"
            value={senha}
            onChangeText={setPassword}
            isPassword
          />

          <Button title="Login" onPress={loginScreen} />
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}
