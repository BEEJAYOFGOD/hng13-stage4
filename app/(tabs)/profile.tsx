import { StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { useAuth } from "@/context/authcontext";

export default function Profile() {
    const { logOut } = useAuth();
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile Page</Text>

            <Text onPress={() => logOut()}>LogOut</Text>
            <View
                style={styles.separator}
                lightColor="#eee"
                darkColor="rgba(255,255,255,0.1)"
            />
            {/* <EditScreenInfo path="app/(tabs)/two.tsx" /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: "80%",
    },
});
