import { StyleSheet } from "react-native";

import PostComponent from "@/components/PostComponent";
// import { Text, View } from "@/components/Themed";
import EmptyPostState from "@/components/ui/EmptyPostState";
import ErrorComponent from "@/components/ui/ErrorComponent";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/context/authcontext";
import { db } from "@/firebaseconfig";
import { Post } from "@/types/post";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

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
            <View style={styles.userInfo}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {user?.displayName[0]}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            fontSize: 30,
                            fontWeight: 300,
                            color: "#2f95dc",
                        }}
                    >
                        {userPosts.length}
                    </Text>
                    <Text
                        style={{
                            fontSize: 30,
                            fontWeight: 300,
                            color: "#2f95dc",
                        }}
                    >
                        Posts
                    </Text>
                </View>
                <View>
                    <MaterialIcons
                        onPress={() => logOut()}
                        name="logout"
                        size={24}
                        color="#2f95dc"
                    />
                </View>
            </View>

            <Text style={styles.displayName}>@{user?.displayName}</Text>
            <Text style={styles.email}>{user?.email}</Text>
            <View style={styles.postContainer}>
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
        </View>
    );
}

const styles = StyleSheet.create({
    userInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomColor: "#ccc",
        borderBottomWidth: 2,
        paddingHorizontal: 15,
    },
    postContainer: {
        flex: 1,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 80,
        backgroundColor: "#2f95dc",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    avatarText: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold",
    },

    displayName: {
        marginTop: 15,
        marginLeft: 15,
        fontSize: 16,
    },
    email: {
        marginLeft: 15,

        fontSize: 16,
    },
    container: {
        flex: 1,
        paddingTop: 40,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
    },

    centerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    emptyList: {
        flex: 1,
    },
    listContent: {
        // padding: 16,
    },
});
