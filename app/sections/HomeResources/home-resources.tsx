import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, ImageBackground, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeResources = () => {
  const navigation = useNavigation();

  // Example button configuration (can be fetched from a backend or config file)
  const buttons = [
    {
      id: '1',
      type: 'external', // 'external' or 'internal'
      link: 'https://example.com', // URL or screen name
      backgroundImage: require('../../../assets/images/stockphoto.jpg'), // Local image
      text: 'Resource 1',
    },
    {
      id: '2',
      type: 'internal',
      link: 'InternalPage', // Screen name for internal navigation
      backgroundImage: require('../../../assets/images/testbackground.jpg'),
      text: 'Resource 2',
    },
    {
      id: '3',
      type: 'external',
      link: 'https://google.com',
      backgroundImage: require('../../../assets/images/Google-Emblem001.png'),
      text: 'Google.com',
    },
    {
      id: '4',
      type: 'external',
      link: 'https://bing.com',
      backgroundImage: require('../../../assets/images/microsoft-bing-logo-001.jpg'),
      text: 'Bing.com',
    },
    {
      id: '5',
      type: 'external',
      link: 'https://example.com', // URL or screen name
      backgroundImage: require('../../../assets/images/stockphoto.jpg'),
      text: 'Resource 5',
    },
    {
      id: '6',
      type: 'internal',
      link: 'InternalPage', // Screen name for internal navigation
      backgroundImage: require('../../../assets/images/testbackground.jpg'),
      text: 'Resource 6',
    },
    // Add more buttons as needed
  ];

  const handleExternalLink = (link) => {
    Linking.openURL(link).catch((err) => {
      Alert.alert('Error', 'Could not open link.');
      console.error('An error occurred', err);
    });
  };

  const handleInternalLink = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.sectionTitle}>Resources</Text>

      <View style={styles.container}>
        {buttons.map((button) => (
          <TouchableOpacity
            key={button.id}
            style={styles.resourceButton}
            onPress={() => {
              if (button.type === 'external') {
                handleExternalLink(button.link);
              } else {
                handleInternalLink(button.link);
              }
            }}
          >
            <ImageBackground
              source={button.backgroundImage}
              style={styles.backgroundImage}
              imageStyle={styles.backgroundImageStyle} // Apply resizeMode here
            >
              <Text style={styles.resourceText}>{button.text}</Text>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    maxWidth: 500,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  resourceButton: {
    width: '40%',
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden', // Ensures the background image stays within the button bounds
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImageStyle: Platform.select({
    web: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center',
    },
    default: {
      resizeMode: 'cover', // Use resizeMode for mobile
    },
  }),
  resourceText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for better text visibility
    padding: 8,
    borderRadius: 5,
  },
});

export default HomeResources;