// // app/register.tsx
// import { auth } from "@/firebaseConfig";
// import { useNavigation, useRouter } from "expo-router";
// import {
//     ConfirmationResult,
//     RecaptchaVerifier,
//     signInWithPhoneNumber,
// } from "firebase/auth";
// import React, {
//     useContext,
//     useEffect,
//     useLayoutEffect,
//     useRef,
//     useState,
//     useTransition,
// } from "react";
// import { useTranslation } from "react-i18next";
// import {
//     Keyboard,
//     Platform,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import { Button } from "react-native-paper";
// import { ThemeContext } from "../ThemeContext";

// export default function Register() {
//     const { scheme, toggle } = useContext(ThemeContext);
//     const isDark = scheme === "dark";
//     const router = useRouter();
//     const navigation = useNavigation();

//     const [name, setName] = useState("");
//     const [phoneNumber, setPhoneNumber] = useState("");
//     const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [showPassword, setShowPassword] = useState(false);
//     const [otpVerified, setOtpVerified] = useState(false);

//     const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
//     const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

//     const [resendCountdown, setResendCountdown] = useState(0);
//     const [error, setError] = useState<string | null>(null);
//     const [success, setSuccess] = useState("");

//     const [isPending, startTransition] = useTransition();
//     const otpInputs = useRef<TextInput[]>([]);

//     const { t, i18n } = useTranslation();

//     // HEADER
//     useLayoutEffect(() => {
//         navigation.setOptions({
//             headerTitle: "Register",
//             headerRight: () => (
//                 <View style={{ flexDirection: "row", marginRight: 10 }}>
//                     <TouchableOpacity onPress={toggle} style={styles.headerButton}>
//                         <Text style={{ color: isDark ? "#fff" : "#000", fontSize: 20 }}>
//                             {isDark ? "🌞" : "🌙"}
//                         </Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={() => router.push("/settings")} style={styles.headerButton}>
//                         <Text style={{ color: isDark ? "#fff" : "#000", fontSize: 20 }}>⚙️</Text>
//                     </TouchableOpacity>
//                 </View>
//             ),
//         });
//     }, [navigation, toggle, isDark]);

//     // OTP resend timer
//     useEffect(() => {
//         let timer: NodeJS.Timeout;
//         if (resendCountdown > 0) {
//             timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
//         }
//         return () => clearTimeout(timer);
//     }, [resendCountdown]);

//     // Setup RecaptchaVerifier (Web only)
//     useEffect(() => {
//         if (Platform.OS === "web") {
//             const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
//                 size: "invisible",
//             });
//             setRecaptchaVerifier(verifier);
//             return () => verifier.clear();
//         } else {
//             setRecaptchaVerifier(null); // skip Recaptcha on Expo Go
//         }
//     }, []);

//     // Auto verify OTP
//     useEffect(() => {
//         const otpValue = otp.join("");
//         if (otpValue.length === 6) verifyOtp(otpValue);
//     }, [otp]);

//     const isPhoneValid = () => /^\+\d{9,15}$/.test(phoneNumber);

//     const requestOtp = () => {
//         setResendCountdown(60);
//         setError("");
//         setOtpVerified(false);

//         if (Platform.OS !== "web") {
//             setError("OTP not supported on Expo Go iOS. Use Web to test.");
//             return;
//         }

//         startTransition(async () => {
//             if (!recaptchaVerifier) return setError("Recaptcha not ready");
//             try {
//                 const confirmation = await signInWithPhoneNumber(
//                     auth,
//                     phoneNumber,
//                     recaptchaVerifier
//                 );
//                 setConfirmationResult(confirmation);
//                 setSuccess("OTP sent successfully");
//             } catch (err: any) {
//                 console.log(err);
//                 setResendCountdown(0);
//                 setError(err.message || "Failed to send OTP");
//             }
//         });
//     };

//     const verifyOtp = (otpValue: string) => {
//         startTransition(async () => {
//             setError("");
//             if (!confirmationResult) return setError("Please request OTP first.");
//             try {
//                 await confirmationResult.confirm(otpValue);
//                 setOtpVerified(true);
//                 setSuccess("✅ OTP Verified");
//                 Keyboard.dismiss();
//             } catch (err) {
//                 console.log(err);
//                 setOtpVerified(false);
//                 setError("❌ OTP is incorrect. Try again");
//             }
//         });
//     };

