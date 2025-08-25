import { useNavigation, useRouter } from "expo-router";
import React, { useContext, useLayoutEffect, useRef, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../ThemeContext";

export default function TipPage() {
  const router = useRouter();
  const { scheme, toggle } = useContext(ThemeContext);
  const isDark = scheme === "dark";

  const navigation = useNavigation();
  

  const colors = {
    background: isDark ? "#121212" : "#f8fafc",
    text: isDark ? "#fff" : "#0f172a",
    subtitle: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)",
    cardBackground: isDark ? "#1a1a1a" : "#fff",
    primary: "#7c3aed",
  };

      const [isPending, startTransition] = useTransition();
      const otpInputs = useRef<TextInput[]>([]);
  
      const { t, i18n } = useTranslation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Tips",
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
  const tips = [

    { title: "🔒 Protect Your Password", content: "Always use strong and unique passwords for each of your accounts. Avoid using easily guessable passwords like '123456' or 'password'." },
    { title: "⚠️ Beware of Phishing", content: "Do not click on suspicious links or attachments in emails, messages, or social media. Always verify the sender before responding." },
    { title: "🛡️ Use Two-Factor Authentication", content: "Enable two-factor authentication (2FA) on your important accounts to add an extra layer of security." },
    { title: "📱 Keep Software Updated", content: "Regularly update your apps and operating system to protect against vulnerabilities and security risks." },
    { title: "🕵️ Privacy Awareness", content: "Be careful about what personal information you share online. Check app permissions and privacy settings regularly." },
      { title: "🔒 Protect Your Password", content: "Always use strong and unique passwords for each of your accounts. Avoid using easily guessable passwords like '123456' or 'password'." },
    { title: "⚠️ Beware of Phishing", content: "Do not click on suspicious links or attachments in emails, messages, or social media. Always verify the sender before responding." },
    { title: "🛡️ Use Two-Factor Authentication", content: "Enable two-factor authentication (2FA) on your important accounts to add an extra layer of security." },
    { title: "📱 Keep Software Updated", content: "Regularly update your apps and operating system to protect against vulnerabilities and security risks." },
    { title: "🕵️ Privacy Awareness", content: "Be careful about what personal information you share online. Check app permissions and privacy settings regularly." },
      { title: "🔒 Protect Your Password", content: "Always use strong and unique passwords for each of your accounts. Avoid using easily guessable passwords like '123456' or 'password'." },
    { title: "⚠️ Beware of Phishing", content: "Do not click on suspicious links or attachments in emails, messages, or social media. Always verify the sender before responding." },
    { title: "🛡️ Use Two-Factor Authentication", content: "Enable two-factor authentication (2FA) on your important accounts to add an extra layer of security." },
    { title: "📱 Keep Software Updated", content: "Regularly update your apps and operating system to protect against vulnerabilities and security risks." },
    { title: "🕵️ Privacy Awareness", content: "Be careful about what personal information you share online. Check app permissions and privacy settings regularly." },
  ];


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Title under header bar */}
        <Text style={[styles.pageTitle, { color: colors.text }]}>{t('tip_title')}</Text>

        {tips.map((tip, index) => (
          <View
            key={index}
            style={[styles.tipCard, { backgroundColor: colors.cardBackground }]}
          >
            <Text style={[styles.tipTitle, { color: colors.text }]}>{tip.title}</Text>
            <Text style={[styles.tipContent, { color: colors.subtitle }]}>{tip.content}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 20,
    marginTop:50,
    textAlign: "center",
  },
  tipCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  tipContent: {
    fontSize: 14,
    lineHeight: 20,
  },

   headerButton: { marginLeft: 15 },
});
