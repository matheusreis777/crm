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

export default function Index() {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const statusBarHeight = Constants.statusBarHeight;

  function loginScreen() {
    console.log("CPF:", cpf);
    console.log("Senha:", password);
    Alert.alert("Hello, World!");
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
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />

          <Button title="Login" onPress={loginScreen} />
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}
