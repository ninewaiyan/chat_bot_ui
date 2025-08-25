// app/splash.tsx
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useLayoutEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function Splash() {
  const router = useRouter();
  const navigation = useNavigation();

  // Hide header
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/image.png")} // replace with your logo
          style={styles.logo}
        />
      </View>
      <Text style={styles.appName}>ChatAi</Text>
      <Text style={styles.subtitle}>Developed by HMI Team</Text>
       <Text style={styles.tagline}>Cyber Guard For Myanmar Citizen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // dark background
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    marginBottom: 20,
  },
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#aaa",
  },

  tagline: {
    fontSize: 14,
    color: "#ccc",
    marginTop: 5,
    fontStyle: "italic",
  },
});
