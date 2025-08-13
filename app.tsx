import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider } from "./src/context/AuthContext";
import { ThemeProvider } from "./src/context/ThemeContext";
import Toast from "react-native-toast-message";

import Index from "./src/app";
import Home from "./src/view/Home/home";
import Profile from "./src/view/Profile/profile";
import Config from "./src/view/Config/config";
import Intro from "./src/view/Intro/intro";
import Veiculo from "./src/view/Veiculo/veiculo";
import { toastConfig } from "./src/components/alerts/toastConfig";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Login" component={Index} />
              <Stack.Screen name="Intro" component={Intro} />
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="Config" component={Config} />
              <Stack.Screen name="Veiculo" component={Veiculo} />
            </Stack.Navigator>
          </NavigationContainer>
          <Toast config={toastConfig} />
        </>
      </AuthProvider>
    </ThemeProvider>
  );
}
