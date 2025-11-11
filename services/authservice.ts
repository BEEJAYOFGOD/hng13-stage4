import { auth } from "@/firebaseconfig";
import { FirebaseError } from "firebase/app";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import postService from "./postService";

function handleFirebaseError(err: unknown): string {
    if (err instanceof FirebaseError) {
        // You can customize messages based on error codes
        switch (err.code) {
            case "auth/email-already-in-use":
                return "This email is already registered";
            case "auth/weak-password":
                return "Password should be at least 6 characters";
            case "auth/user-not-found":
                return "Password should be at least 6 characters";
            case "auth/wrong-password":
                return "Invalid email or password";
            case "auth/invalid-credential":
                return "Invalid email or password";
            default:
                return err.message;
        }
    }

    return err instanceof Error ? err.message : "An unexpected error occurred";
}

const authService = {
    // Register a user
    async signup(email: string, password: string, displayName: string) {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const { uid } = userCredential.user;

            await postService.createUserProfile(uid, email, displayName);
            return {
                user: userCredential.user,
                success: true,
            };
        } catch (error: any) {
            return { error: handleFirebaseError(error), success: false };
        }
    },

    // Login a user
    async login(email: string, password: string) {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            console.log("Login successful:", userCredential.user.email);

            return {
                success: true,
            };
        } catch (error: any) {
            return { error: handleFirebaseError(error), success: false };
        }
    },

    // Get current user
    async getUser() {
        try {
            const user = auth.currentUser;

            if (user) {
                return {
                    success: true,
                    user,
                };
            }
            // return null;
        } catch (error) {
            return { error: handleFirebaseError(error), success: false };
        }
    },

    // Logout user
    async logOut() {
        try {
            await signOut(auth);

            return {
                success: true,
            };
        } catch (error: any) {
            return { error: handleFirebaseError(error), success: false };
        }
    },

    // Check if user is authenticated
    isAuthenticated() {
        return auth.currentUser !== null;
    },

    // Get auth state observer (for listening to auth changes)
    onAuthStateChanged(callback: (user: any) => void) {
        return auth.onAuthStateChanged(callback);
    },
};

export default authService;
