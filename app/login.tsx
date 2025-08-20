import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (phone.length < 8) {
      Alert.alert('Invalid phone', 'Enter a valid phone number');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setStep('otp');
    Alert.alert('OTP sent', 'Use 1234 as test OTP');
  };

  const verifyOtp = async () => {
    if (otp !== '1234') {
      Alert.alert('Invalid OTP', 'Try again');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    Alert.alert('Login Successful ✅');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome 👋</Text>
          <Text style={styles.subtitle}>Login with phone number</Text>
        </View>

        <View style={styles.form}>
          {step === 'phone' && (
            <>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="09xxxxxxxx"
                keyboardType="phone-pad"
                style={styles.input}
              />
              <TouchableOpacity style={styles.button} onPress={sendOtp} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Sending…' : 'Send OTP'}</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 'otp' && (
            <>
              <Text style={styles.label}>Enter OTP</Text>
              <TextInput
                value={otp}
                onChangeText={setOtp}
                placeholder="1234"
                keyboardType="number-pad"
                style={styles.input}
              />
              <TouchableOpacity style={styles.button} onPress={verifyOtp} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Verifying…' : 'Verify OTP'}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f172a' },
  container: { flex: 1, padding: 20, gap: 16 },
  header: { marginTop: 12 },
  title: { fontSize: 28, fontWeight: '800', color: 'white' },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  form: { backgroundColor: 'white', borderRadius: 16, padding: 16, gap: 12 },
  label: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 12, android: 10 }),
    fontSize: 16,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '700' },
});
