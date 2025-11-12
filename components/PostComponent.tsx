import { Post } from "@/types/post";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PostComponent = ({ item }: { item: Post }) => (
    <TouchableOpacity style={styles.postCard}>
        <View style={styles.postHeader}>
            <View style={styles.authorInfo}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {item.displayName?.[0]?.toUpperCase() || "A"}
                    </Text>
                </View>
                <View>
                    <Text style={styles.authorName}>
                        {item.displayName || "Anonymous"}
                    </Text>
                    <Text style={styles.timestamp}>
                        {item.createdAt?.toDate?.()
                            ? `${item.createdAt
                                  .toDate()
                                  .toLocaleDateString()} at ${item.createdAt
                                  .toDate()
                                  .toLocaleTimeString()}`
                            : "Just now"}
                    </Text>
                </View>
            </View>
        </View>

        {item.content && <Text style={styles.postContent}>{item.content}</Text>}

        {item.imageUrl && (
            <Image
                source={{ uri: item.imageUrl }}
                style={styles.postImage}
                resizeMode="cover"
            />
        )}
    </TouchableOpacity>
);

export default PostComponent;

const styles = StyleSheet.create({
    postCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    postHeader: {
        marginBottom: 12,
    },
    authorInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#007AFF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    avatarText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    authorName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1a1a1a",
        marginBottom: 2,
    },
    timestamp: {
        fontSize: 12,
        color: "#666",
    },
    postContent: {
        fontSize: 15,
        lineHeight: 22,
        color: "#333",
        marginBottom: 12,
    },
    postImage: {
        width: "100%",
        height: 300,
        borderRadius: 8,
        backgroundColor: "#f0f0f0",
    },
});
