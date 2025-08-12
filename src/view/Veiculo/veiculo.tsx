import { Button } from "@/src/components/button";
import { Input } from "@/src/components/input/input";
import Navbar from "@/src/components/navbar";
import SidebarMenu from "@/src/components/sidebar-menu/SidebarMenu";
import { useTheme } from "@/src/context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
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
  ActivityIndicator,
} from "react-native";

import LottieView from "lottie-react-native";
import { GenericService } from "@/src/services/genericService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VeiculoModel } from "@/src/models/veiculo";

const { width } = Dimensions.get("window");

export default function Veiculo() {
  const veiculoService = new GenericService<any>("/mobile/ObterVeiculo");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarAnim = useRef(new Animated.Value(-width)).current;
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [placa, setPlaca] = useState("");
  const [veiculo, setVeiculo] = useState<VeiculoModel | null>(null);
  const [loading, setLoading] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  useEffect(() => {
    if (placa.trim() === "") {
      setVeiculo(null);
    }
  }, [placa]);

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
    vehicleCard: {
      backgroundColor: theme.backgroundCard,
      padding: 15,
      marginVertical: 10,
      borderRadius: 8,
      elevation: 2,
    },
    vehicleText: {
      color: theme.text,
      fontSize: 16,
      marginBottom: 5,
    },
  });

  const nadaEncontradoAnimation = require("../../../assets/images/Animation - Empty.json");

  const searchVehicle = async () => {
    if (!placa.trim()) return;

    Keyboard.dismiss(); // ✅ fecha o teclado logo no clique

    try {
      setLoading(true); // inicia carregamento
      setVeiculo(null); // limpa resultado anterior

      const empresaId = await AsyncStorage.getItem("@empresaId");
      const filtro = { placa: placa.trim(), empresaId };
      const response = await veiculoService.postFiltro(filtro);

      console.log("Veículo encontrado:", response.data);

      setVeiculo(response.data as VeiculoModel | null);
    } catch (error) {
      console.error("Erro ao buscar veículo:", error);
      setVeiculo(null);
    } finally {
      setLoading(false); // finaliza carregamento
    }
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

          {/* Área de resultado */}
          {loading ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={{ color: theme.text, marginTop: 10 }}>
                Buscando informações...
              </Text>
            </View>
          ) : !placa.trim() ? (
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
          ) : veiculo ? (
            <View style={{ padding: 20 }}>
              <Text style={styles.sectionTitle}>Informações do Veículo</Text>

              <View style={styles.vehicleCard}>
                <Text style={styles.vehicleText}>Placa: {veiculo.placa}</Text>
                <Text style={styles.vehicleText}>
                  Renavam: {veiculo.renavam}
                </Text>
                <Text style={styles.vehicleText}>
                  Tipo: {veiculo.tipoVeiculo}
                </Text>
                <Text style={styles.vehicleText}>Chassi: {veiculo.chassi}</Text>
                <Text style={styles.vehicleText}>Marca: {veiculo.marca}</Text>
                <Text style={styles.vehicleText}>Modelo: {veiculo.modelo}</Text>
                <Text style={styles.vehicleText}>
                  Ano Fabricação: {veiculo.anoFabricacao}
                </Text>
                <Text style={styles.vehicleText}>
                  Ano Modelo: {veiculo.anoModelo}
                </Text>
                <Text style={styles.vehicleText}>Cor: {veiculo.cor}</Text>
                <Text style={styles.vehicleText}>Câmbio: {veiculo.cambio}</Text>
                <Text style={styles.vehicleText}>
                  Quilometragem: {veiculo.quilometragem}
                </Text>
                <Text style={styles.vehicleText}>
                  Combustível: {veiculo.combustivel}
                </Text>
                <Text style={styles.vehicleText}>
                  Status Veículo: {veiculo.statusVeiculo}
                </Text>
                <Text style={styles.vehicleText}>
                  Status Origem: {veiculo.statusOrigem}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.sectionTitle}>Veículo não encontrado</Text>
              <Text style={{ color: theme.text, textAlign: "center" }}>
                Verifique a placa e tente novamente.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}
