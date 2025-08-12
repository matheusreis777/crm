import "react-native-url-polyfill/auto";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider } from "./src/context/AuthContext";
import Index from "./src/app";
import Home from "./src/view/Home/home";
import Profile from "./src/view/Profile/profile";
import Config from "./src/view/Config/config";
import Intro from "./src/view/Intro/intro";
import { ThemeProvider } from "./src/context/ThemeContext";
import Veiculo from "./src/view/Veiculo/veiculo";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={Index}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Intro"
              component={Intro}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Profile"
              component={Profile}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Config"
              component={Config}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Veiculo"
              component={Veiculo}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </ThemeProvider>
  );
}
