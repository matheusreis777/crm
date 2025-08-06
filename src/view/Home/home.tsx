import React, { useState, useEffect, useCallback, useRef } from "react";
import Feather from "react-native-vector-icons/Feather";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Animated,
  StatusBar,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import Navbar from "@/src/components/navbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { maskCPF } from "@/src/utils/util";
import { useTheme } from "../../context/ThemeContext";
import SidebarMenu from "../../components/sidebar-menu/SidebarMenu";

const { width } = Dimensions.get("window");

export default function Home() {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarAnim = useRef(new Animated.Value(-width)).current;
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const navigationTo = (caminho: string) => {
    navigation.navigate(caminho as never);
  };

  const toggleSidebar = () => {
    const toValue = sidebarOpen ? -width : 0;

    Animated.timing(sidebarAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSidebarOpen(!sidebarOpen);
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.3)",
      zIndex: 999,
      display: sidebarOpen ? "flex" : "none",
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 16,
      color: theme.text,
    },
    cardsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    card: {
      width: "48%",
      backgroundColor: theme.background,
      borderRadius: 10,
      padding: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardTitle: {
      fontSize: 14,
      color: theme.text,
    },
    cardValue: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
      marginTop: 8,
    },
    fab: {
      position: "absolute",
      bottom: 30,
      right: 30,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: "#007AFF",
      justifyContent: "center",
      alignItems: "center",
      elevation: 6,
      zIndex: 99,
    },
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Navbar toggleSidebar={toggleSidebar} title="Painel" />

        {sidebarOpen && (
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={toggleSidebar}
          />
        )}

        <SidebarMenu
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          sidebarAnim={sidebarAnim}
        />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 20,
            paddingBottom: 30,
          }}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={styles.sectionTitle}>Dashboard</Text>

          <View style={styles.cardsContainer}>
            {[
              { title: "Vendas no mês", value: "12" },
              { title: "Veículos em estoque", value: "35" },
              { title: "Clientes", value: "87" },
              { title: "Lucro Estimado", value: "R$ 120.500" },
              { title: "Meta do Mês", value: "R$ 150.000" },
            ].map((item, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Últimas Vendas</Text>
          {[
            { cliente: "João Silva", modelo: "Corolla", data: "01/08" },
            { cliente: "Maria Souza", modelo: "HB20", data: "02/08" },
            { cliente: "Carlos Lima", modelo: "Civic", data: "04/08" },
          ].map((item, index) => (
            <View
              key={index}
              style={{
                backgroundColor: theme.background,
                padding: 12,
                borderRadius: 8,
                marginBottom: 8,
              }}
            >
              <Text style={{ color: theme.text, fontWeight: "bold" }}>
                {item.cliente}
              </Text>
              <Text style={{ color: theme.text }}>
                {item.modelo} - {item.data}
              </Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Notificações Recentes</Text>
          {[
            "Novo cliente cadastrado",
            "Venda confirmada: Onix 2023",
            "Atualização no sistema",
          ].map((msg, idx) => (
            <View
              key={idx}
              style={{
                backgroundColor: theme.background,
                padding: 10,
                borderRadius: 6,
                marginBottom: 6,
              }}
            >
              <Text style={{ color: theme.text }}>{msg}</Text>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigationTo("NovoVeiculo")}
        >
          <Feather name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}
