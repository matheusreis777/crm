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
import { useTheme } from "@/src/context/ThemeContext";

interface InputProps extends TextInputProps {
  type?: "cpf" | "default";
  isPassword?: boolean;
}

export function Input({
  type = "default",
  isPassword = false,
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const styles = StyleSheet.create({
    container: {
      marginVertical: 10,
    },
    inputWrapper: {
      position: "relative",
      justifyContent: "center",
    },
    input: {
      height: 52,
      backgroundColor:
        theme.background || (theme.mode === "dark" ? "#1e1e1e" : "#f2f2f2"),
      color: theme.text || (theme.mode === "dark" ? "#ffffff" : "#000000"),
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.text || (theme.mode === "dark" ? "#444" : "#ccc"),
      paddingHorizontal: 16,
      fontSize: 16,
    },
    eyeIcon: {
      position: "absolute",
      right: 16,
      top: 0,
      bottom: 0,
      justifyContent: "center",
    },
  });

  // CPF Mask
  if (type === "cpf") {
    return (
      <View style={styles.container}>
        <TextInputMask
          type="cpf"
          style={styles.input}
          placeholderTextColor={
            theme.text || (theme.mode === "dark" ? "#aaaaaa" : "#888888")
          }
          {...rest}
        />
      </View>
    );
  }

  // Default Input
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          secureTextEntry={isPassword && !showPassword}
          placeholderTextColor={
            theme.text || (theme.mode === "dark" ? "#aaaaaa" : "#888888")
          }
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity style={styles.eyeIcon} onPress={toggleShowPassword}>
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color={
                theme.text || (theme.mode === "dark" ? "#eeeeee" : "#666666")
              }
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
