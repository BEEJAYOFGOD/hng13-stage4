import { StyleSheet, TouchableOpacity } from "react-native";

import PostComponent from "@/components/PostComponent";
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
        const postsRef = collection(db, "posts");
        const userPostsQuery = query(
            postsRef,
            where("userId", "==", user?.uid),
            orderBy("createdAt", "desc")
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
        return <ErrorComponent retryFunc={handleRetry} error={error} />;
    }

    const getInitials = (name: string) => {
        return (
            name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) || "U"
        );
    };

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                {/* Avatar and Stats Row */}
                <View style={styles.topRow}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {getInitials(user?.displayName || "User")}
                        </Text>
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>
                                {userPosts.length}
                            </Text>
                            <Text style={styles.statLabel}>Posts</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text
                                style={[styles.statNumber, { color: "grey" }]}
                            >
                                0
                            </Text>
                            <Text style={styles.statLabel}>Followers</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text
                                style={[styles.statNumber, { color: "grey" }]}
                            >
                                0
                            </Text>
                            <Text style={styles.statLabel}>Following</Text>
                        </View>
                    </View>
                </View>

                {/* User Info */}
                <View style={styles.userInfoSection}>
                    <Text style={styles.displayName}>{user?.displayName}</Text>
                    <Text style={styles.email}>{user?.email}</Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={handleCreatePost}
                    >
                        <MaterialIcons name="add" size={20} color="#2f95dc" />
                        <Text style={styles.editButtonText}>Create Post</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={() => logOut()}
                    >
                        <MaterialIcons
                            name="logout"
                            size={20}
                            color="#FF3B30"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.userInfoSection}>
                    <Text style={{ fontSize: 12, marginTop: 12 }}>
                        subscribe to premium to see followers and following
                    </Text>
                </View>
            </View>

            {/* Posts Grid/List */}
            <View style={styles.postsSection}>
                <Text style={styles.sectionTitle}>My Posts</Text>

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
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    topRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#2f95dc",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 20,
    },
    avatarText: {
        color: "white",
        fontSize: 32,
        fontWeight: "bold",
    },
    statsContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
    },
    statItem: {
        alignItems: "center",
    },
    statNumber: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
    },
    statLabel: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },
    userInfoSection: {
        // marginBottom: 16,
    },
    displayName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: "#666",
    },
    actionButtons: {
        flexDirection: "row",
        gap: 12,
    },
    editButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f8ff",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#2f95dc",
        gap: 6,
    },
    editButtonText: {
        color: "#2f95dc",
        fontSize: 15,
        fontWeight: "600",
    },
    logoutButton: {
        width: 48,
        height: 48,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff5f5",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#FF3B30",
    },
    postsSection: {
        flex: 1,
        backgroundColor: "#fafafa",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: "#fff",
    },
    emptyList: {
        flex: 1,
    },
    listContent: {
        marginTop: 10,
        paddingBottom: 20,
    },
});
