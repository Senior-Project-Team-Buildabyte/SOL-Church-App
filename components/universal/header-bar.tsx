import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function HeaderBar() {
  const handlePress = () => {
    console.log('Image clicked!');
  };

  return (
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
        <TouchableOpacity onPress={handlePress}>
          <Image
            source={require('../../assets/images/search-button.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePress}>
          <Image
            source={require('../../assets/images/login-button.png')}
            style={[styles.icon, { marginRight: 0 }]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
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
    width: 30,
    height: 30,
    marginRight: 5,
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
<<<<<<< HEAD:app/components/HeaderBar.tsx
});
||||||| 948e686:app/components/HeaderBar.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function HeaderBar() {
  const handlePress = () => {
    console.log('Image clicked!');
  };

  return (
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
        <TouchableOpacity onPress={handlePress}>
          <Image
            source={require('../../assets/images/search-button.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePress}>
          <Image
            source={require('../../assets/images/login-button.png')}
            style={[styles.icon, { marginRight: 0 }]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
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
    width: 30,
    height: 30,
    marginRight: 5,
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

=======
});
>>>>>>> main:components/universal/header-bar.tsx
