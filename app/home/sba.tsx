import React from 'react';
import { StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const SBA_URL = 'https://www.solsacramento.com/sba?embedded=true';

const SBAScreen = () => {
  return (
    // SafeAreaView ensures content doesn't overlap with notches/status bar on mobile
    <SafeAreaView style={styles.container}>
      <WebView
        // The core prop: specify the URI you want to load
        source={{ uri: SBA_URL }}
        
        // Optional: Show an activity indicator while the page is loading
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator 
            color="#0000ff" 
            size="large" 
            style={styles.loadingIndicator}
          />
        )}
        
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsBackForwardNavigationGestures={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // Flex: 1 is crucial for the WebView to take up the full screen
    flex: 1, 
    backgroundColor: '#fff',
  },
  loadingIndicator: {
    // Position the indicator over the WebView area
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SBAScreen;