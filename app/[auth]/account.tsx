import { Text, View, StyleSheet, Pressable, SectionList, ImageBackground } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

type SettingItem = {
    id: string;
    label: string;
    desc: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    onPress: () => void;
};

type SettingSection = {
    title: string;
    data: SettingItem[];
};

const handleLoginPress = () => {
    // login popup
}

const sections: SettingSection[] = [
    {
        title: "This device",
        data: [
            { id: "1", label: "Inbox", desc: "Access your notifications",
                icon: "notifications", onPress: () => {} },
            { id: "2", label: "Notes", desc: "Access your notes",
                icon: "notes", onPress: () => {} },
            { id: "3", label: "Downloads", desc: "Access your downloads",
                icon: "download", onPress: () => {} },
        ],
    },
    {
        title: "App settings",
        data: [
            { id: "4", label: "Notifications", desc: "Manage notification preferences",
                icon: "edit-notifications", onPress: () => {} },
            { id: "5", label: "Terms of use", desc: "Read our terms of use",
                icon: "library-books", onPress: () => {} },
            { id: "6", label: "Privacy policy", desc: "Read our privacy policy",
                icon: "lock", onPress: () => {} },
            { id: "7", label: "Copyrights", desc: "Copyright information",
                icon: "copyright", onPress: () => {} },
            { id: "8", label: "About", desc: "App version",
                icon: "info-outline", onPress: () => {} },
        ],
    },
    {
        title: "More",
        data: [
            { id: "9", label: "Share SOL Church app", desc: "Get a link to share the app",
                icon: "share", onPress: () => {} },
            { id: "10", label: "Feedback", desc: "Provide feedback on the app",
                icon: "comment", onPress: () => {} },
            { id: "11", label: "Help", desc: "Get technical support",
                icon: "help", onPress: () => {} },
        ],
    },
];

const SettingRow = ({ label, desc, icon, onPress }: SettingItem) => (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
        <MaterialIcons name={icon} size={24} color="#444" style={styles.icon} />
        <View style={styles.arrowGap}>
            <View style={styles.textWrapper}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.description}>{desc}</Text>
            </View>
            <FontAwesome name={"caret-right"} size={20} color="#888"
                style={[{paddingRight: 10}]}
            />
        </View>

    </Pressable>
);

export default function SettingsScreen() {
    return (

        <SectionList
            style={styles.wrapper}
            sections={sections}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <SettingRow {...item} />}
            renderSectionHeader={({ section }) => (
                <View style={styles.headerContainer}>
                    <Text style={styles.sectionHeader}>{section.title}</Text>
                </View>
            )}
            
            contentContainerStyle={styles.container}
            ListHeaderComponent={
                <View style={styles.loginsection}>
                    <ImageBackground
                        source={require('@/assets/images/favicon-drop.png')}
                        style={styles.headerimage}
                        />
                    <Text style={styles.headingText}>SOL Church</Text>
                    <Pressable 
                    onPress={handleLoginPress}
                    style={({ pressed }) => [
                    styles.loginButton,
                    pressed && {backgroundColor: 'rgba(30,30,30,0.25)'}
                    ]}
                    
                    >
                        <Text style={styles.loginBtnTxt}>Log in or sign up</Text>
                    </Pressable>

                </View>
            }  
        />        
    );
}


const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#fff',
        flex: 1,
    },
    loginsection: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
    },
    headerimage: {
        height: 75,
        width: 75,
        aspectRatio: 1,
    },
    headerContainer: { },
    sectionHeader: {
        color: "#555",
        // lineHeight: 24,
        fontSize: 24,
        marginTop: 36,
        marginLeft: 14,
        fontWeight: "bold",
    },
    container: {
        maxWidth: 650,
        width: '100%',
        alignSelf: 'center',
    },
    section: { },
    headingText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    loginButton: {
        height: 45,
        backgroundColor: 'rgba(30,30,30, 1)',
        width: '100%',
        maxWidth: 180,
        borderRadius: 150,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    loginBtnTxt: {
        fontSize: 18,
        color: '#fff',
    },
    arrowGap: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    row: {
        backgroundColor: '#fff',
        minHeight: 74,
        flexDirection: 'row',
        height: 74,
        flex: 0,
        marginLeft: 15,
        marginRight: 15,
        // marginBottom: 5,
        alignItems: 'center',
        gap: 20,
        borderBottomColor: '#ddd',
        borderBottomWidth: 2,
    },
    pressed: {
        backgroundColor: "rgba(0,0,0,0.04)",
    },
    icon: {
        paddingLeft: 10,
    },
    label: {
        fontSize: 18,
        color: "#555",
    },
    description: {
        fontSize: 14,
        color: "#aaa",
    },
    textWrapper: { }

});