import PostitImage from "@/assets/images/post_it.png";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
} from "react-native";

import { Text, View } from "@/components/Themed";
import { db } from "@/firebaseconfig";
import { Post } from "@/types/post";
import { router } from "expo-router";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function TabOneScreen() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Set up real-time listener for posts
        const postsQuery = query(
            collection(db, "posts"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(
            postsQuery,
            (snapshot) => {
                const postsData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Post[];

                setPosts(postsData);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching posts:", error);
                setError("Failed to load posts");
                setLoading(false);
            }
        );

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, []);

    const handleCreatePost = () => {
        router.push("/create");
    };

    const renderEmptyState = () => (
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

    const renderPost = ({ item }: { item: Post }) => (
        <TouchableOpacity style={styles.postCard}>
            <View style={styles.postHeader}>
                <Text style={styles.authorName}>
                    {item.displayName || "Anonymous"}
                </Text>
                <Text style={styles.timestamp}>
                    {item.createdAt?.toDate?.()?.toLocaleDateString() ||
                        "Just now"}
                </Text>
            </View>
            <Text style={styles.postContent}>{item.content}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#2f95dc" />
                <Text style={styles.loadingText}>Loading posts...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => setLoading(true)}
                >
                    <Text style={styles.buttonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item) => item.id}
                contentContainerStyle={
                    posts.length === 0 ? styles.emptyList : styles.listContent
                }
                ListEmptyComponent={renderEmptyState}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        paddingTop: 25,
    },
    centerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
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
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#726f6f",
    },
    errorText: {
        fontSize: 16,
        color: "#ff3b30",
        marginBottom: 20,
        textAlign: "center",
    },
    createButton: {
        backgroundColor: "#2f95dc",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    retryButton: {
        backgroundColor: "#2f95dc",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
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
