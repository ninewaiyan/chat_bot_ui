// app/settings.tsx
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { Button, Switch } from "react-native-paper";
import { ThemeContext } from "../ThemeContext";

export default function Settings() {
  const router = useRouter();
  const { scheme, toggle } = useContext(ThemeContext);
  const isDark = scheme === "dark";

  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const changeLanguage = async (lng: "en" | "mm") => {
    await i18n.changeLanguage(lng); // persisted by languageDetector.cacheUserLanguage
    setLanguage(lng);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#fff" }]}>
      <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>{t("settings")}</Text>

      {/* Dark Mode */}
      <View style={styles.row}>
        <Text style={{ color: isDark ? "#fff" : "#000", fontSize: 18 }}>{t("darkMode")}</Text>
        <Switch value={isDark} onValueChange={toggle} />
      </View>

            {/* Auto Speak*/}
      <View style={styles.row}>
        <Text style={{ color: isDark ? "#fff" : "#000", fontSize: 18 }}>{t("suggestion")}</Text>
        <Switch />
      </View>

      {/* Language */}
      <View style={styles.row}>
        <Text style={{ color: isDark ? "#fff" : "#000", fontSize: 18 }}>{t("language")}</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Button
            mode={language.startsWith("en") ? "contained" : "outlined"}
            onPress={() => changeLanguage("en")}
          >
            {t("english")}
          </Button>
          <Button
            mode={language.startsWith("mm") || language.startsWith("my") ? "contained" : "outlined"}
            onPress={() => changeLanguage("mm")}
          >
            {t("myanmar")}
          </Button>
        </View>
      </View>

      <Button mode="contained" onPress={() => router.push("/")}>
        {t("backHome")}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 40, textAlign: "center" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  }
});
