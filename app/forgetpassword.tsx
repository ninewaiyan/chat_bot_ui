// // app/forgetpassword.tsx
// import { auth } from "@/firebaseConfig";
// import { useNavigation, useRouter } from "expo-router";
// import {
//   ConfirmationResult,
//   RecaptchaVerifier,
//   signInWithPhoneNumber,
// } from "firebase/auth";
// import React, {
//   useContext,
//   useEffect,
//   useLayoutEffect,
//   useRef,
//   useState,
//   useTransition,
// } from "react";
// import { useTranslation } from "react-i18next";
// import {
//   Keyboard,
//   Platform,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { Button } from "react-native-paper";
// import { ThemeContext } from "../ThemeContext";

// export default function ForgetPassword() {
//   const { scheme, toggle } = useContext(ThemeContext);
//   const isDark = scheme === "dark";
//   const router = useRouter();
//   const navigation = useNavigation();

//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
//   const [otpVerified, setOtpVerified] = useState(false);

//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const [resendCountdown, setResendCountdown] = useState(0);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
//   const [isPending, startTransition] = useTransition();

//   const otpInputs = useRef<TextInput[]>([]);

//   const { t, i18n } = useTranslation();
//   const [language, setLanguage] = useState(i18n.language);

//   const changeLanguage = async (lng: "en" | "mm") => {
//     await i18n.changeLanguage(lng);
//     setLanguage(lng);
//   };

//   // HEADER
//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerTitle: "Forget Password",
//       headerRight: () => (
//         <View style={{ flexDirection: "row", marginRight: 10 }}>
//           <TouchableOpacity onPress={toggle} style={styles.headerButton}>
//             <Text style={{ color: isDark ? "#fff" : "#000", fontSize: 20 }}>
//               {isDark ? "🌞" : "🌙"}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       ),
//     });
//   }, [navigation, toggle, isDark]);

//   // OTP resend timer
//   useEffect(() => {
//     let timer: NodeJS.Timeout;
//     if (resendCountdown > 0) {
//       timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
//     }
//     return () => clearTimeout(timer);
//   }, [resendCountdown]);

//   // Recaptcha setup (Web only)
//   useEffect(() => {
//     if (Platform.OS === "web") {
//       const verifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
//       setRecaptchaVerifier(verifier);
//       return () => verifier.clear();
//     } else {
//       setRecaptchaVerifier(null);
//     }
//   }, []);

//   // Auto verify OTP
//   useEffect(() => {
//     const otpValue = otp.join("");
//     if (otpValue.length === 6) verifyOtp(otpValue);
//   }, [otp]);

//   const isPhoneValid = () => /^\+\d{9,15}$/.test(phoneNumber);

//   const requestOtp = () => {
//     setResendCountdown(60);
//     setError("");
//     setOtpVerified(false);

//     if (Platform.OS !== "web") {
//       setError("OTP not supported on Expo Go iOS. Use Web to test.");
//       return;
//     }

//     startTransition(async () => {
//       if (!recaptchaVerifier) return setError("Recaptcha not ready");
//       try {
//         const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
//         setConfirmationResult(confirmation);
//         setSuccess("OTP sent successfully");
//       } catch (err: any) {
//         console.log(err);
//         setResendCountdown(0);
//         setError(err.message || "Failed to send OTP");
//       }
//     });
//   };

//   const verifyOtp = (otpValue: string) => {
//     startTransition(async () => {
//       setError("");
//       if (!confirmationResult) return setError("Please request OTP first.");
//       try {
//         await confirmationResult.confirm(otpValue);
//         setOtpVerified(true);
//         setSuccess("✅ OTP Verified");
//         Keyboard.dismiss();
//       } catch (err) {
//         console.log(err);
//         setOtpVerified(false);
//         setError("❌ OTP is incorrect. Try again");
//       }
//     });
//   };

//   const passwordStrength = () => {
//     if (!newPassword) return "";
//     if (newPassword.length < 6) return "Weak";
//     if (/[A-Z]/.test(newPassword) && /\d/.test(newPassword)) return "Strong";
//     return "Medium";
//   };

//   const handleResetPassword = () => {
//     if (!otpVerified) return setError("Please verify OTP first");
//     if (newPassword !== confirmPassword) return setError("Passwords do not match");
//     console.log("📌 Reset Password:", { phoneNumber, newPassword });
//     alert("✅ Password reset success (check console)");
//     router.push("/login");
//   };

//   const handleOtpChange = (index: number, value: string) => {
//     if (/^\d*$/.test(value)) {
//       const newOtpArr = [...otp];
//       newOtpArr[index] = value;
//       setOtp(newOtpArr);
//       if (value && index < 5) otpInputs.current[index + 1]?.focus();
//       else if (!value && index > 0) otpInputs.current[index - 1]?.focus();
//     }
//   };

//   const allFieldsFilled = () => otpVerified && newPassword && confirmPassword;

//   return (
//     <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#fff" }]}>
//       {!otpVerified && (
//         <>


//           <View style={styles.header}>
//             <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>{t("fp_title")}</Text>
//             <Text style={[styles.subtitle, { color: isDark ? "#aaa" : "#555" }]}>

