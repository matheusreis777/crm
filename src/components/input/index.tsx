// components/Input.tsx
import React from "react";
import { View, TextInput, TextInputProps } from "react-native";
import { TextInputMask } from "react-native-masked-text";
import { styles } from "./styles";

interface InputProps extends TextInputProps {
  type?: "cpf" | "default";
}

export function Input({ type = "default", ...rest }: InputProps) {
  return (
    <View style={styles.container}>
      {type === "cpf" ? (
        <TextInputMask type={"cpf"} style={styles.input} {...rest} />
      ) : (
        <TextInput style={styles.input} {...rest} />
      )}
    </View>
  );
}
