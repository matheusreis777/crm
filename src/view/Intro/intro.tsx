import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView, // <- para permitir rolagem
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Button } from "../../components/button";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "expo-router";
import SwitchTheme from "../../components/switch-theme/switch-theme";
import { useTheme } from "../../context/ThemeContext";

export default function Intro() {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const [nameUser, setNameUser] = useState("");
  const [empresas, setEmpresas] = useState<any[]>([]);
  const { signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    navigation.navigate("Login" as never);
  }

  async function selectEmpresa(empresa: any) {
    await AsyncStorage.setItem("@empresaSelecionada", JSON.stringify(empresa));
    await AsyncStorage.setItem("@empresaId", String(empresa.id));
    navigation.navigate("Home" as never);
  }

  useEffect(() => {
    async function loadUserData() {
      const name = await AsyncStorage.getItem("@nameUser");
      const empresasStorage = await AsyncStorage.getItem("@empresas");

      setNameUser(name || "");
      if (empresasStorage) {
        const empresasParsed = JSON.parse(empresasStorage);

        setEmpresas(empresasParsed);

        if (empresasParsed.length === 1) {
          await AsyncStorage.setItem(
            "@empresaSelecionada",
            JSON.stringify(empresasParsed[0])
          );

          await AsyncStorage.setItem(
            "@empresaId",
            JSON.stringify(empresasParsed[0].Id)
          );

          console.log(empresasParsed[0].Id);

          navigation.navigate("Home" as never);
        }
      } else {
        setEmpresas([]);
      }
    }

    loadUserData();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: StatusBar.currentHeight || 80,
      paddingHorizontal: 16,
      backgroundColor: theme.background,
    },
    center: {
      textAlign: "center",
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 10,
      textAlign: "center",
      color: theme.text,
    },
    subtitle: {
      textAlign: "center",
      fontSize: 18,
      marginBottom: 10,
      color: theme.text,
    },
    empty: {
      fontSize: 16,
      color: "#888",
    },
    card: {
      backgroundColor: theme.backgroundCard,
      padding: 12,
      borderRadius: 8,
      marginBottom: 10,
      elevation: 2,
    },
    nomeEmpresa: {
      fontSize: 16,
      color: theme.text,
    },
    toggleButton: {
      marginTop: 20,
      marginBottom: 20,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Olá, {nameUser}!</Text>
      <Text style={styles.subtitle}>
        Selecione a empresa que deseja acessar.
      </Text>

      {empresas.length === 0 ? (
        <Text style={styles.empty}>Nenhuma empresa cadastrada.</Text>
      ) : (
        empresas.map((empresa, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => selectEmpresa(empresa)}
          >
            <Text style={styles.nomeEmpresa}>{empresa.nome}</Text>
          </TouchableOpacity>
        ))
      )}

      <Button title="Sair" onPress={handleSignOut} />
    </ScrollView>
  );
}
