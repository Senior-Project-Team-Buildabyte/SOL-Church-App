import { router } from 'expo-router';
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HeaderBar() {
  const handlePress = () => {
    console.log('Image clicked!');
  };
  const handleLoginPress = () => {
    console.log('Login Image clicked!');
    router.navigate("../../[auth]/account")
  };

  return (
    <SafeAreaView>
    <View style={styles.header}>
      {/* Left: Logo and Text */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/favicon-drop.png')}
          style={styles.logo}
        />
        <Text style={styles.logoText}>SOL Church</Text>
      </View>

      {/* Right: Icons */}
      <View style={styles.buttonsContainer}> 
        <TouchableOpacity onPress={handleLoginPress}>
          <Image
            source={require('../../assets/images/login-button.png')}
            style={[styles.icon, { marginRight: 0 }]}
            />
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 37,
    height: 37,
    marginRight: 10,
  },
  logoText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
});
