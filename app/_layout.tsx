import { useAuth } from "@/context/authcontext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { AuthProvider } from "@/context/authcontext";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
        ...FontAwesome.font,
    });

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <AuthProvider>
            <RootLayoutNav />
        </AuthProvider>
    );
}

function RootLayoutNav() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (user) {
                router.replace("/(tabs)");
            } else {
                router.replace("/(auth)/login");
            }
        }
    }, [user, loading, router]);


    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }


    return (
        <Stack screenOptions={{ headerShown: false }}>
            {user ? (
                <>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen
                        name="modal"
                        options={{ presentation: "modal" }}
                    />
                </>
            ) : (
                <Stack.Screen name="(auth)" />
            )}
        </Stack>
    );
}
const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff", // or your app's background color
    },
});
