import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@/src/context/ThemeContext";

type NavbarProps = {
  toggleSidebar: () => void;
  title: string;
};

export default function Navbar({ toggleSidebar, title }: NavbarProps) {
  const [empresaSelecionada, setEmpresaSelecionada] = useState<any>({});
  const navigation = useNavigation();
  const { theme } = useTheme();

  useEffect(() => {
    async function loadUserData() {
      try {
        const empresaSelecionada = await AsyncStorage.getItem(
          "@empresaSelecionada"
        );
        if (empresaSelecionada) {
          const empresaObj = JSON.parse(empresaSelecionada);
          setEmpresaSelecionada(empresaObj || {});
        }
      } catch (error) {
        console.error("Erro ao carregar empresa selecionada:", error);
      }
    }

    loadUserData();
  }, []);

  const handleEmpresaPress = () => {
    navigation.navigate("Intro" as never);
  };

  // ✅ Estilos com acesso ao tema
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.buttonBackground,
      paddingTop: 60,
      paddingBottom: 16,
      paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
    },
    iconButton: {
      marginRight: 16,
    },
    textContainer: {
      flexDirection: "column",
    },
    title: {
      color: "#fff",
      fontSize: 20,
      fontWeight: "bold",
    },
    subtitle: {
      color: "#fff",
      fontSize: 14,
      marginTop: 2,
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.primary} />
      <TouchableOpacity style={styles.iconButton} onPress={toggleSidebar}>
        <Ionicons name="menu" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={handleEmpresaPress}>
          <Text style={styles.subtitle}>
            {empresaSelecionada?.nome || "Carregando empresa..."}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
