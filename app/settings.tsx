// app/settings.tsx
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Modal, Portal, Provider, Switch, TextInput } from "react-native-paper";
import { ThemeContext } from "../ThemeContext";

export default function Settings() {
  const router = useRouter();
  const { scheme, toggle } = useContext(ThemeContext);
  const isDark = scheme === "dark";

  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const changeLanguage = async (lng: "en" | "mm") => {
    await i18n.changeLanguage(lng);
    setLanguage(lng);
  };

  // --- User Info ---
  const [userName, setUserName] = useState("John Doe");
  const [previousName, setPreviousName] = useState("John Doe");
  const [userPhone, setUserPhone] = useState("+959123456789");

  // --- Modal state ---
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [nameInput, setNameInput] = useState(userName);

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [success, setSuccess] = useState("");

  // Eye toggle
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleUpdateName = () => {
    if (!nameInput.trim() || nameInput === previousName) return;
    setUserName(nameInput);
    setPreviousName(nameInput);
    setNameModalVisible(false);
  };

  const handleChangePassword = () => {
    setPasswordError("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    console.log("🔑 Change Password:", { currentPassword, newPassword });
    setSuccess("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordModalVisible(false);
  };

  const passwordStrength = (password: string) => {
    if (!password) return "";
    if (password.length < 6) return "Weak 🔴";
    if (/[A-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*]/.test(password)) return "Strong 🔵";
    return "Medium 🟠";
  };

  const strengthColor = (strength: string) => {
    if (strength.includes("Strong")) return "blue";
    if (strength.includes("Medium")) return "orange";
    if (strength.includes("Weak")) return "red";
    return "gray";
  };

  const handleLogout = () => {
    console.log("User logged out");
    router.replace("/login");
  };

  return (
    <Provider>
      <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#fff" }]}>
        {/* --- Centered Header Section --- */}
        <View style={styles.centerHeader}>
          <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>{t("settings")}</Text>

          {/* User Info */}
          <TouchableOpacity onPress={() => {
            setNameInput(userName);
            setNameModalVisible(true);
          }} style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: isDark ? "#fff" : "#000" }}>
              {userName}
            </Text>
            <Text style={{ color: isDark ? "#aaa" : "#555" }}>{userPhone}</Text>
          </TouchableOpacity>
        </View>

        {/* Dark Mode */}
        <View style={styles.row}>
          <Text style={{ color: isDark ? "#fff" : "#000", fontSize: 18 }}>{t("darkMode")}</Text>
          <Switch value={isDark} onValueChange={toggle} />
        </View>

        {/* Auto Speak */}
        <View style={styles.row}>
          <Text style={{ color: isDark ? "#fff" : "#000", fontSize: 18 }}>{t("suggestion")}</Text>
          <Switch />
        </View>

        {/* Language */}
        <View style={styles.row}>
          <Text style={{ color: isDark ? "#fff" : "#000", fontSize: 18 }}>{t("language")}</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {/* English Button */}
            <Pressable
              onPress={() => changeLanguage("en")}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
                backgroundColor: language.startsWith("en") ? "#d269ffff" : "transparent",
                borderWidth: language.startsWith("en") ? 0 : 1,
                borderColor: "#dc69ffff",
              }}
            >
              <Text style={{ color: language.startsWith("en") ? "#fff" : "#dc69ffff", fontSize: 16, fontWeight: "500" }}>
                {t("english")}
              </Text>
            </Pressable>

            {/* Myanmar Button */}
            <Pressable
              onPress={() => changeLanguage("mm")}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
                backgroundColor: language.startsWith("mm") || language.startsWith("my") ? "#d269ffff" : "transparent",
                borderWidth: language.startsWith("mm") || language.startsWith("my") ? 0 : 1,
                borderColor: "#dc69ffff",
              }}
            >
              <Text style={{ color: language.startsWith("mm") || language.startsWith("my") ? "#fff" : "#dc69ffff", fontSize: 16, fontWeight: "500" }}>
                {t("myanmar")}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Change Password */}
        <Pressable style={styles.pinkButton} onPress={() => setPasswordModalVisible(true)}>
          <Text style={styles.pinkButtonText}>{t("change_password")}</Text>
        </Pressable>

        {/* Logout */}
        <Pressable style={styles.pinkButton} onPress={handleLogout}>
          <Text style={styles.pinkButtonText}>{t("logout")}</Text>
        </Pressable>

        {/* Back Home */}
        <Pressable style={styles.pinkButton} onPress={() => router.push("/home")}>
          <Text style={styles.pinkButtonText}>{t("backHome")}</Text>
        </Pressable>

        {/* --- Modal for Name Edit --- */}
        <Portal>
          <Modal
            visible={nameModalVisible}
            onDismiss={() => setNameModalVisible(false)}
            contentContainerStyle={[styles.modalContainer, { backgroundColor: isDark ? "#222" : "#fff" }]}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15, color: isDark ? "#fff" : "#000" }}>
              {t("edit_name")}
            </Text>
            <TextInput
              label={t("name")}
              value={nameInput}
              onChangeText={setNameInput}
              style={styles.input}
            />
            <Pressable
              onPress={handleUpdateName}
              disabled={!nameInput.trim() || nameInput === previousName}
              style={{
                backgroundColor: !nameInput.trim() || nameInput === previousName ? "#FFC0CB" : "#FF69B4",
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                opacity: !nameInput.trim() || nameInput === previousName ? 0.6 : 1,
                marginBottom: 10,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "500" }}>{t("update")}</Text>
            </Pressable>
            <Pressable
              onPress={() => setNameModalVisible(false)}
              style={{ paddingVertical: 10, alignItems: "center" }}
            >
              <Text style={{ color: "#FF69B4", fontSize: 16, fontWeight: "500" }}>{t("cancel")}</Text>
            </Pressable>
          </Modal>
        </Portal>

        {/* --- Modal for Change Password --- */}
        <Portal>
          <Modal
            visible={passwordModalVisible}
            onDismiss={() => setPasswordModalVisible(false)}
            contentContainerStyle={[styles.modalContainer, { backgroundColor: isDark ? "#222" : "#fff" }]}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15, color: isDark ? "#fff" : "#000" }}>
              {t("change_password")}
            </Text>

            <TextInput
              label={t("current_password")}
              value={currentPassword}
              secureTextEntry={!showCurrent}
              onChangeText={setCurrentPassword}
              style={styles.input}
              right={<TextInput.Icon icon={showCurrent ? "eye-off" : "eye"} onPress={() => setShowCurrent(!showCurrent)} />}
            />
            <TextInput
              label={t("new_password")}
              value={newPassword}
              secureTextEntry={!showNew}
              onChangeText={setNewPassword}
              style={styles.input}
              right={<TextInput.Icon icon={showNew ? "eye-off" : "eye"} onPress={() => setShowNew(!showNew)} />}
            />
            <Text style={{ color: strengthColor(passwordStrength(newPassword)), marginBottom: 10 }}>
              {newPassword ? `Strength: ${passwordStrength(newPassword)}` : ""}
            </Text>
            <TextInput
              label={t("confirm_password")}
              value={confirmPassword}
              secureTextEntry={!showConfirm}
              onChangeText={setConfirmPassword}
              style={styles.input}
              right={<TextInput.Icon icon={showConfirm ? "eye-off" : "eye"} onPress={() => setShowConfirm(!showConfirm)} />}
            />
            {passwordError ? <Text style={{ color: "red", marginBottom: 10 }}>{passwordError}</Text> : null}
            {success ? <Text style={{ color: "green", marginBottom: 10 }}>{success}</Text> : null}

            <Pressable
              onPress={handleChangePassword}
              disabled={passwordStrength(newPassword) !== "Strong 🔵" || newPassword !== confirmPassword}
              style={{
                backgroundColor: passwordStrength(newPassword) === "Strong 🔵" && newPassword === confirmPassword ? "#FF69B4" : "#FFC0CB",
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                opacity: passwordStrength(newPassword) === "Strong 🔵" && newPassword === confirmPassword ? 1 : 0.6,
                marginBottom: 10,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "500" }}>{t("change")}</Text>
            </Pressable>
            <Pressable onPress={() => setPasswordModalVisible(false)} style={{ paddingVertical: 10, alignItems: "center" }}>
              <Text style={{ color: "#FF69B4", fontSize: 16, fontWeight: "500" }}>{t("cancel")}</Text>
            </Pressable>
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-start", padding: 20 },
  centerHeader: { alignItems: "center", marginBottom: 30 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalContainer: { padding: 20, margin: 20, borderRadius: 12 },
  input: { marginBottom: 10, backgroundColor: "transparent" },
  pinkButton: {
    backgroundColor: "#a46adbff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  pinkButtonText: { color: "#fff", fontSize: 16, fontWeight: "500" },
});
