import { ButtonType, ButtonShape, GenericButtonConfig } from "@/app/models/ButtonConfig";
import { FC, useState } from "react";
import { Text, View, StyleSheet, ImageBackground, Linking, TouchableOpacity, Alert } from "react-native";
import { Icon } from 'react-native-elements'
import { Link, useRouter, RelativePathString } from 'expo-router';
import { routeToScreen } from "expo-router/build/useScreens";


const LinkPageButton: FC<GenericButtonConfig> = ({
    type, shape,
    buttonConfig: { text, backgroundImage, backgroundColor, internalLink, link, icon }
}) => {
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const internalPress = () => {
        if (internalLink != undefined) {
            console.log(internalLink)
            router.push(internalLink);
        };
    }

    const externalPress = async () => {
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

    const handlePress = (type === ButtonType.ExternalLink) ? externalPress : internalPress;

    const getButtonStyles = () => {
        const isSquare = shape === ButtonShape.Square;
      
        return StyleSheet.create({
            container: {
                width: '100%',
                aspectRatio: isSquare ? 1 : undefined,
                maxWidth: isSquare ? 200 : 650,
                maxHeight: isSquare ? 200 : 150,
                alignItems: 'center', // Center horizontally
                padding: 10,
                height: isSquare ? undefined : 150,
            },
            background: {
                width: isSquare ? '100%' : '90%',
                height: isSquare ? '100%' : '100%',
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
    };

    const styles = getButtonStyles();
    
    const getImageSource = () => {
        if (!backgroundImage) {
            return require('../../../assets/images/bluredimage.jpg');
        }
        if (typeof backgroundImage === 'string') {
            return { uri: backgroundImage };
        }
        return backgroundImage; // assuming it's already a require() result or valid image source
    };

    const ButtonContent = () => (
        <View style={styles.button}>
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
        </View>
    );

    const isValidColor = (color: string | undefined): boolean => {
        if (!color) return false;
        // Basic hex color validation (supports #RGB, #RRGGBB, #RRGGBBAA, "rgba(#,#,#,#)")
        return /^#([0-9A-F]{3}){1,2}$/i.test(color) || 
            /^#([0-9A-F]{4}){1,2}$/i.test(color) ||
            /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(1|0|0?\.\d+)\s*\)$/i.test(color) // rgba();
    };
    return (
        <View style={styles.container}>
            <TouchableOpacity
            style={[
                styles.background,
                // Apply background color if no image should be used
                !backgroundImage && { backgroundColor: isValidColor(backgroundColor)
                    ? backgroundColor : '#C3C3C3' }
            ]}
            onPress={handlePress}>
                {backgroundColor !== undefined && !backgroundImage ? (
                    // If a color is given and there is no image provided,
                    // use that instead of the default background image
                    <ButtonContent />
                ) : (
                    // Default to image
                    <ImageBackground
                    source={getImageSource()}
                    style={styles.button}
                    blurRadius={ backgroundImage!=undefined ?  0 : 20}
                    resizeMode="cover">
                        <ButtonContent />
                    </ImageBackground>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default LinkPageButton;