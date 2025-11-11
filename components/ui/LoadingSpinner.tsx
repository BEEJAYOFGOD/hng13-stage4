import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const LoadingSpinner = () => {
    return (
        <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#2f95dc" />
            <Text style={styles.loadingText}>Loading posts...</Text>
        </View>
    );
};

export default LoadingSpinner;

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#726f6f",
    },
});
