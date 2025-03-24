import React from 'react';
import { View, Image, TouchableOpacity, Linking, StyleSheet, ScrollView } from 'react-native';

const openLink = () => {
  Linking.openURL('https://youtube.com').catch((err) => console.error("Failed to open URL", err));
};

const stockImage = require('../assets/images/stockphoto.jpg');

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Big Boxes Grid (2 columns x 5 rows) */}
      <View style={styles.bigBoxGrid}>
        <TouchableOpacity onPress={openLink} style={styles.bigBox}>
          <Image source={stockImage} style={styles.image} />
        </TouchableOpacity>
        <TouchableOpacity onPress={openLink} style={styles.bigBox}>
          <Image source={stockImage} style={styles.image} />
        </TouchableOpacity>
        <TouchableOpacity onPress={openLink} style={styles.bigBox}>
          <Image source={stockImage} style={styles.image} />
        </TouchableOpacity>
        <TouchableOpacity onPress={openLink} style={styles.bigBox}>
          <Image source={stockImage} style={styles.image} />
        </TouchableOpacity>
        <TouchableOpacity onPress={openLink} style={styles.bigBox}>
          <Image source={stockImage} style={styles.image} />
        </TouchableOpacity>
        <TouchableOpacity onPress={openLink} style={styles.bigBox}>
          <Image source={stockImage} style={styles.image} />
        </TouchableOpacity>
        <TouchableOpacity onPress={openLink} style={styles.bigBox}>
          <Image source={stockImage} style={styles.image} />
        </TouchableOpacity>
        <TouchableOpacity onPress={openLink} style={styles.bigBox}>
          <Image source={stockImage} style={styles.image} />
        </TouchableOpacity>
        <TouchableOpacity onPress={openLink} style={styles.bigBox}>
          <Image source={stockImage} style={styles.image} />
        </TouchableOpacity>
        <TouchableOpacity onPress={openLink} style={styles.bigBox}>
          <Image source={stockImage} style={styles.image} />
        </TouchableOpacity>
      </View>

      {/* Small Boxes Row */}
      <View style={styles.smallBoxRow}>
        <TouchableOpacity onPress={openLink} style={styles.smallBox}>
          <Image source={stockImage} style={styles.image} />
        </TouchableOpacity>
        <TouchableOpacity onPress={openLink} style={styles.smallBox}>
          <Image source={stockImage} style={styles.image} />
        </TouchableOpacity>
        <TouchableOpacity onPress={openLink} style={styles.smallBox}>
          <Image source={stockImage} style={styles.image} />
        </TouchableOpacity>
        <TouchableOpacity onPress={openLink} style={styles.smallBox}>
          <Image source={stockImage} style={styles.image} />
        </TouchableOpacity>
        <TouchableOpacity onPress={openLink} style={styles.smallBox}>
          <Image source={stockImage} style={styles.image} />
        </TouchableOpacity>
        <TouchableOpacity onPress={openLink} style={styles.smallBox}>
          <Image source={stockImage} style={styles.image} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  bigBoxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '90%',
  },
  bigBox: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  smallBoxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 20,
  },
  smallBox: {
    width: '14%',
    aspectRatio: 1,
    borderRadius: 6,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
