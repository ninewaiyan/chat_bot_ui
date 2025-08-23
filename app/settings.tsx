// app/settings.tsx
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, Modal, Portal, Provider, Switch, TextInput } from "react-native-paper";
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
  const [editingName, setEditingName] = useState(false);

  const handleUpdateName = () => {
    console.log("Updated Name:", userName);
    setPreviousName(userName); // save new value
    setEditingName(false);
  };


  // --- Modal state ---
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [success, setSuccess] = useState("");

  // Eye toggle
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
    hideModal();
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
          <View style={styles.userSection}>
            {editingName ? (
              <View style={{ width: "100%" }}>
                <TextInput
                  label={t("name")}
                  value={userName}
                  onChangeText={setUserName}
                  style={{ marginBottom: 5, backgroundColor: "transparent" }}
                />
                <Button
                  mode="contained"
                  onPress={handleUpdateName}
                  style={{ marginBottom: 5 }}
                  disabled={!userName.trim() || userName === previousName} // disable if empty or unchanged
                >
                 {t("update")}
                </Button>
                <Button
                  mode="text"
                  onPress={() => {
                    setUserName(previousName); // revert to previous value
                    setEditingName(false);
                  }}
                >
                  {t("cancel")}
                </Button>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setEditingName(true)} style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 18, fontWeight: "bold", color: isDark ? "#fff" : "#000" }}>
                  {userName}
                </Text>
                <Text style={{ color: isDark ? "#aaa" : "#555" }}>{userPhone}</Text>
              </TouchableOpacity>
            )}
          </View>


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

        {/* Change Password Button */}
        <Button mode="contained" onPress={showModal} style={{ marginBottom: 10 }}>
          {t("change_password")}
        </Button>

        {/* Logout */}
        <Button mode="contained" onPress={handleLogout} style={{ marginBottom: 10 }}>
          {t("logout")}
        </Button>

        <Button mode="contained" onPress={() => router.push("/")}>
          {t("backHome")}
        </Button>

        {/* --- Modal for Change Password --- */}
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
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
              label= {t("confirm_password")}
              value={confirmPassword}
              secureTextEntry={!showConfirm}
              onChangeText={setConfirmPassword}
              style={styles.input}
              right={<TextInput.Icon icon={showConfirm ? "eye-off" : "eye"} onPress={() => setShowConfirm(!showConfirm)} />}
            />

            {passwordError ? <Text style={{ color: "red", marginBottom: 10 }}>{passwordError}</Text> : null}
            {success ? <Text style={{ color: "green", marginBottom: 10 }}>{success}</Text> : null}

            <Button
              mode="contained"
              onPress={handleChangePassword}
              disabled={passwordStrength(newPassword) !== "Strong 🔵" || newPassword !== confirmPassword}
            >
              {t("change")}
            </Button>
            <Button mode="text" onPress={hideModal} style={{ marginTop: 10 }}>
              {t("cancel")}
            </Button>
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
  userSection: { marginTop: 10, alignItems: "center" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalContainer: { padding: 20, margin: 20, borderRadius: 12 },
  input: { marginBottom: 10, backgroundColor: "transparent" },
});
