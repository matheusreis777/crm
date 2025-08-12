import { Button } from "@/src/components/button";
import { Input } from "@/src/components/input/input";
import Navbar from "@/src/components/navbar";
import SidebarMenu from "@/src/components/sidebar-menu/SidebarMenu";
import { useTheme } from "@/src/context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useRef, useState } from "react";
import {
  TouchableWithoutFeedback,
  Keyboard,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Animated,
  StyleSheet,
  Dimensions,
  Text,
} from "react-native";

import LottieView from "lottie-react-native";
import { api } from "@/src/services/api";
import { GenericService } from "@/src/services/genericService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

export default function Veiculo() {
  const veiculoService = new GenericService<any>("/mobile/ObterVeiculo");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarAnim = useRef(new Animated.Value(-width)).current;
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [placa, setPlaca] = useState("");

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

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
    viewSearch: {
      paddingHorizontal: 20,
      paddingTop: 20,
      backgroundColor: theme.background,
      zIndex: 10,
    },
    emptyContainer: {
      marginTop: 60,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 24,
      color: theme.text,
      marginTop: 10,
      textAlign: "center",
    },
    lottie: {
      width: 200,
      height: 200,
    },
  });

  const nadaEncontradoAnimation = require("../../../assets/images/Animation - Empty.json");

  const searchVehicle = async () => {
    const empresaId = await AsyncStorage.getItem("@empresaId");
    const filtro = { placa: placa, empresaId: empresaId };
    const response = await veiculoService.postFiltro(filtro);
    console.log(response);
  };

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
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.viewSearch}>
            <Input
              type="plate"
              placeholder="Consulte seu veículo pela placa"
              value={placa}
              onChangeText={(text) => setPlaca(text)}
            />

            <Button title="Pesquisar" onPress={searchVehicle} />
          </View>

          {/* Se não pesquisar nada (placa vazia), mostra essa tela vazia */}
          {placa.trim() === "" && (
            <View style={styles.emptyContainer}>
              <LottieView
                source={nadaEncontradoAnimation}
                autoPlay
                loop
                style={styles.lottie}
              />
              <Text style={styles.sectionTitle}>Nada encontrado!</Text>
              <Text style={{ color: theme.text, textAlign: "center" }}>
                Digite a placa do veículo para buscar informações.
              </Text>
            </View>
          )}

          {/* Aqui você pode colocar sua lista de resultados quando tiver */}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}
