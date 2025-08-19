// app/chat.tsx
import axios from "axios";
import { useNavigation, useRouter } from "expo-router";
import React, { useContext, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemeContext } from "../ThemeContext";

type Message = { id: string; text: string; isUser: boolean };

const OPENAI_API_KEY = "sk-proj-DrY8XAyPDoD09kbVTRafbN_qJ80VsSE2no4ecdXQKvXUcqG38cvmxCoBTmhea_IClMvGI8-jBc0T3BlbkFJpNFeX3o5DErKkpsR1Miqysq5YA0meVUrGDHiFzdQqSjNqyQMRUQuJPSrXOn3BFQ00IPSjVHBcA"; // Replace with your key

export default function Chat() {
  const router = useRouter();
  const { scheme, toggle } = useContext(ThemeContext);
  const isDark = scheme === "dark";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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
      headerTitle: "Chat",
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
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

  async function sendMessageToAPI(userMessage: string) {
    setLoading(true);
    try {
      const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: userMessage }],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      return res.data.choices[0].message.content.trim();
    } catch (e) {
      console.error(e);
      return "Oops, something went wrong!";
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    if (!input.trim()) return;

    const userMsg = { id: Date.now().toString(), text: input.trim(), isUser: true };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const botReply = await sendMessageToAPI(userMsg.text);
    const botMsg = { id: Date.now().toString() + "-bot", text: botReply, isUser: false };
    setMessages((prev) => [...prev, botMsg]);
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: isDark ? "#121212" : "#fff" }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.isUser ? styles.userBubble : styles.botBubble,
              { alignSelf: item.isUser ? "flex-end" : "flex-start" },
            ]}
          >
            <Text style={{ color: item.isUser ? "#fff" : "#000" }}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: isDark ? "#222" : "#eee", color: isDark ? "#fff" : "#000" },
          ]}
          placeholder="Type your message..."
          placeholderTextColor={isDark ? "#aaa" : "#555"}
          value={input}
          onChangeText={setInput}
          editable={!loading}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        {loading ? (
          <ActivityIndicator size="small" color={isDark ? "#fff" : "#000"} style={{ marginLeft: 10 }} />
        ) : (
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>{t("send")}</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  messageList: { padding: 12 },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginVertical: 6,
    maxWidth: "80%",
  },
  userBubble: {
    backgroundColor: "#007aff",
  },
  botBubble: {
    backgroundColor: "#e5e5ea",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 20,
  },
  sendButton: {
    backgroundColor: "#007aff",
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginLeft: 8,
  },
  headerButton: {
    paddingHorizontal: 12,
    justifyContent: "center",
  },
});
