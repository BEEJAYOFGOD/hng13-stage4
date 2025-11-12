import { db } from "@/firebaseconfig";
import { Post, UserProfile } from "@/types/post";
import {
    addDoc,
    collection,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    where,
} from "firebase/firestore";
import cloudinaryService from "./cloudinaryService";

const postService = {
    // Create user profile after signup
    async createUserProfile(
        userId: string,
        email: string,
        displayName: string
    ) {
        try {
            const userRef = doc(db, "users", userId);
            await setDoc(userRef, {
                uid: userId,
                email,
                displayName,
                bio: "",
                createdAt: serverTimestamp(),
            });

            return { success: true };
        } catch (error: any) {
            console.error("Error creating user profile:", error);
            return { success: false, error: error.message };
        }
    },

    // Create a new post with Cloudinary image
    async createPost(
        userId: string,
        displayName: string,
        content: string | null,
        imageUri: string | null
    ) {
        try {
            let imageUrl = null;

            // Upload image to Cloudinary if provided
            if (imageUri) {
                const uploadResult = await cloudinaryService.uploadImage(
                    imageUri
                );

                if (!uploadResult.success) {
                    return {
                        success: false,
                        error: uploadResult.error || "Image upload failed",
                    };
                }

                imageUrl = uploadResult.url;
            }

            // Create post document in Firestore
            const postsRef = collection(db, "posts");

            console.log(displayName, "display");

            const newPost = await addDoc(postsRef, {
                userId,
                displayName,
                content,
                imageUrl,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            return { success: true, postId: newPost.id };
        } catch (error: any) {
            console.error("Error creating post:", error);
            return { success: false, error: error.message };
        }
    },

    // Get all posts (feed)
    async getAllPosts() {
        try {
            const postsRef = collection(db, "posts");
            const q = query(postsRef, orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);

            const posts: Post[] = [];
            querySnapshot.forEach((doc) => {
                posts.push({ id: doc.id, ...doc.data() } as Post);
            });

            return { success: true, posts };
        } catch (error: any) {
            console.error("Error fetching posts:", error);
            return { success: false, error: error.message, posts: [] };
        }
    },

    // Get posts by specific user
    async getUserPosts(userId: string) {
        try {
            const postsRef = collection(db, "posts");
            const q = query(
                postsRef,
                where("userId", "==", userId),
                orderBy("createdAt", "desc")
            );
            const querySnapshot = await getDocs(q);

            const posts: Post[] = [];
            querySnapshot.forEach((doc) => {
                posts.push({ id: doc.id, ...doc.data() } as Post);
            });

            return { success: true, posts };
        } catch (error: any) {
            console.error("Error fetching user posts:", error);
            return { success: false, error: error.message, posts: [] };
        }
    },

    // Get user profile
    async getUserProfile(userId: string) {
        try {
            const userRef = doc(db, "users", userId);
            const userDoc = await getDocs(
                query(collection(db, "users"), where("uid", "==", userId))
            );

            if (!userDoc.empty) {
                const userData = userDoc.docs[0].data() as UserProfile;
                return { success: true, profile: userData };
            }

            return { success: false, error: "User not found" };
        } catch (error: any) {
            console.error("Error fetching user profile:", error);
            return { success: false, error: error.message };
        }
    },
};

export default postService;