//             </Text>
//           </View>

//           <TextInput
//             style={[styles.input, { borderColor: isDark ? "#bbb" : "#333", color: isDark ? "#fff" : "#000" }]}
//             placeholder={t("phone")}
//             placeholderTextColor={isDark ? "#aaa" : "#555"}
//             keyboardType="phone-pad"
//             value={phoneNumber}
//             onChangeText={setPhoneNumber}
//           />
//           <Button
//             mode="contained"
//             onPress={requestOtp}
//             disabled={!isPhoneValid() || resendCountdown > 0}
//             style={styles.button}
//           >
//             {resendCountdown > 0 ? t("resend_otp") + ` ${resendCountdown}s` : t("send_otp")}
//           </Button>
//         </>
//       )}

//       {!otpVerified && confirmationResult && (
//         <View style={styles.otpContainer}>
//           {otp.map((digit, idx) => (
//             <TextInput
//               key={idx}
//               ref={(el) => (otpInputs.current[idx] = el!)}
//               style={[styles.otpBox, { borderColor: isDark ? "#bbb" : "#333", color: isDark ? "#fff" : "#000" }]}
//               keyboardType="number-pad"
//               maxLength={1}
//               value={digit}
//               onChangeText={(value) => handleOtpChange(idx, value)}
//               secureTextEntry={true}
//               textAlign="center"
//             />
//           ))}
//         </View>
//       )}

//       {otpVerified && (
//         <>

//           <View style={styles.header}>
//             <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>{t("reset_password")}</Text>
//             <Text style={[styles.subtitle, { color: isDark ? "#aaa" : "#555" }]}>

//             </Text>
//           </View>


//           <TextInput
//             style={[styles.input, { borderColor: isDark ? "#bbb" : "#333", color: isDark ? "#fff" : "#000" }]}
//             placeholder={t("new_password")}
//             placeholderTextColor={isDark ? "#aaa" : "#555"}
//             secureTextEntry={!showPassword}
//             value={newPassword}
//             onChangeText={setNewPassword}
//           />
//           <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//             <Text style={{ color: isDark ? "#4da6ff" : "#007bff", marginBottom: 5 }}>
//               {showPassword ? t("hide") : t("show")}
//             </Text>
//           </TouchableOpacity>
//           <Text
//             style={{
//               color: passwordStrength() === "Strong" ? "green" : passwordStrength() === "Medium" ? "orange" : "red",
//               marginBottom: 10,
//             }}
//           >
//             {newPassword ? `Strength: ${passwordStrength()}` : ""}
//           </Text>

//           <TextInput
//             style={[styles.input, { borderColor: isDark ? "#bbb" : "#333", color: isDark ? "#fff" : "#000" }]}
//             placeholder={t("confirm_password")}
//             placeholderTextColor={isDark ? "#aaa" : "#555"}
//             secureTextEntry
//             value={confirmPassword}
//             onChangeText={setConfirmPassword}
//           />

//           <Button
//             mode="contained"
//             onPress={handleResetPassword}
//             disabled={!allFieldsFilled()}
//             style={styles.button}
//           >
//             {t("reset_password")}
//           </Button>
//         </>
//       )}

//       {error ? <Text style={{ color: "red", marginTop: 10 }}>{error}</Text> : null}
//       {success ? <Text style={{ color: "green", marginTop: 10 }}>{success}</Text> : null}

//       <View id="recaptcha-container" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", padding: 20 },
//   headerButton: { marginLeft: 15 },
//   input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 10, fontSize: 16 },
//   button: { marginBottom: 15 },
//   otpContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
//   otpBox: { borderWidth: 1, borderRadius: 8, padding: Platform.OS === "ios" ? 15 : 12, fontSize: 18, width: 45 },
//   subtitle: { fontSize: 16 },
//   header: { marginBottom: 30, alignItems: "center" },
//   title: { fontSize: 28, fontWeight: "bold", marginBottom: 5 },
// });



//firebase skip version

// app/forgetpassword.tsx
import { useNavigation, useRouter } from "expo-router";
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
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import { ThemeContext } from "../ThemeContext";

const TEST_PHONE = "+959963603477";
const TEST_OTP = "123456";

