import Toast from "react-native-toast-message";

type ToastType = "success" | "error" | "info";

interface ShowToastProps {
  message: string;
  description?: string;
  type?: ToastType;
}

let toastQueue: ShowToastProps[] = [];
let isShowing = false;

const showNext = () => {
  if (toastQueue.length === 0) {
    isShowing = false;
    return;
  }

  isShowing = true;
  const nextToast = toastQueue.shift()!;
  Toast.show({
    type: nextToast.type || "success",
    props: { ...nextToast },
    position: "bottom",
    bottomOffset: 20,
    visibilityTime: 3000,
    onHide: showNext,
  });
};

const ToastService = {
  show: ({ message, description, type = "success" }: ShowToastProps) => {
    toastQueue.push({ message, description, type });
    if (!isShowing) showNext();
  },

  success: (message: string, description?: string) =>
    ToastService.show({ message, description, type: "success" }),

  error: (message: string, description?: string) =>
    ToastService.show({ message, description, type: "error" }),

  info: (message: string, description?: string) =>
    ToastService.show({ message, description, type: "info" }),
};

export default ToastService;
