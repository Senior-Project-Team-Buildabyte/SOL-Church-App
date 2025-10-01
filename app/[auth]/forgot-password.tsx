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

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSelected, setEmailSelected] = useState(false);
  const router = useRouter();
  const canSubmit = email.length > 0;


  async function sendResetLink() {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: '/[auth]/update-password', // The user will be redirected to this page after clicking the link.
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Please check your inbox for a password reset link!');
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
        <Text style={styles.title}>Reset Password</Text>
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

      <Text style={styles.instructions}>
        Enter your email address and we'll send you a link to reset your password.
      </Text>

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

      <Pressable
        style={({ pressed }) => [
          styles.button,
          !canSubmit && { backgroundColor: '#999' },        // gray when disabled
          canSubmit && pressed && styles.loginButtonPressed,  // pressed style when enabled
        ]}
        onPress={sendResetLink}
        disabled={!canSubmit || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send Reset Link</Text>
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
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  instructions: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
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

export default ForgotPassword;
