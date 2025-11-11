import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ErrorComponent = ({
    error,
    retryFunc,
}: {
    error: string;
    retryFunc: () => void;
}) => {
    return (
        <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
                style={styles.retryButton}
                onPress={() => retryFunc}
            >
                <Text style={styles.buttonText}>Retry</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ErrorComponent;

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    retryButton: {
        backgroundColor: "#2f95dc",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    errorText: {
        fontSize: 16,
        color: "#ff3b30",
        marginBottom: 20,
        textAlign: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
