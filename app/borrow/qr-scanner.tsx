import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { Camera } from 'expo-camera';
import DynamicButton from '@/components/universal/dynamic-button';

export default function ScannerPage() {
  // Hook inside component
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Ask for camera permission
  useEffect(() => {
    (async () => {
        //const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
    })();
  }, []);

  /*
  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
    */

  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>
        Scan the QR code to checkout/return items
      </Text>
      {/* Camera box */}
      <View style={styles.cameraWrapper}>
        <View style={styles.cameraBox}>
            <Text style={styles.headingText}>Camera view goes here</Text>
        </View>
      </View>

      <View style={styles.buttons}>

        <DynamicButton buttons={[
            {
                        type: 1, // internal
                        shape: 0, // full
                        buttonConfig: {
                            text: "Confirm Items",
                            icon: "check",
                            internalLink: `../borrow/confirm-borrow`,
                            backgroundGradient: ["0", "rgba(60,129,246,1)", "rgba(149, 185, 247, 1)"]
                        }
                    },
            ]}/>
        </View> 
    </View>
  );
}

const { width } = Dimensions.get('window');
const BOX_SIZE = width * 0.8;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        paddingTop: 60,
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
        fontSize: 28,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 30,
    },
    buttons: {
        justifyContent: 'space-evenly',
        maxHeight: 500,
        width: '90%',
        alignSelf: 'center'
    },
    cameraBox: {
        width: BOX_SIZE,
        height: BOX_SIZE,
        borderWidth: 3,
        borderColor: 'blue',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000010', // slightly transparent placeholder
    },
    cameraWrapper: {
        width: '100%',
        marginBottom: 30,
        alignItems: 'center',
    }
});