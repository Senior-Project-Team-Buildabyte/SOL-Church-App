import DynamicButton from "@/components/universal/dynamic-button";
import { useAuth } from "@/components/universal/useAuth";
import { supabase } from "@/lib/supabase";
import { authService } from "@/services/auth.service";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Alert, ImageBackground, StyleSheet, Text, View } from "react-native";


// TODO: remove sign out before merge to main, after merge with newest auth changes
const handleSignOut = async () => {
  try {
    await authService.signOut();
    Alert.alert('Success', 'Signed out successfully.');
  } catch (err) {
    if (err instanceof Error) {
      Alert.alert('Error', err.message);
    } else {
      Alert.alert('Error', 'An unknown error occurred during sign up.');
    }
  }
};

const getUserRole = async() => {
  try {
    const { data, error } = await supabase
      .from('user_role')
      .select('role_id')
      .eq('user_id', "d08051a4-b9b0-4cc6-aa6b-be254c267e3f" )//userData.user.id)
      .single();
    if (error) {
      throw error;
    } 
    return data?.role_id;
  } catch (error) {
    console.error('Unexpected error fetching user role:', error);
    return null;
  }
};

// const getUserRole = async (): Promise<number | null> => {
//   try {
//     // Get the current user
//     // const { data: userData, error: userError } = await authService.getCurrentUser();
//     // if (userError || !userData?.user?.id) {
//     //   console.error('Error getting current user:', userError);
//     //   return null;
//     // }

//     // Query the user_role table for that user's role
//     const { data, error } = await supabase
//       .from('user_role')
//       .select('role_id')
//       .eq('user_id', "d08051a4-b9b0-4cc6-aa6b-be254c267e3f" )//userData.user.id)
//       .single();

//     if (error) {
//       console.error('Error fetching user role:', error);
//       return null;
//     }

//     return data?.role_id ?? null;
//   } catch (error) {
//     console.error('Unexpected error fetching user role:', error);
//     return null;
//   }
// };


const BorrowPage = () => {
    {console.log("session: ", authService.getSession())}
    {console.log("session.user: ", authService.getCurrentUser())}
    // TODO: remove sign out before merge to main, after merge with newest auth changes
    // handleSignOut();

    useEffect(() => {
      // Fetch user role on component mount
      
    }, []);

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


            {/* TODO: Add actual admin verification here - right now only handles manual IDs */}
            {/* Also, make sure this is the actual secure way to hide admin controls. For now it works */}
            { authService.getSession() != null && /*userstate?.role === "admin" &&*/
            // ( userRole?.find(role => role.role_id === 2) !== undefined )
            ( 1 === 1)
            ? (
              
              <DynamicButton buttons={[
                {
                  type: 1, // internal
                  shape: 0, // full
                  buttonConfig: {
                    text: "Manage Inventory",
                    icon: "wrench",
                    internalLink: `../borrow/admin-borrow`,
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