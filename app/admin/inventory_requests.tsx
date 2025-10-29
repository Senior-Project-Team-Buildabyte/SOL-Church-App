import { Stack } from 'expo-router';
import { ImageBackground, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DynamicButton from '@/components/universal/dynamic-button';

export default function InventoryRequests() {
  return (
    <View style={styles.container}>
      
      <ImageBackground
        source={require('@/assets/images/bg-mission.jpg')}
        style={styles.frontimage}
        resizeMode="cover">

        <View style={styles.headingWrapper}>
          <LinearGradient
            style={styles.pageHeading}
            colors={["rgba(149, 185, 247, 1)", "rgba(60,129,246,1)"]}
            {...{
              start: { x: 0, y: 0.5 },
              end: { x: 1, y: 0.5 },    
            }}
          >
            <ImageBackground
              source={require('@/assets/images/favicon-drop.png')}
              style={[{height: '100%'}, {aspectRatio: 1}]}
              resizeMode="cover">
            </ImageBackground>
            <Text style={styles.headingText}>Inventory Requests</Text>
          </LinearGradient>
        </View>
      </ImageBackground>

      <View style={styles.content}>
        <Text style={styles.instructionText}>
          Please confirm the following items being borrowed/returned
        </Text>
        
        <View style={styles.commentContainer}>
          <Text style={styles.commentLabel}>Add a comment (optional):</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Enter any feedback or additional information for the user..."
            multiline
            numberOfLines={4}
          />
        </View>
        
        <View style={styles.buttonsContainer}>
          <DynamicButton buttons={[
            {
              type: 1, // ButtonType.InternalEventPage
              shape: 0, // ButtonShape.FullWidth
              buttonConfig: {
                text: "Approve",
                icon: "check",
                backgroundGradient: ["0", "#4CAF50", "#43A047"],
                // Using internalLink as a placeholder - in a real app, you'd want to handle this differently
                // since these are action buttons, not navigation buttons
                internalLink: "../admin/inventory_requests"
              }
            },
            {
              type: 1, // ButtonType.InternalEventPage
              shape: 0, // ButtonShape.FullWidth
              buttonConfig: {
                text: "Deny",
                icon: "close",
                backgroundGradient: ["0", "#F44336", "#E53935"],
                // Using internalLink as a placeholder - in a real app, you'd want to handle this differently
                // since these are action buttons, not navigation buttons
                internalLink: "../admin/inventory_requests"
              }
            }
          ]} />
        </View>
      </View>
    </View>
  );
}

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
    fontSize: 24,
    textAlign: 'center',
    flexGrow: 1,
    fontWeight: 'bold',
    textShadowColor: '#333',
    textShadowRadius: 10,
    textShadowOffset: {width: 1, height: 2},
  },
  content: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
    padding: 20,
  },
  instructionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  commentContainer: {
    marginBottom: 20,
  },
  commentLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  commentInput: {
    width: '100%',
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  buttonsContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});
