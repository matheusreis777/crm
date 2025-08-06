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
  type?: "cpf" | "phone" | "date" | "default";
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
      backgroundColor: "transparent",
      color: theme.text,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.borderColor,
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

  const placeholderTextColor =
    theme.text || (theme.mode === "dark" ? "#aaaaaa" : "#888888");

  // Tipos com máscara
  if (type === "cpf" || type === "phone" || type === "date") {
    let maskType: any = type;
    let options: any = {};

    if (type === "phone") {
      maskType = "cel-phone";
      options = {
        maskType: "BRL",
        withDDD: true,
        dddMask: "(99) ",
      };
    }

    if (type === "date") {
      maskType = "datetime";
      options = {
        format: "DD/MM/YYYY",
      };
    }

    return (
      <View style={styles.container}>
        <TextInputMask
          type={maskType}
          options={options}
          style={styles.input}
          placeholderTextColor={placeholderTextColor}
          {...rest}
        />
      </View>
    );
  }

  // Tipo padrão ou senha
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          secureTextEntry={isPassword && !showPassword}
          placeholderTextColor={placeholderTextColor}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity style={styles.eyeIcon} onPress={toggleShowPassword}>
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color={placeholderTextColor}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
