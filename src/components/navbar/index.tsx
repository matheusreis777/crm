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

type NavbarProps = {
  toggleSidebar: () => void;
  title: string;
};

export default function Navbar({ toggleSidebar, title }: NavbarProps) {
  const [empresaSelecionada, setEmpresaSelecionada] = useState<any>({});
  const navigation = useNavigation();

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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
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

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    top: 0,
    left: 0,
    right: 0,
    height: 80 + (StatusBar.currentHeight || 20),
    paddingTop: StatusBar.currentHeight || 50,
    paddingHorizontal: 16,
    backgroundColor: "#007AFF",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    zIndex: 10,
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
