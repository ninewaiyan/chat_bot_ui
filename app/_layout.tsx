// app/_layout.tsx
import { BlurView } from "expo-blur";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { useColorScheme } from "react-native";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";
import "../i18n";
import { ThemeContext } from "../ThemeContext";

export default function RootLayout() {
  const systemScheme = useColorScheme();
  const [overrideTheme, setOverrideTheme] = useState<"system" | "light" | "dark">("system");

  const scheme = overrideTheme === "system" ? systemScheme : overrideTheme;
  const toggle = () => setOverrideTheme((prev) => (prev === "dark" ? "light" : "dark"));
  const isDark = scheme === "dark";

  return (
    <SafeAreaProvider>
      <Toaster />
      <ThemeContext.Provider value={{ scheme, toggle }}>
        <Stack
          screenOptions={{
            headerTransparent: true,
            headerTitleAlign: "center",
            headerBackground: () => (
              <BlurView
                tint={isDark ? "dark" : "light"}
                intensity={50}
                style={{ flex: 1 }}
              />
            ),
            headerTintColor: isDark ? "#fff" : "#000",
          }}
        >
          {/* Settings screen override */}
          <Stack.Screen
            name="settings"
            options={{
              headerTransparent: false, // disable blur
              headerBackground: undefined, // remove BlurView
              headerStyle: { backgroundColor: isDark ? "#121212" : "#fff" },
              headerTintColor: isDark ? "#fff" : "#000",
            }}
          />
        </Stack>
      </ThemeContext.Provider>
    </SafeAreaProvider>
  );
}
