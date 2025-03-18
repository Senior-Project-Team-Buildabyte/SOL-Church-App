import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Linking, Alert } from "react-native";

const HomeResources = () => {
  const handleExternalLink = ({ link }) => {
    Linking.openURL(link).catch(err => {
      Alert.alert('Error', 'Could not open link.');
      console.error('An error occurred', err);
    });
  };

  const handleInternalLink = ({ link }) => {
    Linking.openURL(link).catch(err => {
      Alert.alert('Error', 'Could not open link.');
      console.error('An error occurred', err);
    });
  };

    
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.sectionTitle}>Resources</Text>

      <View style={styles.container}>
        {[...Array(6)].map((_, index) => (
          <TouchableOpacity key={index} style={styles.resourceButton}>
            <Text style={styles.resourceText}>Resource {index + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    paddingHorizontal: 16, // Add padding to align with other sections
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center", // Centers the buttons horizontally
    alignItems: "center", // Centers the buttons vertically
    gap: 20, // Adds equal spacing between buttons and around edges
  },
  resourceButton: {
    width: "40%", // 45% of the container width
    aspectRatio: 1, // Ensures the buttons remain square
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
  },
  resourceText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HomeResources;


// import React from "react";
// import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";

// const HomeResources = () => {
//   // Dummy data for resources
//   // const resources = [...Array(6)].map((_, index) => ({
//   //   id: index.toString(),
//   //   title: `Resource ${index + 1}`,
    
//   // }));

//   // const renderResourceButton = ({ item }) => (
//   //   <TouchableOpacity style={styles.resourceButton}>
//   //     <Text style={styles.resourceText}>{item.title}</Text>
//   //   </TouchableOpacity>
//   // );

//   return (
//     <View>
//       <Text style={styles.sectionTitle}>Resources</Text>

//       <View style={styles.container}>
//         {[...Array(3)].map((_, index) => (
//           <View key={index} style={styles.container}>
//             <TouchableOpacity style={styles.resourceButton}>
//               <Text style={styles.resourceText}>Resource {1+(index*2)}</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.resourceButton}>
//               <Text style={styles.resourceText}>Resource {2+(index*2)}</Text>
//               </TouchableOpacity>
//             {/* <View style={styles.separator} /> */}
//           </View>
//         ))}



        
//         {/* {
//         <FlatList
//           data={resources}
//           renderItem={renderResourceButton}
//           keyExtractor={(item) => item.id}
//           numColumns={2}
//           contentContainerStyle={styles.resourceGrid}
//           scrollEnabled={false} // Disable scrolling for FlatList since it's inside a ScrollView
//         /> 
//         } */}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     width: "100%",
//     // marginTop: 10,
//     // paddingHorizontal: 20, // Add padding to align with other sections
//     // paddingBottom: 20,
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "center",
//   },
//   sectionTitle: {
//     fontSize: 30,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   resourceGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     // width: "100%",
//     // justifyContent: "center",
//   },
//   resourceButton: {
//     width: "30%", // Slightly less than half to account for margin
//     aspectRatio: 1, // Make the button square
//     justifyContent: "center",
//     alignItems: "center",    
//     backgroundColor: "#e0e0e0",
//     borderRadius: 10,
//     margin: 20,
//     // marginBottom: 10,
//     // margin: 10,
//   },
//   resourceText: {
//     color: "black",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   separator: {
//     height: 2,
//     backgroundColor: "rgba(0, 0, 0, 0.4)",
//     width: "90%",
//     marginVertical: 10,
//   },

// });

// export default HomeResources;






// import React from 'react';
// import { Dimensions, StyleSheet, Text, SafeAreaView, ScrollView,
//   View, TouchableOpacity
//  } from 'react-native';

// // Gap stuff
// const { width } = Dimensions.get('window');
// const gap = 10;
// const itemPerRow = 2;
// const totalGapSize = (itemPerRow - 1) * gap;
// const windowWidth = width;
// const childWidth = (windowWidth - totalGapSize) / itemPerRow;

// const HomeResources = () => {
//   const items = [
//     {
//       id: 1,
//       title: 'Item 1',
//       backgroundColor: 'red',
//     },
//     {
//       id: 2,
//       title: 'Item 2',
//       backgroundColor: 'green',
//     },
//     {
//       id: 3,
//       title: 'Item 3',
//       backgroundColor: 'blue',
//     },
//     {
//       id: 4,
//       title: 'Item 4',
//       backgroundColor: 'yellow',
//     },
//     {
//       id: 5,
//       title: 'Item 5',
//       backgroundColor: 'orange',
//     },
//   ];

//   return (
//     <SafeAreaView>
//       <TouchableOpacity style={styles.itemsWrap}>
//         <View style={styles.itemsWrap}>
//           {items.map((item) => (
//             <Text
//               key={item.id}
//               style={{
//                 backgroundColor: item.backgroundColor,
//                 ...styles.singleItem,
//               }}
//             >
//               {item.title}
//             </Text>
//           ))}
//         </View>
//       </TouchableOpacity>
    
//     </SafeAreaView>
//   );
// };


// const styles = StyleSheet.create({
//   itemsWrap: {
//     display: 'flex',
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginVertical: -(gap / 2),
//     marginHorizontal: -(gap / 2),
//   },
//   singleItem: {
//     marginHorizontal: gap / 2,
//     minWidth: childWidth,
//     maxWidth: childWidth,
//   },
//   resourceButton: {
//     // width: "45%", // Slightly less than half to account for margin
//     aspectRatio: 1, // Make the button square
//     justifyContent: "center",
//     alignItems: "center",    
//     // backgroundColor: "#e0e0e0",
//     borderRadius: 10,
//     // marginBottom: 10,
//     margin: 10,
//   },
// });


// export default HomeResources;