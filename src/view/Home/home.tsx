import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./style";

export default function Home() {
  const { signOut } = useAuth();
  const navigation = useNavigation();

  async function handleSignOut() {
    await signOut();
    navigation.navigate("Login" as never); // 👈 Volta pra tela de Login
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 Bem-vindo à Home!</Text>

      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}
