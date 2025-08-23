// app/check.tsx
import { useNavigation, useRouter } from "expo-router";
import React, { useContext, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { ThemeContext } from "../ThemeContext";

export default function CheckPage() {
  const [link, setLink] = useState("");
  const [result, setResult] = useState<null | { message: string; type: "safe" | "phish" | "error" }>(null);

  const router = useRouter();
  const { scheme, toggle } = useContext(ThemeContext);
  const isDark = scheme === "dark";

  const navigation = useNavigation();


      const { t, i18n } = useTranslation();
        const [language, setLanguage] = useState(i18n.language);
      
        const changeLanguage = async (lng: "en" | "mm") => {
          await i18n.changeLanguage(lng); // persisted by languageDetector.cacheUserLanguage
          setLanguage(lng);
        };
  

// Header buttons: Dark mode toggle & Settings button
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Checking",
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          {/* Dark / Light Toggle */}
          <TouchableOpacity onPress={toggle} style={styles.headerButton}>
            <Text style={{ color: isDark ? "#fff" : "#000", fontSize: 20 }}>
              {isDark ? "🌞" : "🌙"}
            </Text>
          </TouchableOpacity>
          {/* Settings Button */}
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

  // Very basic phishing check demo
  const checkPhishing = () => {
    if (!link.trim()) {
      setResult({ message: "⚠️ Please enter a link first", type: "error" });
      return;
    }

    const suspiciousPatterns = ["login", "verify", "@", "bank", "secure-", "update"];
    const isSuspicious = suspiciousPatterns.some((pattern) => link.toLowerCase().includes(pattern));

    if (isSuspicious) {
      setResult({ message: "🚨 This link looks suspicious (possible phishing).", type: "phish" });
    } else {
      setResult({ message: "✅ This link looks safe (no phishing patterns found).", type: "safe" });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#0f172a" : "#f9fafb" }]}>
      <Text style={[styles.title, { color: isDark ? "white" : "black" }]}>
       {t("checkTitle")}
      </Text>

      <TextInput
        style={[styles.input, { backgroundColor: isDark ? "#1e293b" : "white", color: isDark ? "white" : "black" }]}
        placeholder={t("checkPlaceHolder")}
        placeholderTextColor={isDark ? "#94a3b8" : "#888"}
        value={link}
        onChangeText={setLink}
      />

      <Pressable style={styles.button} onPress={checkPhishing}>
        <Text style={styles.buttonText}>{t("check")}</Text>
      </Pressable>

      {result && (
        <View
          style={[
            styles.resultBox,
            result.type === "phish"
              ? { backgroundColor: "#dc2626" } // red
              : result.type === "safe"
              ? { backgroundColor: "#16a34a" } // green
              : { backgroundColor: "#facc15" }, // yellow for error
          ]}
        >
          <Text style={styles.resultText}>{result.message}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  button: {
    backgroundColor: "#7c3aed",
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
    shadowColor: "#7c3aed",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  resultBox: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  resultText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  headerButton: {
    marginRight: 12,
  },
});
