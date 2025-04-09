import React from 'react';
import { View, Image, TouchableOpacity, Linking, StyleSheet, ScrollView, Text } from 'react-native';

const openLink = (url) => {
  Linking.openURL(url).catch((err) => console.error("Failed to open URL", err));
};

const images = {
  giveIcon: require('../assets/images/giveicon.png'),
  aboutIcon: require('../assets/images/aboutsolicon.png'),
  conncectIcon: require('../assets/images/connectcardicon.png'),
  groupsIcon: require('../assets/images/groupsicon.png'),
  meetPastorIcon: require('../assets/images/conwpastoricon.png'),
  prayerReqIcon: require('../assets/images/prayericon.png'),
  membershipIcon: require('../assets/images/membershipicon.png'),
  baptismIcon: require('../assets/images/baptismicon.png'),
  serveIcon: require('../assets/images/serveicon.png'),
  childIcon: require('../assets/images/childdedicon.png'),
  phoneIcon: require('../assets/images/callicon.png'),
  fbIcon: require('../assets/images/fbicon.png'),
  emailIcon: require('../assets/images/emailicon.png'),
  instaIcon: require('../assets/images/instaicon.png'),
  ytIcon: require('../assets/images/yticon.png'),
  webIcon: require('../assets/images/webicon.png'),
};

// Big box icons & links
const bigBoxItems = [
  { image: images.giveIcon, url: 'https://www.solsacramento.com/give' },
  { image: images.aboutIcon, url: 'https://www.solsacramento.com/about?embedded=true' },
  { image: images.conncectIcon, url: 'https://solsacramento.churchcenter.com/people/forms/718725' },
  { image: images.groupsIcon, url: 'https://yoursite.com/groups' },
  { image: images.meetPastorIcon, url: 'https://calendly.com/office-fb6/45min' },
  { image: images.prayerReqIcon, url: 'https://solsacramento.churchcenter.com/people/forms/612308' },
  { image: images.membershipIcon, url: 'https://solsacramento.churchcenter.com/people/forms/581714' },
  { image: images.baptismIcon, url: 'https://solsacramento.churchcenter.com/people/forms/460975' },
  { image: images.serveIcon, url: 'https://solsacramento.churchcenter.com/people/forms/708470' },
  { image: images.childIcon, url: 'https://solsacramento.churchcenter.com/people/forms/589043' },
];

// Small icons & links
const smallBoxItems = [
  { image: images.phoneIcon, url: 'tel:9167597474' },
  { image: images.emailIcon, url: 'mailto:office@solsacramento.com' },
  { image: images.webIcon, url: 'https://www.solsacramento.com' },
  { image: images.instaIcon, url: 'https://www.instagram.com/sol_sacramento?igsh=MzRlODBiNWFlZA==' },
  { image: images.ytIcon, url: 'https://youtube.com/@springoflifechurchsol?si=QsA38AcGYxntUyas' },
  { image: images.fbIcon, url: 'https://m.facebook.com/churchSOL/?rf=178230975527106&wtsid=rdr_0zsPJaQGmTwscIlP7r' },
];

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Get Involved</Text>
        <Text style={styles.subtitle}>Steps to become closer to SOL</Text>
      </View>

      {/* Big Boxes Grid */}
      <View style={styles.bigBoxGrid}>
        {bigBoxItems.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => openLink(item.url)} style={styles.bigBox}>
            <Image source={item.image} style={styles.image} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Small Boxes Row */}
      <View style={styles.smallBoxRow}>
        {smallBoxItems.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => openLink(item.url)} style={styles.smallBox}>
            <Image source={item.image} style={styles.image} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#ffffff',
  },
  header: {
    width: '90%',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#007AFF',
    marginTop: 20,      
    marginBottom: 6,
  },
  
  subtitle: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 14,
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
    marginBottom: 100, //added extra margin to accomidate for eventual navbar 
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
