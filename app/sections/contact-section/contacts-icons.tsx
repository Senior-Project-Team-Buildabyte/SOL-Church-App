import React from 'react';
import {Text, View, Alert} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Linking from 'expo-linking';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const ContactsIcons = () => {
    const handleCall = () => {
        Linking.openURL('tel:+19167987306').catch(err => {
          Alert.alert('Error', 'Could not place the call.');
          console.error('An error occurred', err);
        });
      };
    const handleInsta = () => {

        Linking.openURL('instagram://user?username=sol_sacramento').catch(err => {
            Linking.openURL('https://www.instagram.com/sol_sacramento/').catch(err => {
                Alert.alert('Error', 'Something went wrong.');
                console.error('An error occurred', err);
              });
        });
      };
    const handleFacebook = () => {
        Linking.openURL('fb://profile/churchSOL').catch(err => {
          Linking.openURL('https://www.facebook.com/churchSOL').catch(err => {
              Alert.alert('Error', 'Something went wrong.');
              console.error('An error occurred', err);
            });
        });
      
      };
    const handleYoutube = () => {
        Linking.openURL('youtube://www.youtube.com/SpringofLifeChurchSOL').catch(err => {
            Linking.openURL('https://www.youtube.com/SpringofLifeChurchSOL').catch(err => {
                Alert.alert('Error', 'Something went wrong.');
                console.error('An error occurred', err);
            });
        });
      };
    const handleWeb = () => {
        Linking.openURL('https://www.solsacramento.com/').catch(err => {
          Alert.alert('Error', 'Something went wrong.');
          console.error('An error occurred', err);
        });
      };
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", width: "80%", padding: 1 }}>
      <FontAwesome.Button 
            name="phone" 
            backgroundColor="transparent"
            color="#3b5998" 
            onPress={handleCall}
            borderRadius={0} 
            iconStyle={{ marginRight: 0, fontSize: 50}} 
            
        />
        <FontAwesome.Button 
            name="instagram" 
            backgroundColor="transparent"
            color="#3b5998" 
            onPress={handleInsta}
            borderRadius={0} 
            iconStyle={{ marginRight: 0, fontSize: 50}} 
        />
        <FontAwesome5.Button 
            name="facebook" 
            backgroundColor="transparent"
            color="#3b5998" 
            onPress={handleFacebook}
            borderRadius={0} 
            iconStyle={{ marginRight: 0, fontSize: 50}} 
        />
        <FontAwesome.Button 
            name="youtube-play" 
            backgroundColor="transparent"
            color="#3b5998" 
            onPress={handleYoutube}
            borderRadius={0} 
            iconStyle={{ marginRight: 0, fontSize: 50}} 
        />
        <MaterialCommunityIcons.Button 
            name="web"     
            backgroundColor="transparent"
            color="#3b5998" 
            onPress={handleWeb}
            borderRadius={0} 
            iconStyle={{ marginRight: 0, fontSize: 50}} 
        />
    </View>
);
};

export default ContactsIcons;