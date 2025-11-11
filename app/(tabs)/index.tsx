import PostitImage from "@/assets/images/post_it.png";
import { FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";

import PostComponent from "@/components/PostComponent";
import { Text, View } from "@/components/Themed";
import ErrorComponent from "@/components/ui/ErrorComponent";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { db } from "@/firebaseconfig";
import { Post } from "@/types/post";
import { router } from "expo-router";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function TabOneScreen() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

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
    }, [retryCount]);

    const handleCreatePost = () => {
        router.push("/create");
    };

    const handleRetry = () => {
        setRetryCount((prev) => prev + 1);
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

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorComponent error={error} retryFunc={handleRetry} />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                renderItem={PostComponent}
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
});
