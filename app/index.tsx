// app/index.tsx
import { useNavigation, useRouter } from "expo-router";
import React, { useContext, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { ThemeContext } from "../ThemeContext";

export default function Home() {
  const router = useRouter();
  const { scheme, toggle } = useContext(ThemeContext);
  const navigation = useNavigation();

  const isDark = scheme === "dark";

  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const changeLanguage = async (lng: "en" | "mm") => {
    await i18n.changeLanguage(lng);
    setLanguage(lng);
  };

  // Header buttons: Dark mode toggle & Settings button
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Home",
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={toggle} style={styles.headerButton}>
            <Text style={{ color: isDark ? "#fff" : "#000", fontSize: 20 }}>
              {isDark ? "🌞" : "🌙"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/settings")}
            style={styles.headerButton}
          >
            <Text style={{ color: isDark ? "#fff" : "#000", fontSize: 20 }}>
              ⚙️
            </Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, toggle, isDark]);

  // 🎨 Theme colors
  const colors = {
    background: scheme === "dark" ? "#0f172a" : "#f8fafc",
    text: scheme === "dark" ? "white" : "#0f172a",
    subtitle: scheme === "dark" ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)",
    primary: "#7c3aed",
    secondary: scheme === "dark" ? "white" : "#0f172a",
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Section (Title + Subtitle) */}
      <View style={styles.topSection}>
        <Text style={[styles.title, { color: colors.text }]}>Chatbot</Text>
        <Text style={[styles.subtitle, { color: colors.subtitle }]}>
          Chat For Your Privacy
        </Text>
      </View>

      {/* Middle Section (Chat + Check Buttons) */}
      <View style={styles.middleSection}>
        <Pressable
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/chat")}
        >
          <Text style={styles.buttonText}>{t("chat")}</Text>
        </Pressable>
        <Pressable
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/check")}
        >
          <Text style={styles.buttonText}>{t("check")}</Text>
        </Pressable>
      </View>

      {/* Bottom Section (Login + Register Buttons) */}
      <View style={styles.bottomSection}>
        <Pressable
          style={[styles.loginButton, { borderColor: colors.primary }]}
          onPress={() => router.push("/login")}
        >
          <Text style={[styles.loginText, { color: colors.primary }]}>
            {t("login")}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.registerButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/register")}
        >
          <Text style={[styles.registerText, { color: "white" }]}>
            {t("register")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  topSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  middleSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSection: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: "#7c3aed",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    marginBottom: 8,
    width: "60%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  loginButton: {
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 8,
    width: "60%",
    alignItems: "center",
  },
  loginText: {
    fontWeight: "700",
    fontSize: 16,
  },
  registerButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    width: "60%",
    alignItems: "center",
  },
  registerText: {
    fontWeight: "700",
    fontSize: 16,
  },
  headerButton: {
    marginRight: 12,
  },
});
