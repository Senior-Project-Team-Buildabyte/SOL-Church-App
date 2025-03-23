import { Link } from "expo-router";
import { Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function Index() {
  const handlePress = () => {
    console.log('Image clicked!');
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header Bar */}
      <View
        style={{
          height: 60,
          backgroundColor: 'white',
          flexDirection: 'row',
          justifyContent: 'space-between', 
          alignItems: 'center',
          paddingHorizontal: 10,
        }}
      >
        {/* Left Side: SOL Church Logo */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={require('../assets/images/react-logo.png')} // Replace with actual church logo
            style={{
              width: 30,
              height: 30,
              marginRight: 5,
            }}
          />
          <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>
            SOL Church
          </Text>
        </View>

        {/* Right Side: Search and Login Buttons */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={handlePress}>
            <Image
              source={require('../assets/images/search-button.png')}
              style={{
                width: 30,
                height: 30,
                marginRight: 10, 
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePress}>
            <Image
              source={require('../assets/images/login-button.png')} 
              style={{
                width: 30,
                height: 30,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View 
        style={styles.container}>
        <Link href={"./text-page"} style={styles.button}>
          Text Page
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#25292e",
  },
  text: {
    color: "white",
  },
  button: {
    fontSize: 20,
    textDecorationLine:"underline",
    color: "#fff",
  },
});
