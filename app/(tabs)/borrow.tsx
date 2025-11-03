import DynamicButton from "@/components/universal/dynamic-button";
import { supabase } from "@/lib/supabase";
import { authService } from "@/services/auth.service";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { ActivityIndicator, ImageBackground, StyleSheet, Text, View } from "react-native";
import { useAuthContext } from '@/context/authContext';


const getUserRole = async() => {
  const { data, error } = await supabase
    .from('user_role')
    .select('*').eq('user_id', (await authService.getCurrentUser()).data.user?.id || '')
  if (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
  return data?.[0]?.role_id || null;
}

const BorrowPage = () => {
  const { session, userstate, loading, role } = useAuthContext();

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
      </View>

    </ImageBackground>

        {/* Return Items */}
        <DynamicButton
          buttons={[
            {
              type: 1, // internal
              shape: 0, // full
              buttonConfig: {
                text: "Return Items",
                icon: "undo",
                internalLink: `../borrow/returnItems`,
                backgroundGradient: ["0", "rgba(149, 185, 247, 1)", "rgba(60,129,246,1)"],
              },
            },
          ]}
        />

        {/* Admin controls */}
        {checkingRole ? (
          <ActivityIndicator style={{ marginTop: 12 }} />
        ) : isAdmin ? (
          <>
            {/* Manage Items (Admin) */}
            <DynamicButton
              buttons={[
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


        {/* TODO: Verify this is the actual secure way to hide admin controls */}
        { ( role === 2 ) ? (
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
