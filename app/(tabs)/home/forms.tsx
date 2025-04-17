import { FormsData, fetchFormsData } from "@/services/formsService";
import { Component, useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, Linking, Alert } from "react-native";
import { Icon } from 'react-native-elements'


const FormsPage = () => {
    const [data, setData] = useState<FormsData[]>([{ title: '', link: '' }]);

    const handlePress = async (link: string) => {
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

    useEffect(() => {
        const getFormsData = async () => {
            try {
                const forms = await fetchFormsData('/data');
                console.log(forms)
                setData(forms); // Set the fetched data
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        getFormsData();
    }, []);

    const styles = StyleSheet.create({
        scrollContainer: {
            flexGrow: 1,
            maxWidth: 650,
            width: "100%",
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        eventWrapper: {
            backgroundColor: "white",
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: "100%"
        },
        background: {
            width: '100%',
            borderColor: 'gray',
            borderStyle: "solid",
            borderLeftWidth:0,
            borderRightWidth:0,
            borderBottomWidth: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        title: {
            padding: 20,
            alignContent: 'flex-start'
        },
        icon: {
            fontSize: 24,
            color:'rgb(161, 161, 161)',
            padding: 15,
            alignSelf: 'flex-end'
        },
    });

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {data.map((_, index) => (
                <View key={index} style={styles.eventWrapper}>
                    <TouchableOpacity
                        style={
                            styles.background}
                        onPress={() => handlePress(_.link)}>
                        <Text style={styles.title}>{_.title}</Text>
                        <Icon
                            style={styles.icon}
                            name='angle-right'
                            type='font-awesome'
                            color='rgb(161, 161, 161)'
                        
                        />
                    </TouchableOpacity>
                </View>
            ))}

        </ScrollView>
    );
};

export default FormsPage;