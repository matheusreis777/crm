import React, { useState } from "react";
import {
  View,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/src/context/ThemeContext";

interface InputProps extends TextInputProps {
  type?: "cpf" | "phone" | "date" | "plate" | "default";
  isPassword?: boolean;
}

export function Input({
  type = "default",
  isPassword = false,
  value,
  onChangeText,
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

  const handlePlateChange = (text?: string) => {
    if (!text) {
      onChangeText && onChangeText("");
      return;
    }

    let cleaned = text.toUpperCase().replace(/[^A-Z0-9]/g, "");

    if (cleaned.length > 7) cleaned = cleaned.slice(0, 7);

    let formatted = cleaned;

    if (cleaned.length > 3) {
      formatted = cleaned.slice(0, 3) + "-" + cleaned.slice(3);
    }

    onChangeText && onChangeText(formatted);
  };

  if (type === "plate") {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholderTextColor={placeholderTextColor}
          autoCapitalize="characters"
          value={value}
          onChangeText={handlePlateChange}
          keyboardType="default"
          maxLength={8}
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
          placeholderTextColor={placeholderTextColor}
          value={value}
          onChangeText={onChangeText}
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
