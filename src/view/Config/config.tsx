import React, { useState, useEffect } from "react";
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
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import Navbar from "@/src/components/navbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SidebarMenu from "../../components/sidebar-menu/SidebarMenu";
import { useTheme } from "@/src/context/ThemeContext";
import * as Notifications from "expo-notifications";
import * as Camera from "expo-camera";
import { useCameraPermissions, PermissionStatus } from "expo-camera";
import { maskCPF } from "@/src/utils/util";

const { width } = Dimensions.get("window");

export default function Config() {
  const { signOut } = useAuth();
  const navigation = useNavigation();
  const [nameUser, setNameUser] = useState("");
  const [descriptionProfile, setDescriptionProfile] = useState("");
  const [login, setLogin] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarAnim = useState(new Animated.Value(-width))[0];
  const { theme, toggleTheme } = useTheme();

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // useCameraPermissions hook para a câmera
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  useEffect(() => {
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setNotificationsEnabled(status === "granted");
  };

  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === "granted") {
      setNotificationsEnabled(true);
      Alert.alert("Notificações ativadas!");
    } else {
      setNotificationsEnabled(false);
      Alert.alert(
        "Permissão negada",
        "Você pode ativar nas configurações do sistema."
      );
    }
  };

  const openCamera = async () => {
    // Se permissão ainda não foi concedida, pede permissão
    if (
      !cameraPermission ||
      cameraPermission.status !== PermissionStatus.GRANTED
    ) {
      const permissionResponse = await requestCameraPermission();
      if (permissionResponse.status !== PermissionStatus.GRANTED) {
        Alert.alert("Permissão negada", "A câmera não pode ser acessada.");
        return;
      }
    }
    Alert.alert("Permissão concedida", "Agora você pode abrir a câmera.");
    // Aqui você pode navegar para a tela da câmera ou abrir ImagePicker
  };

  async function handleSignOut() {
    await signOut();
    navigation.navigate("Login" as never);
  }

  const navigationTo = (caminho: string) => {
    navigation.navigate(caminho as never);
  };

  const toggleSidebar = () => {
    if (sidebarOpen) {
      Animated.timing(sidebarAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setSidebarOpen(false));
    } else {
      setSidebarOpen(true);
      Animated.timing(sidebarAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    const first = words[0]?.[0] || "";
    const last = words.length > 1 ? words[words.length - 1]?.[0] : "";
    return (first + last).toUpperCase();
  };

  useEffect(() => {
    async function loadUserData() {
      const name = await AsyncStorage.getItem("@nameUser");
      const description = await AsyncStorage.getItem("@descriptionProfile");
      const loginStored = await AsyncStorage.getItem("@login");

      setNameUser(name || "");
      setDescriptionProfile(description || "");
      setLogin(maskCPF(loginStored || ""));
    }

    loadUserData();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: 100,
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.3)",
      zIndex: 999,
    },
    scrollViewContent: {
      flexGrow: 1,
      justifyContent: "center",
      paddingHorizontal: 24,
      paddingVertical: 32,
    },
    section: {
      marginBottom: 30,
      borderRadius: 12,
      paddingVertical: 20,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 15,
      textAlign: "left",
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
    },
    option: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 14,
    },
    optionLast: {
      borderBottomWidth: 0, // remover linha da última opção da seção
    },
    optionText: {
      fontSize: 17,
      color: theme.text,
    },
    signOut: {
      marginTop: 40,
      padding: 15,
      alignItems: "center",
      backgroundColor: "#e74c3c",
      borderRadius: 12,
      marginHorizontal: 48,
      // sombra para botão
      shadowColor: "#e74c3c",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.7,
      shadowRadius: 5,
      elevation: 5,
    },
    signOutText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 18,
    },
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Navbar toggleSidebar={toggleSidebar} title="Configurações" />
        {sidebarOpen && (
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={toggleSidebar}
          />
        )}
        <SidebarMenu
          sidebarAnim={sidebarAnim}
          nameUser={nameUser}
          descriptionProfile={descriptionProfile}
          login={login}
          navigationTo={navigationTo}
          handleSignOut={handleSignOut}
          getInitials={getInitials}
        />

        <ScrollView>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferências</Text>
            <TouchableOpacity style={styles.option} onPress={toggleTheme}>
              <Text style={styles.optionText}>Tema</Text>
              <Feather name="moon" size={20} color={theme.text} />
            </TouchableOpacity>
            <View style={styles.option}>
              <Text style={styles.optionText}>Notificações</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={requestNotificationPermission}
                trackColor={{
                  false: "#767577",
                  true: theme.primary || "#4cd137",
                }}
                thumbColor={notificationsEnabled ? "#fff" : "#f4f3f4"}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Permissões</Text>
            <TouchableOpacity style={styles.option} onPress={openCamera}>
              <Text style={styles.optionText}>Abrir câmera</Text>
              <Feather name="camera" size={20} color={theme.text} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}
