import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Double } from "react-native/Libraries/Types/CodegenTypes";



// Helper to format file size into KB, MB, GB
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Helper to format date into something readable (e.g. Sep 15, 2025)
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Define a type for download items
type DownloadItem = {
  id: string;
  name: string;
  size: String; // in bytes
  dateDownloaded: string; // ISO string from DB
  image?: Double // optional preview image
};

// Example placeholder data (formatted)
const dummyDownloads: DownloadItem[] = [
  {
    id: "1",
    name: "File One.pdf",
    size: formatFileSize(12582912), // 12 MB
    dateDownloaded: formatDate("2025-09-10T14:23:00Z"),
    image: require("@/assets/images/favicon-drop.png"),
  },
  {
    id: "2",
    name: "File Two.docx",
    size: formatFileSize(870400), // ~850 KB
    dateDownloaded: formatDate("2025-09-05T09:15:00Z"),
    image: require("@/assets/images/favicon-drop.png"),
  },
  {
    id: "3",
    name: "File Three.png",
    size: formatFileSize(2411724), // 2.3 MB
    dateDownloaded: formatDate("2025-09-01T20:45:00Z"),
    image: require("@/assets/images/favicon-drop.png"),
  },
];


const Downloads = () => {
  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <FlatList
          data={dummyDownloads}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
              ]}
              onPress={() => {
                console.log(`Pressed: ${item.name}`);
                // TODO: hook up to file open/download action
              }}
            >
              {/* Preview Image */}
              <Image
                source={item.image }
                style={styles.image}
                resizeMode="center"
              />

              {/* Text block */}
              <View style={styles.textContainer}>
                <Text style={styles.label}>{item.name}</Text>
                <Text style={styles.subtitle}>
                  {item.size} • Downloaded {item.dateDownloaded}
                </Text>
              </View>

              {/* Caret Icon */}
              <FontAwesome name="angle-right" size={24} color="#666" />
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
  },
  container: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 600,
    backgroundColor: "#fff",
  },
  row: {
    height: 80,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowPressed: {
    backgroundColor: "#f2f2f2", // subtle pressed effect
  },
  image: {
    height: 50,
    width: 50,
    aspectRatio: 1, // keeps square shape
    borderRadius: 6,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginHorizontal: 16,
  },
});

export default Downloads;