import "react-native-url-polyfill/auto";

import React from "react";
import { AuthProvider } from "./src/context/AuthContext";
import Index from "./src/app";

export default function App() {
  return (
    <AuthProvider>
      <Index />
    </AuthProvider>
  );
}
