import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import SwitchTheme from "../../components/switch-theme/switch-theme";
import { FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface SidebarMenuProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  sidebarAnim: Animated.Value;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  sidebarOpen,
  toggleSidebar,
  sidebarAnim,
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { signOut } = useAuth();

  const [nameUser, setNameUser] = React.useState("");
  const [descriptionProfile, setDescriptionProfile] = React.useState("");
  const [login, setLogin] = React.useState("");

  React.useEffect(() => {
    async function loadUserData() {
      const name = await AsyncStorage.getItem("@nameUser");
      const description = await AsyncStorage.getItem("@descriptionProfile");
      const loginStored = await AsyncStorage.getItem("@login");

      setNameUser(name || "");
      setDescriptionProfile(description || "");
      setLogin(loginStored || "");
    }
    loadUserData();
  }, []);

  const navigationTo = (screen: string) => {
    navigation.navigate(screen as never);
    toggleSidebar();
  };

  const handleSignOut = async () => {
    await signOut();
    navigation.navigate("Login" as never);
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    const first = words[0]?.[0] || "";
    const last = words.length > 1 ? words[words.length - 1]?.[0] : "";
    return (first + last).toUpperCase();
  };

  const styles = StyleSheet.create({
    sidebar: {
      position: "absolute",
      top: 0,
      bottom: 0,
      width: 280,
      zIndex: 1000,
      backgroundColor: theme.background,
      paddingHorizontal: 20,
      paddingVertical: 30,
      shadowColor: "#000",
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 20,
    },
    viewProfileRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 40,
      borderBottomWidth: 1,
      paddingBottom: 20,
      borderBottomColor: theme.text,
    },
    initialsCircle: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.backgroundCard,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 15,
    },
    initialsText: {
      fontSize: 22,
      color: theme.text,
      fontWeight: "600",
    },
    viewProfileText: {
      flex: 1,
    },
    profileText: {
      fontSize: 14,
      color: theme.text,
    },
    textStrong: {
      fontWeight: "bold",
      fontSize: 16,
      color: theme.text,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.text || "#F2F2F2",
    },
    icon: {
      marginRight: 16,
      fontSize: 16,
    },
    sidebarItem: {
      fontSize: 16,
      color: theme.text,
      fontWeight: "500",
    },
    menuItemSair: {
      flexDirection: "row",
      borderTopWidth: 1,
      paddingVertical: 14,
      paddingLeft: 6,
      borderTopColor: theme.text,
      borderBottomColor: "transparent",
    },
  });

  return (
    <Animated.View
      style={[styles.sidebar, { transform: [{ translateX: sidebarAnim }] }]}
    >
      <View style={styles.viewProfileRow}>
        <View style={styles.initialsCircle}>
          <Text style={styles.initialsText}>{getInitials(nameUser)}</Text>
        </View>

        <View style={styles.viewProfileText}>
          <Text style={[styles.profileText, styles.textStrong]}>
            {nameUser}
          </Text>
          <Text style={styles.profileText}>{descriptionProfile}</Text>
          <Text style={styles.profileText}>{login}</Text>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigationTo("Home")}
        >
          <FontAwesome5
            name="home"
            size={24}
            color={theme.text}
            style={styles.icon}
          />
          <Text style={styles.sidebarItem}>Painel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigationTo("Profile")}
        >
          <FontAwesome5
            name="user-alt"
            size={24}
            color={theme.text}
            style={styles.icon}
            solid
          />
          <Text style={styles.sidebarItem}>Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigationTo("Config")}
        >
          <FontAwesome5
            name="cog"
            size={24}
            color={theme.text}
            style={styles.icon}
          />
          <Text style={styles.sidebarItem}>Configurações</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigationTo("Veiculo")}
        >
          <FontAwesome5
            name="car"
            size={24}
            color={theme.text}
            style={styles.icon}
          />
          <Text style={styles.sidebarItem}>Veículos</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity>
        <SwitchTheme />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuItem, styles.menuItemSair]}
        onPress={handleSignOut}
      >
        <Feather
          name="log-out"
          size={24}
          color={theme.text}
          style={styles.icon}
        />
        <Text style={styles.sidebarItem}>Sair</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default SidebarMenu;
