import { auth } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import {
    ConfirmationResult,
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from "firebase/auth";
import { FormEvent, useEffect, useState, useTransition } from "react";

function OtpLogin() {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);

  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(
        () => setResendCountdown((c) => c - 1),
        1000
      );
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  useEffect(() => {
    const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });
    setRecaptchaVerifier(verifier);
    return () => {
      verifier.clear();
    };
  }, []);

  useEffect(() => {
    if (otp.length === 6) {
      verifyOtp();
    }
  }, [otp]);

  const verifyOtp = async () => {
    startTransition(async () => {
      setError("");
      if (!confirmationResult) {
        setError("Please request OTP first.");
        return;
      }
      try {
        await confirmationResult.confirm(otp);
        router.replace("/");
      } catch (err) {
        console.log(err);
        setError("Failed to verify OTP. Please check the OTP.");
      }
    });
  };

  const requestOtp = async (e?: FormEvent) => {
    e?.preventDefault();
    setResendCountdown(60);

    startTransition(async () => {
      setError("");
      if (!recaptchaVerifier) {
        return setError("RecaptchaVerifier is not initialized.");
      }
      try {
        const confirmation = await signInWithPhoneNumber(
          auth,
          phoneNumber,
          recaptchaVerifier
        );
        setConfirmationResult(confirmation);
        setSuccess("OTP sent successfully!");
      } catch (err: any) {
        console.log(err);
        setResendCountdown(0);
        if (err.code === "auth/invalid-phone-number") {
          setError("Invalid phone number. Please check the number.");
        } else if (err.code === "auth/too-many-requests") {
          setError("Too many requests. Please try again later.");
        } else {
          setError("Failed to send OTP. Please try again.");
        }
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          🔐 OTP Login
        </h1>

        {!confirmationResult && (
          <form onSubmit={requestOtp} className="space-y-4">
            <input
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="tel"
              placeholder="+95 9xxxxxxx"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Please include your country code (e.g. +95 for Myanmar)
            </p>
          </form>
        )}

        {confirmationResult && (
          <div className="space-y-4">
            <input
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 tracking-widest text-center text-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <p className="text-xs text-gray-500 text-center">
              OTP has been sent to your phone.
            </p>
          </div>
        )}

        <button
          disabled={!phoneNumber || isPending || resendCountdown > 0}
          onClick={() => requestOtp()}
          className={`mt-6 w-full py-3 rounded-xl font-semibold text-white transition ${
            resendCountdown > 0 || isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {resendCountdown > 0
            ? `Resend OTP in ${resendCountdown}s`
            : isPending
            ? "Sending OTP..."
            : "Send OTP"}
        </button>

        <div className="mt-6 text-center">
          {error && (
            <p className="text-red-500 font-medium mb-2">{error}</p>
          )}
          {success && (
            <p className="text-green-600 font-medium mb-2">{success}</p>
          )}
        </div>

        <div id="recaptcha-container" />

        {isPending && (
          <div className="mt-4 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
          </div>
        )}
      </div>
    </div>
  );
}

export default OtpLogin;