export default function ForgetPassword() {
  const { scheme, toggle } = useContext(ThemeContext);
  const isDark = scheme === "dark";
  const router = useRouter();
  const navigation = useNavigation();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [resendCountdown, setResendCountdown] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isPending, startTransition] = useTransition();
  const otpInputs = useRef<TextInput[]>([]);

  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const changeLanguage = async (lng: "en" | "mm") => {
    await i18n.changeLanguage(lng);
    setLanguage(lng);
  };

  // HEADER
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Forget Password",
      headerRight: () => (
        <View style={{ flexDirection: "row", marginRight: 10 }}>
          <TouchableOpacity onPress={toggle} style={styles.headerButton}>
            <Text style={{ color: isDark ? "#fff" : "#000", fontSize: 20 }}>
              {isDark ? "🌞" : "🌙"}
            </Text>
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

  // Auto verify OTP when 6 digits entered
  useEffect(() => {
    const otpValue = otp.join("");
    if (otpValue.length === 6) verifyOtp(otpValue);
  }, [otp]);

  const isPhoneValid = () => /^\+\d{9,15}$/.test(phoneNumber);

  const requestOtp = () => {
    setResendCountdown(60);
    setError("");
    setOtpVerified(false);

    // Test Mode
    if (phoneNumber === TEST_PHONE) {
      setOtpRequested(true);
      setSuccess("✅ OTP sent (Test Mode)");
      return;
    }

    setError("❌ Only test mode is available (use +959963603477)");
    setResendCountdown(0);
  };

  const verifyOtp = (otpValue: string) => {
    startTransition(() => {
      setError("");

      // Test Mode
      if (phoneNumber === TEST_PHONE && otpValue === TEST_OTP) {
        setOtpVerified(true);
        setSuccess("✅ OTP Verified (Test Mode)");
        Keyboard.dismiss();
        return;
      }

      setOtpVerified(false);
      setError("❌ OTP is incorrect (use 123456)");
    });
  };

  const passwordStrength = () => {
    if (!newPassword) return "";
    if (newPassword.length < 6) return "Weak";
    if (/[A-Z]/.test(newPassword) && /\d/.test(newPassword)) return "Strong";
    return "Medium";
  };

  const handleResetPassword = () => {
    if (!otpVerified) return setError("Please verify OTP first");
    if (newPassword !== confirmPassword)
      return setError("Passwords do not match");

    console.log("📌 Reset Password:", { phoneNumber, newPassword });
    alert("✅ Password reset success (check console)");
    router.push("/login");
  };

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d*$/.test(value)) {
      const newOtpArr = [...otp];
      newOtpArr[index] = value;
      setOtp(newOtpArr);
      if (value && index < 5) otpInputs.current[index + 1]?.focus();
      else if (!value && index > 0) otpInputs.current[index - 1]?.focus();
    }
  };

  const allFieldsFilled = () => otpVerified && newPassword && confirmPassword;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#121212" : "#fff" },
      ]}
    >
      {!otpVerified && (
        <>
          <View style={styles.header}>
            <Text
              style={[styles.title, { color: isDark ? "#fff" : "#000" }]}
            >
              {t("fp_title")}
            </Text>
          </View>

          <TextInput
            style={[
              styles.input,
              {
                borderColor: isDark ? "#bbb" : "#333",
                color: isDark ? "#fff" : "#000",
              },
            ]}
            placeholder={t("phone")}
            placeholderTextColor={isDark ? "#aaa" : "#555"}
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <Button
            mode="contained"
            onPress={requestOtp}
            disabled={!isPhoneValid() || resendCountdown > 0}
            style={styles.button}
          >
            {resendCountdown > 0
              ? t("resend_otp") + ` ${resendCountdown}s`
              : t("send_otp")}
          </Button>
        </>
      )}

      {!otpVerified && otpRequested && (
        <View style={styles.otpContainer}>
          {otp.map((digit, idx) => (
            <TextInput
              key={idx}
              ref={(el) => (otpInputs.current[idx] = el!)}
              style={[
                styles.otpBox,
                {
                  borderColor: isDark ? "#bbb" : "#333",
                  color: isDark ? "#fff" : "#000",
                },
              ]}
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

      {otpVerified && (
        <>
          <View style={styles.header}>
            <Text
              style={[styles.title, { color: isDark ? "#fff" : "#000" }]}
            >
              {t("reset_password")}
            </Text>
          </View>

          <TextInput
            style={[
              styles.input,
              {
                borderColor: isDark ? "#bbb" : "#333",
                color: isDark ? "#fff" : "#000",
              },
            ]}
            placeholder={t("new_password")}
            placeholderTextColor={isDark ? "#aaa" : "#555"}
            secureTextEntry={!showPassword}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text
              style={{
                color: isDark ? "#4da6ff" : "#007bff",
                marginBottom: 5,
              }}
            >
              {showPassword ? t("hide") : t("show")}
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              color:
                passwordStrength() === "Strong"
                  ? "green"
                  : passwordStrength() === "Medium"
                  ? "orange"
                  : "red",
              marginBottom: 10,
            }}
          >
            {newPassword ? `Strength: ${passwordStrength()}` : ""}
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                borderColor: isDark ? "#bbb" : "#333",
                color: isDark ? "#fff" : "#000",
              },
            ]}
            placeholder={t("confirm_password")}
            placeholderTextColor={isDark ? "#aaa" : "#555"}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <Button
            mode="contained"
            onPress={handleResetPassword}
            disabled={!allFieldsFilled()}
            style={styles.button}
          >
            {t("reset_password")}
          </Button>
        </>
      )}

      {error ? <Text style={{ color: "red", marginTop: 10 }}>{error}</Text> : null}
      {success ? <Text style={{ color: "green", marginTop: 10 }}>{success}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  headerButton: { marginLeft: 15 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  button: { marginBottom: 15 },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  otpBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: Platform.OS === "ios" ? 15 : 12,
    fontSize: 18,
    width: 45,
  },
  subtitle: { fontSize: 16 },
  header: { marginBottom: 30, alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 5 },
});
