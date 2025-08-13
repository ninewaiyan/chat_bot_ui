// app/index.tsx
import { useRouter } from "expo-router";
import React, { useContext } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { ThemeContext } from "../ThemeContext";

export default function Home() {
  const router = useRouter();
  const { scheme } = useContext(ThemeContext);
  const isDark = scheme === "dark";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chatbot</Text>
      <Text style={styles.subtitle}>Chat For Your Pravicy</Text>
      <Pressable style={styles.button } onPress={()=>router.push("/chat")} >
        <Text style={styles.buttonText}>Open Chat</Text>
      </Pressable>
      <Pressable style={styles.button } onPress={()=>router.push("/chat")} >
        <Text style={styles.buttonText}>Check for safety</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#7c3aed',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    marginBottom: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});