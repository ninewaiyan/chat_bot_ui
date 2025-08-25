// app/home.tsx
import { useNavigation, useRouter } from "expo-router";
import React, { useContext, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { ThemeContext } from "../ThemeContext";

export default function Home() {
    const router = useRouter();
    const { scheme, toggle } = useContext(ThemeContext);
    const navigation = useNavigation();
    const isDark = scheme === "dark";

    const { t } = useTranslation();

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

    const colors = {
        background: scheme === "dark" ? "#121212" : "#f8fafc", // Softer dark (like login/register)
        text: scheme === "dark" ? "#ffffff" : "#0f172a",
        subtitle: scheme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
        primary: "#7c3aed", // Purple accent
        tipBackground: scheme === "dark" ? "#1e1e1e" : "#ffffff", // Softer dark box
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>

            {/* Top Section */}
            <View style={styles.topSection}>
                <Text style={[styles.title, { color: colors.text }]}>ChatAi</Text>
                <Text style={[styles.subtitle, { color: colors.subtitle }]}>
                    Chat For Your Privacy
                </Text>
                 <Text style={[styles.subtitle2, { color: colors.subtitle }]}>
                   Cybersecurity Awareness for Myanmar Citizens
                </Text>
            </View>

            {/* Daily Tip Box */}
            <View style={[styles.tipBox, { backgroundColor: colors.tipBackground }]}>
                <Text style={[styles.tipText, { color: colors.text }]}>
                    💡 Daily Tip: Always check URLs before clicking links in messages to avoid phishing scams!
                    Never enter your personal information unless you are sure the site is legitimate.
                    Remember to verify the sender and avoid shortcuts that seem suspicious, even from trusted contacts.        </Text>
                <Pressable
                    style={[styles.learnMoreButton, { backgroundColor: colors.primary }]}
                    onPress={() => router.push("/tip")}
                >
                    <Text style={styles.learnMoreText}>{t("learn_more")}</Text>
                </Pressable>
            </View>

            {/* Chat + Check Buttons */}
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
        marginTop: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: "800",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 24,
    },
      subtitle2: {
        fontSize: 18,
        marginBottom: 24,
    },
    tipBox: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },
    tipText: {
        fontSize: 14,
        marginBottom: 10,
    },
    learnMoreButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignSelf: "flex-start",
    },
    learnMoreText: {
        color: "#fff",
        fontWeight: "700",
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
        marginBottom: 12,
        width: "60%",
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16,
    },
    headerButton: {
        marginRight: 12,
    },
});
