import React, { useEffect } from "react";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/context/AuthContext";
import { CartProvider } from "./src/context/CartContext";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { useFonts } from "expo-font";
import {
  Rajdhani_600SemiBold,
  Rajdhani_700Bold,
} from "@expo-google-fonts/rajdhani";
import { JetBrainsMono_500Medium } from "@expo-google-fonts/jetbrains-mono";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    "Rajdhani-SemiBold": Rajdhani_600SemiBold,
    "Rajdhani-Bold": Rajdhani_700Bold,
    "JetBrainsMono-Medium": JetBrainsMono_500Medium,
  });
  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);
  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <AppNavigator />
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
