// app/register.tsx
import { auth } from "@/firebaseConfig";
import { useNavigation, useRouter } from "expo-router";
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import React, { useContext, useEffect, useLayoutEffect, useRef, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import { ThemeContext } from "../ThemeContext";

export default function Register() {
    const { scheme, toggle } = useContext(ThemeContext);
    const isDark = scheme === "dark";
    const router = useRouter();
    const navigation = useNavigation();

    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

    const [resendCountdown, setResendCountdown] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState("");

    const [isPending, startTransition] = useTransition();
    const otpInputs = useRef<TextInput[]>([]);

    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language);
    const changeLanguage = async (lng: "en" | "mm") => {
        await i18n.changeLanguage(lng);
        setLanguage(lng);
    };

    // HEADER with theme toggle + settings button
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "Register",
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

    // Timer for OTP resend
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (resendCountdown > 0) {
            timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendCountdown]);

    // Setup Recaptcha
    useEffect(() => {
        const verifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
        setRecaptchaVerifier(verifier);
        return () => verifier.clear();
    }, []);

    // Auto verify OTP when all boxes filled
    useEffect(() => {
        const otpValue = otp.join("");
        if (otpValue.length === 6) {
            verifyOtp(otpValue);
        }
    }, [otp]);

    const isPhoneValid = () => /^\+\d{9,15}$/.test(phoneNumber);

    const requestOtp = () => {
        setResendCountdown(60);
        setError("");
        setOtpVerified(false);
        startTransition(async () => {
            if (!recaptchaVerifier) return setError("Recaptcha not ready");
            try {
                const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
                setConfirmationResult(confirmation);
                setSuccess("OTP sent successfully");
            } catch (err: any) {
                console.log(err);
                setResendCountdown(0);
                if (err.code === "auth/invalid-phone-number") setError("Invalid phone number.");
                else if (err.code === "auth/too-many-requests") setError("Too many requests. Try later.");
                else setError("Failed to send OTP. Try again.");
            }
        });
    };

    const verifyOtp = (otpValue: string) => {
        startTransition(async () => {
            setError("");
            if (!confirmationResult) return setError("Please request OTP first.");
            try {
                await confirmationResult.confirm(otpValue);
                setOtpVerified(true);
                setSuccess("✅ OTP Verified");
                Keyboard.dismiss();
            } catch (err) {
                console.log(err);
                setOtpVerified(false);
                setError("❌ OTP is incorrect. Try again");
            }
        });
    };

    const passwordStrength = () => {
        if (!password) return "";
        if (password.length < 6) return "Weak";
        if (/[A-Z]/.test(password) && /\d/.test(password)) return "Strong";
        return "Medium";
    };
    const strength = passwordStrength();

    const handleRegister = () => {
        if (!otpVerified) return setError("Please verify OTP first");
        if (password !== confirmPassword) return setError("Passwords do not match");
        console.log("📌 Register Data:", { name, phoneNumber, password });
        alert("✅ Registration success (check console)");
    };

    const handleOtpChange = (index: number, value: string) => {
        if (/^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (value && index < 5) otpInputs.current[index + 1].focus();
            else if (!value && index > 0) otpInputs.current[index - 1].focus();
        }
    };

    const allFieldsFilled = () =>
        name && phoneNumber && password && confirmPassword && otpVerified;

    return (
        <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#fff" }]}>
            {/* Phone + OTP */}
            <TextInput
                style={[styles.input, { borderColor: isDark ? "#bbb" : "#333", color: isDark ? "#fff" : "#000" }]}
                placeholder={t("phone")}
                placeholderTextColor={isDark ? "#aaa" : "#555"}
                value={phoneNumber}
                keyboardType="phone-pad"
                onChangeText={setPhoneNumber}
            />
            <Button
                mode="contained"
                onPress={requestOtp}
                disabled={!isPhoneValid() || resendCountdown > 0}
                style={styles.button}
            >
                {resendCountdown > 0 ? t("resend_otp")+ ` ${resendCountdown}s` : t("send_otp")}
            </Button>

            {confirmationResult && (
                <View style={styles.otpContainer}>
                    {otp.map((digit, idx) => (
                        <TextInput
                            key={idx}
                            ref={(el) => (otpInputs.current[idx] = el!)}
                            style={[styles.otpBox, { borderColor: isDark ? "#bbb" : "#333", color: isDark ? "#fff" : "#000" }]}
                            keyboardType="number-pad"
                            maxLength={1}
                            value={digit}
                            onChangeText={(value) => handleOtpChange(idx, value)}
                            secureTextEntry={true}
                            textAlign="center"
                        />
                    ))}
                </View>
            )}

            <TextInput
                style={[styles.input, { borderColor: isDark ? "#bbb" : "#333", color: isDark ? "#fff" : "#000" }]}
                placeholder={t("name")}
                placeholderTextColor={isDark ? "#aaa" : "#555"}
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={[styles.input, { borderColor: isDark ? "#bbb" : "#333", color: isDark ? "#fff" : "#000" }]}
                placeholder={t("password")}
                placeholderTextColor={isDark ? "#aaa" : "#555"}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={{ color: isDark ? "#4da6ff" : "#007bff", marginBottom: 5 }}>
                    {showPassword ? t("hide") : t("show")}
                </Text>
            </TouchableOpacity>
            <Text
                style={{
                    color: strength === "Strong" ? "green" : strength === "Medium" ? "orange" : "red",
                    marginBottom: 10,
                }}
            >
                {password ? `Strength: ${strength}` : ""}
            </Text>

            <TextInput
                style={[styles.input, { borderColor: isDark ? "#bbb" : "#333", color: isDark ? "#fff" : "#000" }]}
                placeholder={t("confirm_password")}
                placeholderTextColor={isDark ? "#aaa" : "#555"}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            <Button
                mode="contained"
                onPress={handleRegister}
                style={styles.button}
                disabled={!allFieldsFilled()}
            >
                {t("register")}
            </Button>

            <Button mode="outlined" onPress={() => router.push("/")} style={styles.button}>
                {t("backHome")}
            </Button>

            <Button mode="outlined" onPress={() => router.push("/")} style={styles.button}>
        
            {t("login")}
            </Button>

            <View id="recaptcha-container" />
            {error ? <Text style={{ color: "red", marginTop: 10 }}>{error}</Text> : null}
            {success ? <Text style={{ color: "green", marginTop: 10 }}>{success}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    headerButton: { marginLeft: 15 },
    input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
    button: { marginBottom: 4 },
    otpContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
    otpBox: { borderWidth: 1, borderRadius: 8, padding: Platform.OS === "ios" ? 15 : 12, fontSize: 18, width: 45 },
});
