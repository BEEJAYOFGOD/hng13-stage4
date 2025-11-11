import { Text, View } from "@/components/Themed";
import { useAuth } from "@/context/authcontext";
import postService from "@/services/postService";
import { router } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";

export default function Create() {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const maxLength = 500;
    const { user } = useAuth();

    const handleCreatePost = async () => {
        if (!content.trim()) {
            Alert.alert("Empty Post", "Please write something before posting!");
            return;
        }

        if (!user) {
            Alert.alert("Not Logged In", "Please log in to create a post");
            return;
        }

        try {
            setLoading(true);

            await postService.createPost(
                user.uid, // userId
                user.displayName, // userName
                content.trim(),
                undefined // imageUri (optional)
            );

            Alert.alert("Success", "Post created successfully!", [
                {
                    text: "OK",
                    onPress: () => {
                        setContent("");
                        router.back();
                    },
                },
            ]);
        } catch (error) {
            console.error("Error creating post:", error);
            Alert.alert("Error", "Failed to create post. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (content.trim()) {
            Alert.alert(
                "Discard Post?",
                "Are you sure you want to discard this post?",
                [
                    { text: "Keep Writing", style: "cancel" },
                    {
                        text: "Discard",
                        style: "destructive",
                        onPress: () => router.back(),
                    },
                ]
            );
        } else {
            router.back();
        }
    };

    const remainingChars = maxLength - content.length;
    const isOverLimit = remainingChars < 0;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Create Post</Text>
                    <Text style={styles.subtitle}>
                        Share what's on your mind
                    </Text>
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="What's happening?"
                        placeholderTextColor="#999"
                        multiline
                        numberOfLines={8}
                        maxLength={maxLength}
                        value={content}
                        onChangeText={setContent}
                        textAlignVertical="top"
                        autoFocus
                    />
                    <View style={styles.charCounter}>
                        <Text
                            style={[
                                styles.charCountText,
                                isOverLimit && styles.charCountError,
                            ]}
                        >
                            {remainingChars} characters remaining
                        </Text>
                    </View>
                </View>

                <View style={styles.tips}>
                    <Text style={styles.tipsTitle}>💡 Tips:</Text>
                    <Text style={styles.tipsText}>
                        • Be respectful and kind
                    </Text>
                    <Text style={styles.tipsText}>
                        • Share interesting thoughts or experiences
                    </Text>
                    <Text style={styles.tipsText}>
                        • Keep it under {maxLength} characters
                    </Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={handleCancel}
                        disabled={loading}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.button,
                            styles.postButton,
                            (!content.trim() || loading || isOverLimit) &&
                                styles.disabledButton,
                        ]}
                        onPress={handleCreatePost}
                        disabled={!content.trim() || loading || isOverLimit}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.postButtonText}>Post</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        paddingTop: 20,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        marginBottom: 24,
        backgroundColor: "transparent",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
    },
    inputContainer: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    input: {
        fontSize: 16,
        color: "#333",
        minHeight: 150,
        maxHeight: 300,
        lineHeight: 24,
    },
    charCounter: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
        backgroundColor: "transparent",
    },
    charCountText: {
        fontSize: 14,
        color: "#666",
        textAlign: "right",
    },
    charCountError: {
        color: "#ff3b30",
        fontWeight: "600",
    },
    tips: {
        backgroundColor: "#e8f4fd",
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    tipsTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8,
    },
    tipsText: {
        fontSize: 14,
        color: "#666",
        marginBottom: 4,
        lineHeight: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 12,
        marginTop: 8,
        backgroundColor: "transparent",
    },
    button: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    cancelButton: {
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#ddd",
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#666",
    },
    postButton: {
        backgroundColor: "#2f95dc",
    },
    postButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
    },
    disabledButton: {
        backgroundColor: "#ccc",
        opacity: 0.6,
    },
});
