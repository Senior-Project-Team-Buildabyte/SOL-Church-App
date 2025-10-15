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

const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordSelected, setConfirmPasswordSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordSelected, setPasswordSelected] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const canUpdate = passwordsMatch;

  
  const handleUpdatePassword = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await authService.updatePassword(password);
      Alert.alert('Success', 'Your password has been updated successfully!');
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert('Error', err.message);
      } else {
        Alert.alert('Error', 'An unknown error occurred during password update.');
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
          <Text style={styles.title}>Update Password</Text>
          <Pressable onPress={() => router.back()}>
            {({ pressed }) => (
              <Text
                style={[styles.linkText, pressed && styles.linkTextPressed]}
              >
                Back
              </Text>
            )}
          </Pressable>
        </View>

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="New Password"
          placeholderTextColor={'#aaa'}
          secureTextEntry={!showPassword}
          style={[styles.input, passwordSelected && styles.inputSelected]}
          autoFocus={true}
          textContentType="newPassword"
          onFocus={() => setPasswordSelected(true)}
          onBlur={() => setPasswordSelected(false)}
        />

        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm New Password"
          placeholderTextColor={'#aaa'}
          secureTextEntry={!showPassword}
          style={[styles.input, confirmPasswordSelected && styles.inputSelected]}
          autoFocus={false}
          textContentType="newPassword"
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
            !canUpdate && { backgroundColor: '#999' },        // gray when disabled
            canUpdate && pressed && styles.loginButtonPressed,  // pressed style when enabled
          ]}
          onPress={handleUpdatePassword}
          disabled={!canUpdate || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Update Password</Text>
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
  errorText: { color: 'red', marginBottom: 10, textAlign: 'center' },
});

export default UpdatePassword;
