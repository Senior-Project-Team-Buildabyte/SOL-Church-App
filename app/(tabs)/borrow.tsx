import DynamicButton from "@/components/universal/dynamic-button";
import { useAuth } from "@/components/universal/useAuth";
import { authService } from "@/services/auth.service";
import { LinearGradient } from "expo-linear-gradient";
import { Alert, ImageBackground, StyleSheet, Text, View } from "react-native";

const BorrowPage = () => {
    const { session, userstate, loading } = useAuth();
    {console.log("session: ", session)}
    {console.log("session.user: ", session?.user)}
    return (
    
    <View style={styles.container}>
        <ImageBackground
        source={require('@/assets/images/bg-mission.jpg')}
        style={styles.frontimage}
        resizeMode="cover">

            <View style={styles.headingWrapper}>
                <LinearGradient
                    style={[ styles.pageHeading ]}
                    colors={["rgba(149, 185, 247, 1)", "rgba(60,129,246,1)"]}
                    {...{
                    start: { x: 0, y: 0.5 },
                    end: { x: 1, y: 0.5 },    
                    }}
                >
                    <ImageBackground
                    source={require('@/assets/images/favicon-drop.png')}
                    style={ [{height: '100%'}, {aspectRatio: 1},] }
                    resizeMode="cover">
                    </ImageBackground>

                    <Text style={styles.headingText}>SOL Inventory</Text>

                </LinearGradient>
                {/* <View style={styles.pageHeading}>

                </View> */}
            </View>

        </ImageBackground>
        
        <View style={styles.buttons}>

            <DynamicButton buttons={[
                {
                    type: 1, // internal
                    shape: 0, // full
                    buttonConfig: {
                        text: "Borrow an Item",
                        icon: "shopping-basket",
                        internalLink: `../borrow/borrowItems`,
                        backgroundGradient: ["0", "rgba(60,129,246,1)", "rgba(149, 185, 247, 1)"]
                    }
                },
            ]}/>

            <DynamicButton buttons={[
                {
                    type: 1, // internal
                    shape: 0, // full
                    buttonConfig: {
                        text: "Return Items",
                        icon: "undo",
                        internalLink: `../borrow/returnItems`,
                        backgroundGradient: ["0", "rgba(149, 185, 247, 1)", "rgba(60,129,246,1)"]
                    }
                },
            ]}/>

            <DynamicButton buttons={[
                {
                    type: 1, // internal
                    shape: 0, // full
                    buttonConfig: {
                        text: "QR Code Scanner",
                        icon: "camera",
                        internalLink: `../borrow/qr-scanner`,
                        backgroundGradient: ["0", "rgba(149, 185, 247, 1)", "rgba(60,129,246,1)"]
                    }
                },
            ]}/>


            {/* TODO: Add actual admin verification here - right now only handles manual IDs */}
            {/* Also, make sure this is the actual secure way to hide admin controls. For now it works */}
            { session && /*userstate?.role === "admin" &&*/
            (session.user.id === "7e34e997-8e76-46e4-8078-f0c362cccd15"
            // add more test admin ids here if needed - get from local session logs
            || session.user.id === "876d5722-72f2-4dfd-ac0a-35115cb36989"
            )
            ? (
              
              <DynamicButton buttons={[
                {
                  type: 1, // internal
                  shape: 0, // full
                  buttonConfig: {
                    text: "Inventory Requests",
                    icon: "bell",
                    internalLink: `../admin/inventory_requests`,
                    backgroundGradient: ["0", "rgba(149, 185, 247, 1)", "rgba(60,129,246,1)"]
                  }
                },
              ]}/>
            ) : null
            }

        </View>
    </View>

    )
};


// styles
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        width: '100%',
        height: '100%',
    },
    frontimage: {
        width: '100%',
        height: 250,
    },
    headingWrapper: {
        maxWidth: 650,
        width: '100%',
        height: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pageHeading: {
        height: 60,
        backgroundColor: 'rgba(58, 120, 227, 1)',
        width: '70%',
        maxWidth: 350,
        borderRadius: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    headingText: {
        color: '#fff',
        fontSize: 30,
        textAlign: 'center',
        flexGrow: 1,
        fontWeight: 'bold',
        textShadowColor: '#333',
        textShadowRadius: 10,
        textShadowOffset: {width: 1, height: 2},
    },
    buttons: {
        flex: 1,
        justifyContent: 'space-evenly',
        maxHeight: 500,
        width: '90%',
        alignSelf: 'center'
    }
});

export default BorrowPage;