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
  StatusBar,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import Navbar from "@/src/components/navbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { maskCPF } from "@/src/utils/util";
import SidebarMenu from "../../components/sidebar-menu/SidebarMenu";

const { width } = Dimensions.get("window");

export default function ViewDefault() {
  const { signOut } = useAuth();
  const navigation = useNavigation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarAnim = useState(new Animated.Value(-width))[0];

  const [nameUser, setNameUser] = useState("");
  const [descriptionProfile, setDescriptionProfile] = useState("");
  const [login, setLogin] = useState("");
  const [isDarkTheme, setIsDarkTheme] = useState(true);

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

  const toggleTheme = () => {
    setIsDarkTheme((prev) => !prev);
  };

  async function handleSignOut() {
    await signOut();
    navigation.navigate("Login" as never);
  }

  function navigationTo(caminho: string) {
    navigation.navigate(caminho as never);
  }

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkTheme ? "#121212" : "#f5f5f5",
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      color: "#fff",
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
    },
    button: {
      backgroundColor: isDarkTheme ? "#173fd2ff" : "#007AFF",
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
    },
    buttonText: {
      color: "#fff",
      fontSize: 18,
    },
    sidebar: {
      position: "absolute",
      top: 0,
      bottom: 0,
      width: width * 0.7,
      backgroundColor: isDarkTheme ? "#121212" : "#f5f5f5",
      paddingTop: StatusBar.currentHeight || 20,
      elevation: 5,
      zIndex: 20,
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
    viewProfileRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: 40,
      paddingBottom: 20,
      paddingLeft: 18,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },

    initialsCircle: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: "#007AFF",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },

    initialsText: {
      color: isDarkTheme ? "#ffffff" : "#000",
      fontSize: 24,
      fontWeight: "bold",
    },

    viewProfileText: {
      flex: 1,
    },

    textStrong: {
      fontWeight: 700,
    },

    profileText: {
      fontSize: 16,
      color: isDarkTheme ? "#ffffff" : "#000",
    },

    sidebarItem: {
      fontSize: 16,
      color: isDarkTheme ? "#ffffff" : "#000",
      fontWeight: "500",
    },

    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 20,
      backgroundColor: isDarkTheme ? "#121212" : "#f5f5f5",
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
    },

    menuItemSair: {
      paddingBottom: 40,
    },

    icon: {
      marginRight: 16,
      color: isDarkTheme ? "#ffffff" : "#000",
    },

    themeToggleButton: {
      position: "absolute",
      top: (StatusBar.currentHeight || 20) + 10,
      right: 20,
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: isDarkTheme ? "#333" : "#ddd",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
      zIndex: 100,
    },
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Navbar toggleSidebar={toggleSidebar} title="Default" />
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
      </View>
    </TouchableWithoutFeedback>
  );
}
