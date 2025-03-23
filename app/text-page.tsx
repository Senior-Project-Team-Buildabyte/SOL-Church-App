import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from '@react-navigation/native';

export default function TextPage() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Header Bar with Back Button */}
            <View style={styles.header_bar}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back_button}>
                    <Image
                        source={require('../assets/images/black_arrow.png')} 
                        style={{ width: 30, height: 30 }}
                    />
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <View style={styles.text_container}>
                <Text style={styles.text}>Sample Text Screen</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    header_bar: {
        height: 60,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    back_button: {
        alignSelf: 'flex-start',
    },
    text_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: "white",
        fontSize: 18,
        fontWeight: 'bold',
    },
});
