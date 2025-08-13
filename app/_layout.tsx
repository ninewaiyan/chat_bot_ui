// app/_layout.tsx
import { Stack } from "expo-router";
import React, { useState } from "react";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";
import { ThemeContext } from "../ThemeContext";

export default function RootLayout() {
  const systemScheme = useColorScheme();
  const [overrideTheme, setOverrideTheme] = useState<"system" | "light" | "dark">("system");

  const scheme = overrideTheme === "system" ? systemScheme : overrideTheme;
  const toggle = () => setOverrideTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <SafeAreaProvider>
      <Toaster />
      <ThemeContext.Provider  value={{ scheme, toggle }}>
        <Stack
            screenOptions={{
            headerShown:true,
            headerTitleAlign: "center",
          }}
        />

      </ThemeContext.Provider>
    </SafeAreaProvider>
  );
}
