import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
  },
  input: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "white",
    fontFamily: "Poppins",
    paddingRight: 40, // ⚠️ espaço pro ícone não ficar em cima do texto
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 14, // centraliza verticalmente (ajuste conforme altura)
  },
});