//     const passwordStrength = () => {
//         if (!password) return "";
//         if (password.length < 6) return "Weak";
//         if (/[A-Z]/.test(password) && /\d/.test(password)) return "Strong";
//         return "Medium";
//     };
//     const strength = passwordStrength();

//     const handleRegister = () => {
//         if (!otpVerified) return setError("Please verify OTP first");
//         if (password !== confirmPassword) return setError("Passwords do not match");
//         console.log({ name, phoneNumber, password });
//         alert("✅ Registration success (check console)");
//     };

//     const handleOtpChange = (index: number, value: string) => {
//         if (/^\d*$/.test(value)) {
//             const newOtp = [...otp];
//             newOtp[index] = value;
//             setOtp(newOtp);
//             if (value && index < 5) otpInputs.current[index + 1]?.focus();
//             else if (!value && index > 0) otpInputs.current[index - 1]?.focus();
//         }
//     };

//     const allFieldsFilled = () =>
//         name && phoneNumber && password && confirmPassword && otpVerified;

//     return (
//         <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#fff" }]}>
//             {/* Step 1: Phone number input */}
//             {!otpVerified && (
//                 <>
//                     {/* --- Welcome Title --- */}
//                     <View style={styles.header}>
//                         <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>{t("welcome")}</Text>
//                         <Text style={[styles.subtitle, { color: isDark ? "#aaa" : "#555" }]}>
//                             {t("register_title")}
//                         </Text>
//                     </View>
//                     <TextInput
//                         style={[styles.input, { borderColor: isDark ? "#bbb" : "#333", color: isDark ? "#fff" : "#000" }]}
//                         placeholder={t("phone")}
//                         placeholderTextColor={isDark ? "#aaa" : "#555"}
//                         value={phoneNumber}
//                         keyboardType="phone-pad"
//                         onChangeText={setPhoneNumber}
//                     />
//                     <Button
//                         style={styles.button}
//                         mode="contained"
//                         onPress={requestOtp}
//                         disabled={!isPhoneValid() || resendCountdown > 0}
//                     >
//                         {resendCountdown > 0 ? `${t("resend_otp")} ${resendCountdown}s` : t("send_otp")}
//                     </Button>
//                 </>
//             )}

//             {/* OTP input */}
//             {!otpVerified && confirmationResult && (
//                 <View style={styles.otpContainer}>
//                     {otp.map((digit, idx) => (
//                         <TextInput
//                             key={idx}
//                             ref={(el) => (otpInputs.current[idx] = el!)}
//                             style={[styles.otpBox, { borderColor: isDark ? "#bbb" : "#333", color: isDark ? "#fff" : "#000" }]}
//                             keyboardType="number-pad"
//                             maxLength={1}
//                             value={digit}
//                             onChangeText={(value) => handleOtpChange(idx, value)}
//                             secureTextEntry
//                             textAlign="center"
//                         />
//                     ))}
//                 </View>
//             )}

//             {/* Step 2: Show rest fields after OTP verified */}
//             {otpVerified && (
//                 <>


//                     <View style={styles.header}>
//                         <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>{t("info")}</Text>
//                         <Text style={[styles.subtitle, { color: isDark ? "#aaa" : "#555" }]}>

//                         </Text>
//                     </View>

//                     <TextInput
//                         style={[styles.input, { borderColor: isDark ? "#bbb" : "#333", color: isDark ? "#fff" : "#000" }]}
//                         placeholder={t("name")}
//                         placeholderTextColor={isDark ? "#aaa" : "#555"}
//                         value={name}
//                         onChangeText={setName}
//                     />

//                     <TextInput
//                         style={[styles.input, { borderColor: isDark ? "#bbb" : "#333", color: isDark ? "#fff" : "#000" }]}
//                         placeholder={t("password")}
//                         placeholderTextColor={isDark ? "#aaa" : "#555"}
//                         secureTextEntry={!showPassword}
//                         value={password}
//                         onChangeText={setPassword}
//                     />
//                     <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//                         <Text style={{ color: isDark ? "#4da6ff" : "#007bff", marginBottom: 5 }}>
//                             {showPassword ? t("hide") : t("show")}
//                         </Text>
//                     </TouchableOpacity>
//                     <Text style={{ color: strength === "Strong" ? "green" : strength === "Medium" ? "orange" : "red", marginBottom: 10 }}>
//                         {password ? `Strength: ${strength}` : ""}
//                     </Text>

