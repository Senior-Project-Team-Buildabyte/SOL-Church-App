import { ButtonType, ButtonShape, GenericButtonConfig } from "@/models/ButtonConfig";
import { FC, useState } from "react";
import { Text, View, StyleSheet, ImageBackground, Linking, TouchableOpacity, Alert, Pressable } from "react-native";
import { Icon } from 'react-native-elements'
import { Link, useRouter, RelativePathString } from 'expo-router';
import { routeToScreen } from "expo-router/build/useScreens";
import { color } from "react-native-elements/dist/helpers";
import { LinearGradient } from 'expo-linear-gradient';


const LinkPageButton: FC<GenericButtonConfig> = ({
    type, shape,
    buttonConfig: {
        text, subText, textColor, backgroundImage, backgroundColor,
        backgroundGradient, link, internalLink, icon, iconColor
    }
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
                width: isSquare ? '100%' : '100%',
                height: isSquare ? '100%' : '100%',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 15, // Rounded corners
                borderColor: 'rgba(225,225,225,1)', //only for white background buttons
                borderWidth: type == 2 ? 2 : 0,  //only for white background buttons
                overflow: 'hidden', // Keeps children inside rounded border
                margin: 0,
                padding: 0
            },
            button: {
                width: '100%',
                height: '100%',
                justifyContent: 'center',
            },
            mainText: {
                color: (
                    !textColor ? (
                        type == 2 ? 'rgba(63,103,186,1)' : 'white'  //only for white background buttons
                    ) : textColor
                ),
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
                overflow: 'hidden',
            },
            subText: {
                color: (
                    !textColor ? (
                        type == 2 ? 'rgba(63,103,186,1)' : 'white'  //only for white background buttons
                    ) : textColor
                ),
                fontSize: 14,
            },
            content: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10, // Add spacing between icon & text
            },
            icon: {
                fontSize: 24,
            },
            iconAbove: {
                marginBottom: '4%',
                marginTop: -4, // shifts the icon slightly upward
                alignSelf: 'center',
            },
            iconWrapper: {
                position: 'absolute',
                left: 24, // fixed distance from the left edge
                top: 0,
                bottom: 0,
                justifyContent: 'center',
            },
            textWrapper: {
                position: 'static',
                alignItems: 'center',
                justifyContent: 'center',
                maxWidth: '72%',
            },
        });
    };
    
    const getImageSource = () => {
        if (!backgroundImage) {
            return require('../../assets/images/bluredimage.jpg');
        }
        if (typeof backgroundImage === 'string') {
            return { uri: backgroundImage };
        }
        return backgroundImage; // assuming it's already a require() result or valid image source
    };

    const isValidColor = (color: string | undefined): boolean => {
        if (!color) return false;
        // Basic hex color validation (supports #RGB, #RRGGBB, #RRGGBBAA, "rgba(#,#,#,#)")
        return /^#([0-9A-F]{3}){1,2}$/i.test(color) || 
            /^#([0-9A-F]{4}){1,2}$/i.test(color) ||
            /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(1|0|0?\.\d+)\s*\)$/i.test(color) // rgba();
    };

    const getDirectionFromAngle = (angle: string) => {
        const angleDeg: number = Number(angle);
        if (isNaN(angleDeg)) {
            // Fallback to default (0 = Left to Right)
            return {
                start: { x: 0, y: 0.5 },
                end: { x: 1, y: 0.5 },
            };
        }
        const radians = (angleDeg * Math.PI) / 180;
        const x = Math.cos(radians);
        const y = Math.sin(radians);
        return {
            start: { x: 0.5 - x / 2, y: 0.5 - y / 2 },
            end: { x: 0.5 + x / 2, y: 0.5 + y / 2 },
        };
    };

    const styles = getButtonStyles();


    const ButtonContent = () => (
        <View style={styles.button}>
            {/* Icon positioned left if full button, above if square */}
            {icon && (
                <View style={shape === ButtonShape.Square ? 
                    styles.iconAbove : styles.iconWrapper}>
                <Icon
                    style={styles.icon}
                    name={icon!}
                    type="font-awesome"
                    color={
                    !iconColor ? (
                        type === 2 ? 'rgba(63,103,186,1)' : 'white' //check for white background buttons
                    ) : iconColor
                    }
                />
                </View>
            )}
            <View style={styles.content}>
                
                {/* Main content centered */}
                <View style={styles.textWrapper}>
                    <Text style={styles.mainText}>{text}</Text>
                    {subText ? <Text style={styles.subText}>{subText}</Text> : null}
                </View>

            </View>
        </View>

    );

    const PressableContent = () => (
        <>
        {backgroundColor || backgroundGradient && !backgroundImage ? (
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
        </>
    );

    const ButtonRender = () => (
        <>
        {backgroundGradient != undefined ? 
            (
                <LinearGradient
                    style={[ styles.background ]}
                    colors={[
                        isValidColor(backgroundGradient[1]) ? backgroundGradient[1] : "rgba(58, 120, 227, 1)",
                        isValidColor(backgroundGradient[2]) ? backgroundGradient[2] : "rgb(0, 0, 0)"
                    ]}
                    {...getDirectionFromAngle(backgroundGradient[0])}
                >
                    <PressableContent />
                </LinearGradient>
            ) : ( <PressableContent /> )
        }
        </>
    );


    return (
        <View style={styles.container}>
            <Pressable
                onPress={handlePress}
                style={({ pressed }) => [
                styles.background,
                // Simulate TouchableOpacity fade effect
                { opacity: pressed ? 0.2 : 1.0 },
                // Apply background color if no image or gradient
                !backgroundImage && !backgroundGradient && {
                    backgroundColor: isValidColor(backgroundColor)
                    ? backgroundColor : '#C3C3C3',
                },
                ]}
            >
                <ButtonRender />
            </Pressable>
        </View>
    );
};

export default LinkPageButton;