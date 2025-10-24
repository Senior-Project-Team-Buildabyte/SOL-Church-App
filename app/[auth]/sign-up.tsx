import React, { useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import ConfirmHcaptcha from '@hcaptcha/react-native-hcaptcha';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ActivityIndicator,
  AppState,
  Platform,
} from 'react-native';
import { authService } from '@/services/auth.service';

const SITE_KEY = process.env.EXPO_PUBLIC_HCAPTCHA_SITEKEY ?? '27947306-3afa-4d68-a44c-af0847b4db7c';
const BASE_URL = process.env.EXPO_PUBLIC_HCAPTCHA_BASEURL ?? 'https://example.com';
const isWeb = Platform.OS === 'web';

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordSelected, setConfirmPasswordSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSelected, setEmailSelected] = useState(false);
  const [passwordSelected, setPasswordSelected] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<any>(null);

  const canSignUp = passwordsMatch && !!captchaToken;

  const openCaptcha = () => {
    setCaptchaToken(null);
    captchaRef.current?.show();
  };

  const onCaptchaMessage = (e: any) => {
    const msg = e?.nativeEvent?.data;
    if (typeof msg === 'string' && msg.length > 20) {
      setCaptchaToken(msg);
      captchaRef.current?.hide?.();
      return;
    }
    if (msg === 'challenge-closed' || msg === 'cancel' || msg === 'error' || msg === 'expired') {
      setCaptchaToken(null);
      captchaRef.current?.hide?.();
    }
  };

  const handleSignUp = async () => {
    try {
      await authService.signUpWithEmail(email.trim(), password, captchaToken ?? undefined);
      Alert.alert('Success', 'Please check your inbox for email verification!');
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert('Error', err.message);
      } else {
        Alert.alert('Error', 'An unknown error occurred during sign up.');
      }
    } finally {
      setLoading(false);
      setCaptchaToken(null);
      router.replace('../[auth]/login');
    }
  }

  return (
    <View style={styles.background}>
      <View style={styles.container}>

        <Image
          source={require("@/assets/images/favicon-drop.png")}
          style={styles.logo}
        />

        <View style={styles.headerRow}>
          <Text style={styles.title}>Create account</Text>
          <Pressable onPress={() => router.back()}>
            {({ pressed }) => (
              <Text
                style={[styles.linkText, pressed && styles.linkTextPressed]}
              >
                Sign in
              </Text>
            )}
          </Pressable>
        </View>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="email@address.com"
          placeholderTextColor={'#aaa'}
          autoCapitalize="none"
          keyboardType="email-address"
          style={[styles.input, emailSelected && styles.inputSelected]}
          autoFocus={true}
          textContentType="emailAddress"
          onFocus={() => setEmailSelected(true)}
          onBlur={() => setEmailSelected(false)}
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor={'#aaa'}
          secureTextEntry={!showPassword}
          style={[styles.input, passwordSelected && styles.inputSelected]}
          autoFocus={false}
          textContentType="password"
          onFocus={() => setPasswordSelected(true)}
          onBlur={() => setPasswordSelected(false)}
        />

        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm Password"
          placeholderTextColor={'#aaa'}
          secureTextEntry={!showPassword}
          style={[styles.input, confirmPasswordSelected && styles.inputSelected]}
          autoFocus={false}
          textContentType="password"
          onFocus={() => setConfirmPasswordSelected(true)}
          onBlur={() => setConfirmPasswordSelected(false)}
        />

        {password !== confirmPassword && confirmPassword.length > 0 && (
          <Text style={styles.errorText}>Passwords do not match.</Text>
        )
        }

        <Pressable
          style={({ pressed }) => [
            styles.button,
            !canSignUp && { backgroundColor: '#999' },        // gray when disabled
            canSignUp && pressed && styles.loginButtonPressed,  // pressed style when enabled
          ]}
          onPress={handleSignUp}
          disabled={!canSignUp || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign up</Text>
          )}
        </Pressable>

      {/* <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="email@address.com"
        placeholderTextColor={'#aaa'}
        autoCapitalize="none"
        keyboardType="email-address"
        style={[styles.input, emailSelected && styles.inputSelected]}
        autoFocus={true}
        textContentType="emailAddress"
        onFocus={() => setEmailSelected(true)}
        onBlur={() => setEmailSelected(false)}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor={'#aaa'}
        secureTextEntry={!showPassword}
        style={[styles.input, passwordSelected && styles.inputSelected]}
        autoFocus={false}
        textContentType="password"
        onFocus={() => setPasswordSelected(true)}
        onBlur={() => setPasswordSelected(false)}
      /> */}



      {/* <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm Password"
        placeholderTextColor={'#aaa'}
        secureTextEntry={!showPassword}
        style={[styles.input, confirmPasswordSelected && styles.inputSelected]}
        autoFocus={false}
        textContentType="password"
        onFocus={() => setConfirmPasswordSelected(true)}
        onBlur={() => setConfirmPasswordSelected(false)}
      /> */}

      {/* {password !== confirmPassword && confirmPassword.length > 0 && (
        <Text style={styles.errorText}>Passwords do not match.</Text>
      )} */}

      {isWeb ? (
        <View style={{ marginTop: 6, marginBottom: 8 }}>
          <HCaptcha
            sitekey={SITE_KEY}
            onVerify={(token) => setCaptchaToken(token)}
            onExpire={() => setCaptchaToken(null)}
            onError={() => setCaptchaToken(null)}
          />
        </View>
      ) : (
        <>
          <Pressable
            onPress={openCaptcha}
            disabled={!!captchaToken}
            style={[
              styles.button,
              {
                backgroundColor: captchaToken ? '#4CAF50' : '#efefef',
                marginTop: 12,
              }
            ]}
          >
            <Text style={[styles.buttonText, { color: captchaToken ? '#fff' : '#333' }]}>
              {captchaToken ? 'Verified ✓' : 'Verify I’m human'}
            </Text>
          </Pressable>

          <ConfirmHcaptcha
            ref={captchaRef}
            siteKey={SITE_KEY}
            baseUrl={BASE_URL}
            onMessage={onCaptchaMessage}
            size={'normal'}
          />
        </>
      )}

      <Text style={styles.hintText}>
        Password must be at least 8 characters and include one uppercase, one lowercase, one number, and one special symbol.
      </Text>
      {/* <Pressable
        style={({ pressed }) => [
          styles.button,
          !canSignUp && { backgroundColor: '#999' },
          canSignUp && pressed && styles.loginButtonPressed,
        ]}
        onPress={signUpWithEmail}
        disabled={!canSignUp || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign up</Text>
        )}
      </Pressable> */}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 450,
  },
  logo: {
    width: 104,
    height: 104,
    alignSelf: 'center',
    marginBottom: 30,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    backgroundColor: '#eaeaea',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#bbb',
    color: '#444',
  },
  inputSelected: {
    borderColor: '#777',
    borderWidth: 2,
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: '#007AFF',
    fontSize: 14,
  },
  linkText: { fontSize: 15, color: "rgba(183, 113, 240, 1)" },
  linkTextPressed: {
    color: "rgba(183, 113, 240, 0.5)",
    textDecorationLine: "underline",
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  loginButtonPressed: { backgroundColor: "#777" },
  errorText: { color: 'red', marginBottom: 10, textAlign: 'center' },
  hintText: {
    color: '#666',
    fontSize: 12,
    marginTop: 10,
    marginBottom: 12,
    textAlign: 'left',
  },
});

export default SignUp;
