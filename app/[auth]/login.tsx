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
import { authService } from '@/services/auth.service';


AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSelected, setEmailSelected] = useState(false);
  const [passwordSelected, setPasswordSelected] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await authService.signInWithEmail(email, password);
      Alert.alert('Success', 'Logged in successfully.');
      router.dismissTo('/');
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert('Error', err.message);
      } else {
        Alert.alert('Error', 'An unknown error occurred during sign up.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.container}>

        <Image
          source={require("@/assets/images/favicon-drop.png")}
          style={styles.logo}
        />

        <View style={styles.headerRow}>
          <Text style={styles.title}>Email login</Text>
          <Pressable onPress={() => router.push('../[auth]/sign-up')}>
            {({ pressed }) => (
              <Text
                style={[styles.linkText, pressed && styles.linkTextPressed]}
              >
                Create account
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

        <View style={styles.forgotPasswordContainer}>
          <Pressable onPress={() => router.push('../[auth]/forgot-password')}>
            {({ pressed }) => (
              <Text
                style={[styles.linkText, pressed && styles.linkTextPressed]}
              >
                Forgot your password?
              </Text>
            )}
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.loginButtonPressed,
          ]}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Log in</Text>
          )}
        </Pressable>
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
});

export default Login;
