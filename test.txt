import { auth } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { FormEvent, useEffect, useState, useTransition } from "react";
function OtpLogin() {
    const router = useRouter();

    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState("");
    const [resendCountdown, setResendCountdown] = useState(0);

    const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (resendCountdown > 0) {
            timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendCountdown]);


    useEffect(() => {
        const recaptchaVerifier = new RecaptchaVerifier(
            auth,
            "recaptcha-container",
            {
                size: "invisible"
            }

        );
        setRecaptchaVerifier(recaptchaVerifier);

        return () => {
            recaptchaVerifier.clear();
        };
    }, [auth]);


    useEffect(()=>{
        const hasEnteredAllDigits = otp.length === 6;
        if(hasEnteredAllDigits){
            verifyOtp();
        }
    },[otp])

    const verifyOtp = async()=>{
        startTransition(async()=>{
            setError("");

            if(!confirmationResult){
                setError("Please request OTP first.");
                return;
            }

            try {
                await confirmationResult?.confirm(otp);
                router.replace("/");
            } catch (error) {
                console.log(error);

                setError("Failed to verify OTP. Please check the OTP")
            }
        });
    }
    const requestOtp = async (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault();

        setResendCountdown(60)

        startTransition(async () => {
            setError("");

            if (!recaptchaVerifier) {
                return setError("RecaptchaVerifer is not initialized.")
            }
            try {
                const confirmationResult = await signInWithPhoneNumber(
                    auth,
                    phoneNumber,
                    recaptchaVerifier
                );

                setConfirmationResult(confirmationResult);
                setSuccess("OTP sent successfully");
            } catch (err: any) {
                console.log(err);
                setResendCountdown(0);

                if (err.code == "auth/invalid-phone-number") {
                    setError("Invalid phone number.Please check the number.");
                } else if (err.code == "auth/too-many-requests") {
                    setError("Too many requests.Please try again later.");
                } else {
                    setError("Failed to send OTP.Please try again.")
                }
            }
        })
    }

    const loadingIndicator = (
        <div role="status" className="flex justify-center">

            <span className="sr-only">Loading......</span>

        </div>
    );




    return (
        <div>
            {!confirmationResult && (
                <form onSubmit={requestOtp}>
                    <input
                        className="text-black"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />

                    <p className="text-xs text-gray-400 mt-2">
                        Please enter your number with the country code (i.e. +95 For Myanmar)
                    </p>

                </form>
            )}


            {confirmationResult && (
                <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />
            )}

            <button
                disabled={!phoneNumber || isPending || resendCountdown > 0}
                onClick={() => requestOtp()}
                className="mt-5"
            >

                {resendCountdown > 0
                    ? `Resend OTP in ${resendCountdown}`
                    : isPending
                        ? "Sending OTP"
                        : "Send OTP"

                }

            </button>

            <div className="p-10 text-center">
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
            </div>

            <div id="recaptcha-container" />

            {isPending && loadingIndicator}

        </div>
    );
}

export default OtpLogin;