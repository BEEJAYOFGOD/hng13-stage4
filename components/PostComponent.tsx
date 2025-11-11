import { Post } from "@/types/post";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PostComponent = ({ item }: { item: Post }) => (
    <TouchableOpacity style={styles.postCard}>
        <View style={styles.postHeader}>
            <Text style={styles.authorName}>
                {item.displayName || "Anonymous"}
            </Text>
            <Text style={styles.timestamp}>
                {item.createdAt?.toDate?.()?.toLocaleDateString() || "Just now"}
            </Text>
        </View>
        <Text style={styles.postContent}>{item.content}</Text>
    </TouchableOpacity>
);

export default PostComponent;

const styles = StyleSheet.create({
    postCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    postHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    authorName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    timestamp: {
        fontSize: 12,
        color: "#999",
    },
    postContent: {
        fontSize: 15,
        color: "#333",
        lineHeight: 22,
    },
    postFooter: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
    },
    likes: {
        fontSize: 14,
        color: "#666",
    },
});
