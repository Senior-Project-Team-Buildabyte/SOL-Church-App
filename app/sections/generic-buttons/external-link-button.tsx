import { ButtonConfig } from "@/app/models/ButtonConfig";
import React, { Component, FC, useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView, ImageBackground, Linking, TouchableOpacity, Pressable, Alert } from "react-native";
import { Icon } from 'react-native-elements'


const ExternalLinkButton: FC<ButtonConfig> = ({ text, backgroundImage, link, icon }) => {

    const [loading, setLoading] = useState<boolean>(true);
    const handlePress = async () => {
        if (link != undefined)
            try {
                const supported = await Linking.canOpenURL(link);
                if (supported) {
                  await Linking.openURL(link);
                } else {
                  Alert.alert("Error", `Cannot open link: ${link}`);
                  console.error(`Unable to open link: ${link}`);
                }
              } catch (error) {
                console.warn("This error is harmless and can be ignored:", error);
              }
    };
    const styles = StyleSheet.create({
        container: {
            height: 175,
            width: '100%', // Full width,
            alignItems: 'center', // Center horizontally
            padding: 10,
        },
        background: {
            width: '90%', // Takes 90% of screen width
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20, // Rounded corners
            overflow: 'hidden', // Keeps children inside rounded border
            margin: 0,
            padding: 0
        },
        button: {
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            //alignItems: 'center',
        },
        text: {
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
        },
        content: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10, // Add spacing between icon & text
        },
        icon: {
            fontSize: 24,
            color: 'white',
            padding: 10
        },
    });



    return (
        <View style={styles.container}>
            <View style={styles.background}>
                
                    <ImageBackground
                    source={ backgroundImage ? {uri: backgroundImage}: require('../../../assets/images/bluredimage.jpg')}
                    style={styles.button}
                    blurRadius={ backgroundImage!=undefined ?  0 : 20}
                    resizeMode="cover"
                >
                    <Pressable style={styles.button} onPress={handlePress}>
                        <View style={styles.content}>
                            <>
                                {icon != undefined ?
                                    <Icon style={styles.icon} name={icon!}
                                        type='font-awesome'
                                        color='white'
                                    /> : null
                                }
                            </>
                            <Text style={styles.text}>{text}</Text>
                        </View>
                    </Pressable>
                </ImageBackground>
            </View>
        </View>

    );

};

export default ExternalLinkButton;