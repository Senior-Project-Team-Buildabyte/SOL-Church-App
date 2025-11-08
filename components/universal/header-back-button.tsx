import { router } from 'expo-router';
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

export default function BackHeaderBar() {
  const handlePress = () => {
    console.log('Image clicked!');
  };
  const handleLoginPress = () => {
    console.log('Login Image clicked!');
    router.navigate("../../[auth]/account")
  };

  return (
    <>
      <View style={styles.header}>
        {/* Left: Logo and Text */}

        <Pressable 
        style={styles.backButton}
        onPress={() => router.back()}>

          {({ pressed }) => (
            <>
              <Ionicons name="arrow-back" size={30} color={pressed ? "#999" : "black"} />
            </>
          )}
        </Pressable>

        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/favicon-drop.png')}
            style={styles.logo}
          />
          <Text style={styles.logoText}>SOL Church</Text>
        </View>
      </View>
      {/* <View style={[styles.header, {height: 30, top: 50,}]}>
        

      </View> */}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
    width: 60,
    height: 40,
    marginRight: 10,
  },
  backButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
