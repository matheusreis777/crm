import React, { useState, useEffect } from "react";
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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import Navbar from "@/src/components/navbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { maskCPF } from "@/src/utils/util";
import SidebarMenu from "../../components/sidebar-menu/SidebarMenu";
import { Input } from "@/src/components/input/input";
import { Button } from "@/src/components/button";
import { useTheme } from "@/src/context/ThemeContext";

const { width } = Dimensions.get("window");

// ...imports (sem alterações)

export default function Profile() {
  const { signOut } = useAuth();
  const navigation = useNavigation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarAnim = useState(new Animated.Value(-width))[0];

  const [nameUser, setNameUser] = useState("");
  const [descriptionProfile, setDescriptionProfile] = useState("");
  const [login, setLogin] = useState("");
  const [phone, setPhone] = useState("");
  const { theme } = useTheme();

  useEffect(() => {
    async function loadUserData() {
      const name = await AsyncStorage.getItem("@nameUser");
      const description = await AsyncStorage.getItem("@descriptionProfile");
      const loginStored = await AsyncStorage.getItem("@login");
      const phone = await AsyncStorage.getItem("@phone");

      setNameUser(name || "");
      setDescriptionProfile(description || "");
      setLogin(maskCPF(loginStored || ""));
      setPhone(phone || "");
    }

    loadUserData();
  }, []);

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

  async function handleSignOut() {
    await signOut();
    navigation.navigate("Login" as never);
  }

  const getInitials = (name: string) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    const first = words[0]?.[0] || "";
    const last = words.length > 1 ? words[words.length - 1]?.[0] : "";
    return (first + last).toUpperCase();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.3)",
      zIndex: 15,
    },
    content: {
      padding: 24,
      paddingTop: 16, // pequeno espaço depois da Navbar
    },
    header: {
      alignItems: "center",
      marginBottom: 20,
    },
    initialsCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.initialsCircle,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
    },
    initialsText: {
      color: "#fff",
      fontSize: 28,
      fontWeight: "bold",
    },
    nameText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
    },
    descriptionText: {
      fontSize: 14,
      color: theme.text,
    },
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        <View style={styles.container}>
          <Navbar toggleSidebar={toggleSidebar} title="Perfil" />

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

          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.header}>
              <View style={styles.initialsCircle}>
                <Text style={styles.initialsText}>{getInitials(nameUser)}</Text>
              </View>
              <Text style={styles.nameText}>{nameUser}</Text>
              <Text style={styles.descriptionText}>{descriptionProfile}</Text>
            </View>

            <Input value={nameUser} placeholder="Nome" editable={false} />
            <Input value={login} placeholder="CPF" editable={false} />
            <Input value={phone} type="phone" placeholder="Telefone" />

            <Button title="Sair" onPress={handleSignOut} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
