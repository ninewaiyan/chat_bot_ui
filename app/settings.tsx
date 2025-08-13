// app/settings.tsx
import { useRouter } from "expo-router";
import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Switch } from "react-native-paper";
import { ThemeContext } from "../ThemeContext";

export default function Settings() {
  const router = useRouter();
  const { scheme, toggle } = useContext(ThemeContext);
  const isDark = scheme === "dark";

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#fff" }]}>
      <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>Settings</Text>
      <View style={styles.row}>
        <Text style={{ color: isDark ? "#fff" : "#000", fontSize: 18 }}>Dark Mode</Text>
        <Switch value={isDark} onValueChange={toggle} />
      </View>
      <Button mode="contained" onPress={() => router.push("/")}>
        Back to Home
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
    marginBottom: 20,
  },
});