//                     <TextInput
//                         style={[styles.input, { borderColor: isDark ? "#bbb" : "#333", color: isDark ? "#fff" : "#000" }]}
//                         placeholder={t("confirm_password")}
//                         placeholderTextColor={isDark ? "#aaa" : "#555"}
//                         secureTextEntry
//                         value={confirmPassword}
//                         onChangeText={setConfirmPassword}
//                     />

//                     <Button mode="contained" onPress={handleRegister} disabled={!allFieldsFilled()}>
//                         {t("register")}
//                     </Button>
//                 </>
//             )}

//             {/* Navigation */}
//             <Button mode="outlined" onPress={() => router.push("/home")} style={styles.button}>
//                 {t("home")}
//             </Button>
//             <Button mode="outlined" onPress={() => router.push("/login")} style={styles.button}>
//                 {t("login")}
//             </Button>

//             <View id="recaptcha-container" />
//             {error ? <Text style={{ color: "red", marginTop: 10 }}>{error}</Text> : null}
//             {success ? <Text style={{ color: "green", marginTop: 10 }}>{success}</Text> : null}
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, justifyContent: "center", padding: 20 },
//     headerButton: { marginLeft: 15 },
//     input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
//     button: { marginBottom: 4 },
//     otpContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
//     otpBox: { borderWidth: 1, borderRadius: 8, padding: Platform.OS === "ios" ? 15 : 12, fontSize: 18, width: 45 },
//     subtitle: { fontSize: 16 },
//     header: { marginBottom: 40, alignItems: "center" },
//     title: { fontSize: 28, fontWeight: "bold", marginBottom: 5 },

// });




//Firebase skip

