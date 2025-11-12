import PostComponent from "@/components/PostComponent";
import { View } from "@/components/Themed";
import EmptyPostState from "@/components/ui/EmptyPostState";
import ErrorComponent from "@/components/ui/ErrorComponent";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { db } from "@/firebaseconfig";
import { Post } from "@/types/post";
import { router } from "expo-router";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";

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
                    posts.length === 0 ? styles.emptyList : null
                }
                ListEmptyComponent={
                    <EmptyPostState handleCreatePost={handleCreatePost} />
                }
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        paddingTop: 45,
    },
    emptyList: {
        flexGrow: 1,
    },
});
