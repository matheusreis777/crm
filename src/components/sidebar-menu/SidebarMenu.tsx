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
import { useTheme } from "../../context/ThemeContext";
import SwitchTheme from "../../components/switch-theme/switch-theme";

type Props = {
  sidebarAnim: Animated.Value;
  nameUser: string;
  descriptionProfile: string;
  login: string;
  navigationTo: (screen: string) => void;
  handleSignOut: () => void;
  getInitials: (name: string) => string;
};

const SidebarMenu: React.FC<Props> = ({
  sidebarAnim,
  nameUser,
  descriptionProfile,
  login,
  navigationTo,
  handleSignOut,
  getInitials,
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    sidebar: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      width: 280,
      zIndex: 999,
      backgroundColor: theme.background,
      paddingHorizontal: 20,
      paddingVertical: 30,
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
    <Animated.View style={[styles.sidebar, { left: sidebarAnim }]}>
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
          <Feather
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
          <Feather
            name="user"
            size={24}
            color={theme.text}
            style={styles.icon}
          />
          <Text style={styles.sidebarItem}>Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigationTo("Config")}
        >
          <Feather
            name="settings"
            size={24}
            color={theme.text}
            style={styles.icon}
          />
          <Text style={styles.sidebarItem}>Configurações</Text>
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
