import React, { useState } from "react";
import {
  View,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { TextInputMask } from "react-native-masked-text";
import { Feather } from "@expo/vector-icons";

interface InputProps extends TextInputProps {
  type?: "cpf" | "default";
  isPassword?: boolean;
  isDark?: boolean; // nova prop para tema
}

export function Input({
  type = "default",
  isPassword = false,
  isDark = false,
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const styles = StyleSheet.create({
    container: {
      marginVertical: 8,
    },
    inputWrapper: {
      position: "relative",
      justifyContent: "center",
    },
    input: {
      height: 50,
      backgroundColor: "transparent",
      color: isDark ? "#ffffff" : "#000", // corrigido aqui
      borderRadius: 8,
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: isDark ? "#444" : "#ccc",
      paddingHorizontal: 16,
      fontSize: 16,
    },
    eyeIcon: {
      position: "absolute",
      right: 16,
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      padding: 4,
    },
  });

  if (type === "cpf") {
    return (
      <View style={styles.container}>
        <TextInputMask
          type={"cpf"}
          style={styles.input}
          placeholderTextColor={isDark ? "#aaa" : "#888"}
          {...rest}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          secureTextEntry={isPassword && !showPassword}
          placeholderTextColor={isDark ? "#aaa" : "#888"}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity style={styles.eyeIcon} onPress={toggleShowPassword}>
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color={isDark ? "#eee" : "#000"}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
