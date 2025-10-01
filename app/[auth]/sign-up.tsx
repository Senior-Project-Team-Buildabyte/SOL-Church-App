import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

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
} from 'react-native';


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
  const canSignUp = passwordsMatch;


  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else if (!session) {
      Alert.alert('Success', 'Please check your inbox for email verification!');
    }
    setLoading(false);
  }



  return (
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
        onPress={signUpWithEmail}
        disabled={!canSignUp || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign up</Text>
        )}
      </Pressable>

         
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
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
    color: '#007AFF', // Standard iOS link color
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
});

export default SignUp;
