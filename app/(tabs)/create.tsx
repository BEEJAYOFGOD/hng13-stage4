import { Text, View } from "@/components/Themed";
import { useAuth } from "@/context/authcontext";
import postService from "@/services/postService";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
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
    const [image, setImage] = useState<string | null>(null);

    const maxLength = 500;
    const { user } = useAuth();

    const pickImage = async () => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            Alert.alert(
                "Permission Required",
                "Please allow access to your photos to upload images."
            );
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        // request permission
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== "granted") {
            Alert.alert(
                "Permission Required",
                "Please allow camera access to take photos."
            );

            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const removeImage = () => {
        setImage(null);
    };

    const handleCreatePost = async () => {
        if (!content.trim()) {
            Alert.alert("Empty Post", "Please write something before posting!");
            return;
        }

        if (!user) {
            Alert.alert("Not Logged In", "Please log in to create a post");
            return;
        }
        if (content.length < 5) {
            Alert.alert("content is too short, make it at least 5 ");
            return;
        }

        if (content.length && !image) {
            Alert.alert(
                "you can only post a content and/or image not content alone"
            );

            return;
        }

        setLoading(true);

        const response = await postService.createPost(
            user.uid,
            user.displayName,
            content.trim() || undefined,
            image || undefined
        );

        if (response.success) {
            Alert.alert("Success", "Post created successfully!", [
                {
                    text: "OK",
                    onPress: () => {
                        setContent("");
                        setImage(null);
                        router.back();
                    },
                },
            ]);
            return;
        }

        console.error("Error creating post:", response.error);
        Alert.alert("Error", "Failed to create post. Please try again.");
        setLoading(false);
    };

    const handleCancel = () => {
        if (content.trim() || image) {
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
                showsVerticalScrollIndicator={false}
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

                {/* Image Preview */}
                {image && (
                    <View style={styles.imagePreviewContainer}>
                        <Image
                            source={{ uri: image }}
                            style={styles.imagePreview}
                            resizeMode="cover"
                        />
                        <TouchableOpacity
                            style={styles.removeImageButton}
                            onPress={removeImage}
                        >
                            <MaterialIcons
                                name="close"
                                size={20}
                                color="white"
                            />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Image Picker Buttons */}
                <View style={styles.imagePickerContainer}>
                    <TouchableOpacity
                        style={styles.imagePickerButton}
                        onPress={pickImage}
                        disabled={loading}
                    >
                        <MaterialIcons
                            name="photo-library"
                            size={24}
                            color="#2f95dc"
                        />
                        <Text style={styles.imagePickerText}>Gallery</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.imagePickerButton}
                        onPress={takePhoto}
                        disabled={loading}
                    >
                        <MaterialIcons
                            name="camera-alt"
                            size={24}
                            color="#2f95dc"
                        />
                        <Text style={styles.imagePickerText}>Camera</Text>
                    </TouchableOpacity>
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
                            ((content.trim().length < 5 && !image) ||
                                loading ||
                                isOverLimit) &&
                                styles.disabledButton,
                        ]}
                        onPress={handleCreatePost}
                        disabled={
                            (content.trim().length < 5 && !image) ||
                            loading ||
                            isOverLimit
                        }
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
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingTop: 60,
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
    imagePreviewContainer: {
        position: "relative",
        marginBottom: 20,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    imagePreview: {
        width: "100%",
        height: 200,
        backgroundColor: "#f0f0f0",
    },
    removeImageButton: {
        position: "absolute",
        top: 12,
        right: 12,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        borderRadius: 20,
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
    },
    imagePickerContainer: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 20,
    },
    imagePickerButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: "#2f95dc",
        gap: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    imagePickerText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#2f95dc",
    },
    tips: {
        backgroundColor: "#e8f4fd",
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderRightWidth: 4,
        borderRightColor: "#2f95dc",
        borderBottomWidth: 4,
        borderBottomColor: "#2f95dc",
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
        marginBottom: 20,
        backgroundColor: "transparent",
    },
    button: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
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
