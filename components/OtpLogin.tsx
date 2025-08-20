import { auth } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { Button } from "react-native-paper";
function OtpLogin(){
    const router = useRouter();
    
    const [phoneNumber,setPhoneNumber] = useState("");
    const [otp,setOtp] = useState("");
    const [error,setError] = useState<string | null>(null);
    const [success,setSuccess] = useState("");
    const [resendCountdown,setResendCountdown] = useState(0);

    const[recaptchaVerifier,setRecaptchaVerifier] = useState<RecaptchaVerifier | null >(null);

    const [confirmationResult,setConfirmationResult] = useState<ConfirmationResult | null>(null);

    const [isPending,startTransition] = useTransition();

    useEffect(()=>{
        let timer:NodeJS.Timeout;
        if(resendCountdown > 0 ){
            timer = setTimeout(()=>setResendCountdown(resendCountdown - 1),1000);
        }
        return ()=>clearTimeout(timer);
    },[resendCountdown]);


    useEffect(()=>{
        const recaptchaVerifier = new RecaptchaVerifier(
            auth,
            "recaptcha-container",
            {
                size:"invisible"
            }
            
        );
        setRecaptchaVerifier(recaptchaVerifier);

        return()=>{
            recaptchaVerifier.clear();
        };
    },[auth]);

    const requestOtp = async (e?: FormEvent<HTMLFormElement>)=>{
        e?.preventDefault();
    }




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

           <Button>
            
           </Button>

        </div>
    );
}

export default OtpLogin;