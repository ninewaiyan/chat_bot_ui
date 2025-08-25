// app/login.tsx
import { useNavigation, useRouter } from "expo-router";
import React, { useContext, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import { ThemeContext } from "../ThemeContext";

export default function Login() {
  const { scheme, toggle } = useContext(ThemeContext);
  const isDark = scheme === "dark";
  const router = useRouter();
  const navigation = useNavigation();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");


  const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language);
  
    const changeLanguage = async (lng: "en" | "mm") => {
      await i18n.changeLanguage(lng);
      setLanguage(lng);
    };

  // Header with theme toggle + settings button
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Login",
      headerRight: () => (
        <View style={{ flexDirection: "row", marginRight: 10 }}>
          <TouchableOpacity onPress={toggle} style={styles.headerButton}>
            <Text style={{ color: isDark ? "#fff" : "#000", fontSize: 20 }}>
              {isDark ? "🌞" : "🌙"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/settings")} style={styles.headerButton}>
            <Text style={{ color: isDark ? "#fff" : "#000", fontSize: 20 }}>⚙️</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, toggle, isDark]);

  const handleLogin = () => {
    if (!phoneNumber || !password) {
      setError("Please fill all fields");
      return;
    }
    console.log("📌 Login Data:", { phoneNumber, password });
    alert("✅ Login success (check console)");
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#fff" }]}>

           {/* --- Welcome Title --- */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>{t("welcome")}</Text>
        <Text style={[styles.subtitle, { color: isDark ? "#aaa" : "#555" }]}>
          {t("login_title")}
        </Text>
      </View>

      <TextInput
        style={[styles.input, { borderColor: isDark ? "#bbb" : "#333", color: isDark ? "#fff" : "#000" }]}
        placeholder={t("phone")}
        placeholderTextColor={isDark ? "#aaa" : "#555"}
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <TextInput
        style={[styles.input, { borderColor: isDark ? "#bbb" : "#333", color: isDark ? "#fff" : "#000" }]}
        placeholder= {t("password")}
        placeholderTextColor={isDark ? "#aaa" : "#555"}
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Text style={{ color: isDark ? "#4da6ff" : "#007bff", marginBottom: 10 }}>
          {showPassword ? t("hide"): t("show")}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/forgetpassword")}>
        <Text style={{ color: isDark ? "#4da6ff" : "#007bff", marginBottom: 15 }}>{t("forgot_password")}</Text>
      </TouchableOpacity>

      <Button mode="contained" onPress={handleLogin} style={styles.button} disabled={!phoneNumber || !password}>
        {t("login")}
      </Button>

      <Button mode="outlined" onPress={() => router.push("/home")} style={styles.button}>
        {t("home")}
      </Button>

      <Button mode="outlined" onPress={() => router.push("/register")} style={styles.button}>
        {t("register")}
      </Button>

   

      {error ? <Text style={{ color: "red", marginTop: 10 }}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  headerButton: { marginLeft: 15 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 10, fontSize: 16 },
  button: { marginBottom: 15 },
  subtitle: { fontSize: 16 },
  header: { marginBottom: 40, alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 5 },
});