// app/register.tsx
// app/register.tsx
import { auth } from "@/firebaseConfig";
import { useNavigation, useRouter } from "expo-router";
import {
    ConfirmationResult,
    signInWithPhoneNumber,
} from "firebase/auth";
import React, {
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    useTransition,
} from "react";
import { useTranslation } from "react-i18next";
import {
    Keyboard,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
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

    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

    const [resendCountdown, setResendCountdown] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState("");

    const [isPending, startTransition] = useTransition();
    const otpInputs = useRef<TextInput[]>([]);

    const { t } = useTranslation();

    // --- Test Mode ---
    const TEST_PHONE = "+959963603477";
    const TEST_OTP = "123456";

    // HEADER
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

    // OTP resend timer
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (resendCountdown > 0) {
            timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendCountdown]);

    // Auto verify OTP when full
    useEffect(() => {
        const otpValue = otp.join("");
        if (otpValue.length === 6) verifyOtp(otpValue);
    }, [otp]);

    const isPhoneValid = () => /^\+\d{9,15}$/.test(phoneNumber);

    const requestOtp = () => {
        setResendCountdown(60);
        setError("");
        setOtpVerified(false);

        // --- Test Mode (skip Firebase + Recaptcha) ---
        if (phoneNumber === TEST_PHONE) {
            setConfirmationResult({} as ConfirmationResult); // dummy so OTP input shows
            setSuccess("✅ OTP sent (Test Mode, no Recaptcha)");
            return;
        }

        // If not test mode → normal Firebase flow
        if (Platform.OS !== "web") {
            setError("OTP not supported on Expo Go iOS. Use Web to test.");
            return;
        }

        startTransition(async () => {
            try {
                // Firebase OTP send (with Recaptcha normally required on web)
                const confirmation = await signInWithPhoneNumber(auth, phoneNumber);
                setConfirmationResult(confirmation);
                setSuccess("OTP sent successfully");
            } catch (err: any) {
                console.log(err);
                setResendCountdown(0);
                setError(err.message || "Failed to send OTP");
            }
        });
    };

    const verifyOtp = (otpValue: string) => {
        startTransition(async () => {
            setError("");

            // --- Test Mode ---
            if (phoneNumber === TEST_PHONE && otpValue === TEST_OTP) {
                setOtpVerified(true);
                setSuccess("✅ OTP Verified (Test Mode, no Recaptcha)");
                Keyboard.dismiss();
                return;
            }

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
        console.log({ name, phoneNumber, password });
        alert("✅ Registration success (check console)");
    };

    const handleOtpChange = (index: number, value: string) => {
        if (/^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (value && index < 5) otpInputs.current[index + 1]?.focus();
            else if (!value && index > 0) otpInputs.current[index - 1]?.focus();
        }
    };

    const allFieldsFilled = () =>
        name && phoneNumber && password && confirmPassword && otpVerified;

    return (
        <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#fff" }]}>
            {/* Step 1: Phone number input */}
            {!otpVerified && (
                <>
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>{t("welcome")}</Text>
                        <Text style={[styles.subtitle, { color: isDark ? "#aaa" : "#555" }]}>
                            {t("register_title")}
                        </Text>
                    </View>
                    <TextInput
                        style={[styles.input, { borderColor: isDark ? "#bbb" : "#333", color: isDark ? "#fff" : "#000" }]}
                        placeholder={t("phone")}
                        placeholderTextColor={isDark ? "#aaa" : "#555"}
                        value={phoneNumber}
                        keyboardType="phone-pad"
                        onChangeText={setPhoneNumber}
                    />
                    {/* <Button
                        style={styles.button}
                        mode="contained"
                        onPress={requestOtp}
                        disabled={!isPhoneValid() || resendCountdown > 0}
                    >
                        {resendCountdown > 0 ? `${t("resend_otp")} ${resendCountdown}s` : t("send_otp")}
                    </Button> */}

                    <Pressable
                        onPress={requestOtp}
                        style={[
                            styles.button,
                            (!isPhoneValid() || resendCountdown > 0) && styles.buttonDisabled,
                        ]}
                        disabled={!isPhoneValid() || resendCountdown > 0}
                    >
                        <Text style={styles.buttonText}>
                            {resendCountdown > 0
                                ? `${t("resend_otp")} ${resendCountdown}s`
                                : t("send_otp")}
                        </Text>
                    </Pressable>
                </>
            )}

            {/* OTP input */}
            {!otpVerified && confirmationResult && (
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
                            secureTextEntry
                            textAlign="center"
                        />
                    ))}
                </View>
            )}

            {/* Step 2: After OTP verified */}
            {otpVerified && (
                <>
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>{t("info")}</Text>
                        <Text style={[styles.subtitle, { color: isDark ? "#aaa" : "#555" }]}></Text>
                    </View>

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
                    <Text style={{ color: strength === "Strong" ? "green" : strength === "Medium" ? "orange" : "red", marginBottom: 10 }}>
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

                    {/* <Button mode="contained" onPress={handleRegister} disabled={!allFieldsFilled()}>
                        {t("register")}
                    </Button> */}

                    <Pressable
                        onPress={handleRegister}
                        disabled={!allFieldsFilled()}
                        style={[
                            styles.button,
                            {
                                opacity: !allFieldsFilled() ? 0.6 : 1, // dim if disabled
                                backgroundColor: !allFieldsFilled() ? "#ebc0ffff" : "#c669ffff", // lighter pink if disabled
                            },
                        ]}
                    >
                        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "500" }}>
                            {t("register")}
                        </Text>
                    </Pressable>





                </>
            )}

            {/* Navigation */}
            {/* <Button mode="outlined" onPress={() => router.push("/home")} style={styles.button}>
                {t("home")}
            </Button>
            <Button mode="outlined" onPress={() => router.push("/login")} style={styles.button}>
                {t("login")}
            </Button> */}


            {/* Home button */}
            <Pressable
                onPress={() => router.push("/home")}
                style={styles.button}
            >
                <Text style={styles.buttonText}>{t("home")}</Text>
            </Pressable>

            {/* login button */}
            <Pressable
                onPress={() => router.push("/login")}
                style={styles.button}
            >
                <Text style={styles.buttonText}>{t("login")}</Text>
            </Pressable>


            {error ? <Text style={{ color: "red", marginTop: 10 }}>{error}</Text> : null}
            {success ? <Text style={{ color: "green", marginTop: 10 }}>{success}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    headerButton: { marginLeft: 15 },
    input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
    otpContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
    otpBox: { borderWidth: 1, borderRadius: 8, padding: Platform.OS === "ios" ? 15 : 12, fontSize: 18, width: 45 },
    subtitle: { fontSize: 16 },
    header: { alignItems: "center", marginTop: 30 },
    title: { fontSize: 15, fontWeight: "bold", marginBottom: 5 },

    button: {
        borderWidth: 1,
        borderColor: "#2196F3",
        backgroundColor: "transparent",
        paddingVertical: 8,   // 🔹 smaller height
        paddingHorizontal: 20,
        marginBottom: 15,
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonDisabled: {
        borderColor: "#ccc",
        opacity: 0.6,
    },
    buttonText: {
        color: "#2196F3",
        fontSize: 16,
        fontWeight: "500",
    },
});
