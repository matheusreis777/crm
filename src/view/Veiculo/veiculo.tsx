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
  Alert,
} from "react-native";

import LottieView from "lottie-react-native";
import { GenericService } from "@/src/services/genericService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VeiculoModel } from "@/src/models/veiculo";
import * as Clipboard from "expo-clipboard";
import { Feather } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function Veiculo() {
  const veiculoService = new GenericService<any>("/mobile/ObterVeiculo");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarAnim = useRef(new Animated.Value(-width)).current;
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [placa, setPlaca] = useState("MOT1111");
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

  const copyToClipboard = async (value: string) => {
    if (!value) return;
    await Clipboard.setStringAsync(value);
    Alert.alert("Copiado", `${value} copiado para a área de transferência!`);
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
      fontWeight: "bold",
      color: theme.text,
      marginTop: 10,
      textAlign: "center",
    },
    lottie: {
      width: 200,
      height: 200,
    },
    vehicleCard: {
      backgroundColor: theme.backgroundCardBlue,
      padding: 15,
      marginVertical: 10,
      borderRadius: 8,
      elevation: 6,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    vehicleText: {
      color: theme.textClear,
      fontSize: 16,
      marginBottom: 5,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      flexWrap: "wrap",
      marginBottom: 5,
    },
    rowCenter: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    infoBox: {
      flex: 1,
      minWidth: "auto",
      marginRight: 10,
      marginBottom: 5,
    },
    infoTitle: {
      fontSize: 14,
      color: theme.textClear,
      fontWeight: "bold",
    },
    infoValue: {
      fontSize: 16,
      color: theme.textClear,
      flexShrink: 1,
    },
    copyIcon: {
      marginLeft: 5,
    },
  });

  const nadaEncontradoAnimation = require("../../../assets/images/Animation - Empty.json");

  const searchVehicle = async () => {
    if (!placa.trim()) return;

    Keyboard.dismiss();

    try {
      setLoading(true);
      setVeiculo(null);

      const empresaId = await AsyncStorage.getItem("@empresaId");
      const filtro = { placa: placa.trim(), empresaId };
      const response = await veiculoService.postFiltro(filtro);

      setVeiculo(response.data as VeiculoModel | null);
    } catch (error) {
      console.error("Erro ao buscar veículo:", error);
      setVeiculo(null);
    } finally {
      setLoading(false);
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
          ) : veiculo ? (
            <View style={{ padding: 20 }}>
              <Text style={styles.sectionTitle}>Informações do Veículo</Text>

              <View style={styles.vehicleCard}>
                {/* Primeira linha */}
                <View style={styles.row}>
                  <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>Placa</Text>
                    <Text style={styles.infoValue}>{veiculo.placa}</Text>
                  </View>
                  <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>Cor</Text>
                    <Text style={styles.infoValue}>{veiculo.cor}</Text>
                  </View>
                  <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>Combustível</Text>
                    <Text style={styles.infoValue}>{veiculo.combustivel}</Text>
                  </View>
                </View>

                {/* Segunda linha */}
                <View style={styles.row}>
                  <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>Ano Fab.</Text>
                    <Text style={styles.infoValue}>
                      {veiculo.anoFabricacao}
                    </Text>
                  </View>
                  <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>Ano Mod.</Text>
                    <Text style={styles.infoValue}>{veiculo.anoModelo}</Text>
                  </View>
                  <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>Quilometragem</Text>
                    <Text style={styles.infoValue}>
                      {veiculo.quilometragem}
                    </Text>
                  </View>
                </View>

                {/* Terceira linha */}
                <View style={styles.row}>
                  <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>Tipo</Text>
                    <Text style={styles.infoValue}>{veiculo.tipoVeiculo}</Text>
                  </View>
                  <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>Marca</Text>
                    <Text style={styles.infoValue}>{veiculo.marca}</Text>
                  </View>
                  <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>Modelo</Text>
                    <Text style={styles.infoValue}>{veiculo.modelo}</Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.row,
                    { justifyContent: "center", flexWrap: "wrap" },
                  ]}
                >
                  <View
                    style={[styles.infoBox, { flexShrink: 1, marginRight: 15 }]}
                  >
                    <Text style={styles.infoTitle}>Status Origem</Text>
                    <Text style={styles.infoValue}>{veiculo.statusOrigem}</Text>
                  </View>

                  <View style={[styles.infoBox, { flexShrink: 1 }]}>
                    <Text style={styles.infoTitle}>Status Veículo</Text>
                    <Text style={styles.infoValue}>
                      {veiculo.statusVeiculo}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.row,
                    { justifyContent: "center", flexWrap: "wrap" },
                  ]}
                >
                  <View
                    style={[styles.infoBox, { flexShrink: 1, marginRight: 15 }]}
                  >
                    <Text style={styles.infoTitle}>Chassi</Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={[styles.infoValue, { marginRight: 5 }]}
                        numberOfLines={1}
                      >
                        {veiculo.chassi}
                      </Text>
                      <TouchableOpacity
                        onPress={() => copyToClipboard(veiculo.chassi)}
                        style={styles.copyIcon}
                      >
                        <Feather name="copy" size={18} color={theme.text} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={[styles.infoBox, { flexShrink: 1 }]}>
                    <Text style={styles.infoTitle}>Renavam</Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={[styles.infoValue, { marginRight: 5 }]}
                        numberOfLines={1}
                      >
                        {veiculo.renavam}
                      </Text>
                      <TouchableOpacity
                        onPress={() => copyToClipboard(veiculo.renavam)}
                        style={styles.copyIcon}
                      >
                        <Feather name="copy" size={18} color={theme.text} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ) : (
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
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}
