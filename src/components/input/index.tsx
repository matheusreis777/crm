import React, { useState } from "react";
import {
  View,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { TextInputMask } from "react-native-masked-text";
import { Feather } from "@expo/vector-icons";
import { styles } from "./styles";

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

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (type === "cpf") {
    return (
      <View style={styles.container}>
        <TextInputMask type={"cpf"} style={styles.input} {...rest} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          secureTextEntry={isPassword && !showPassword}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity style={styles.eyeIcon} onPress={toggleShowPassword}>
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
