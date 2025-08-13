import { View, Text, StyleSheet, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";

const toastConfig = {
  success: ({ props }: any) => <ToastItem props={props} type="success" />,
  error: ({ props }: any) => <ToastItem props={props} type="error" />,
  info: ({ props }: any) => <ToastItem props={props} type="info" />,
};

const ToastItem = ({
  props,
  type,
}: {
  props: any;
  type: "success" | "error" | "info";
}) => {
  const slideAnim = new Animated.Value(50); // posição inicial
  Animated.timing(slideAnim, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  }).start();

  return (
    <Animated.View
      style={[
        styles.toast,
        type === "success"
          ? styles.success
          : type === "error"
          ? styles.error
          : styles.info,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Feather
        name={
          type === "success"
            ? "check-circle"
            : type === "error"
            ? "x-circle"
            : "info"
        }
        size={24}
        color="#fff"
      />
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.toastTitle}>{props.message}</Text>
        {props.description && (
          <Text style={styles.toastDesc}>{props.description}</Text>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    alignItems: "center",
    backgroundColor: "#333",
  },
  toastTitle: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  toastDesc: { color: "#fff", fontSize: 14 },
  success: { backgroundColor: "#4caf50" },
  error: { backgroundColor: "#f44336" },
  info: { backgroundColor: "#2196f3" },
});

export { toastConfig };
