import PostitImage from "@/assets/images/post_it.png";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const EmptyPostState = ({
    handleCreatePost,
}: {
    handleCreatePost: () => void;
}) => {
    return (
        <View style={styles.emptyContainer}>
            <Image source={PostitImage} style={styles.image} />
            <Text style={styles.title}>
                It looks like everyone here is shy,
            </Text>
            <Text style={styles.small}>You better don't be</Text>
            <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreatePost}
            >
                <Text style={styles.buttonText}>Create First Post</Text>
            </TouchableOpacity>
        </View>
    );
};

export default EmptyPostState;

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    emptyList: {
        flexGrow: 1,
    },
    listContent: {
        padding: 16,
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 20,
        borderRadius: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#726f6f",
        marginBottom: 8,
        textAlign: "center",
    },
    small: {
        fontSize: 16,
        color: "#2f95dc",
        fontWeight: "700",
        marginBottom: 20,
    },

    createButton: {
        backgroundColor: "#2f95dc",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
