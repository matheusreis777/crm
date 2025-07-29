import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  view: {
    flex: 1,
    padding: 28,
    gap: 16,
    paddingTop: 0,
    justifyContent: "center",
  },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Poppins",
    textAlign: "right",
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    fontFamily: "Poppins",
  },
});
