import { StyleSheet } from "react-native";

import PostComponent from "@/components/PostComponent";
import { View } from "@/components/Themed";
import EmptyPostState from "@/components/ui/EmptyPostState";
import ErrorComponent from "@/components/ui/ErrorComponent";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/context/authcontext";
import { db } from "@/firebaseconfig";
import { Post } from "@/types/post";
import { useRouter } from "expo-router";
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList } from "react-native";

export default function Profile() {
    const { logOut, user } = useAuth();
    const [userPosts, setUserPosts] = useState<Post[] | []>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [retryCount, setRetryCount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        // Set up real-time listener for posts
        const postsRef = collection(db, "posts");
        const userPostsQuery = query(
            postsRef,
            where("userId", "==", user?.uid),
            orderBy("createdAt", "desc") // Most recent first
        );

        const unsubscribe = onSnapshot(
            userPostsQuery,
            (snapshot: { docs: any[] }) => {
                const postsData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Post[];

                setUserPosts(postsData);
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

    const handleRety = () => {
        setRetryCount((prev) => prev + 1);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorComponent retryFunc={handleRety} error={error} />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={userPosts}
                renderItem={PostComponent}
                keyExtractor={(item) => item.id}
                contentContainerStyle={
                    userPosts.length === 0
                        ? styles.emptyList
                        : styles.listContent
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

    centerContainer: {
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
});

