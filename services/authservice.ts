import { AuthResponse, User } from "@/context/authcontext";
import { auth } from "@/firebaseconfig";
import { FirebaseError } from "firebase/app";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
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
    async signup(
        email: string,
        password: string,
        displayName: string,
        setUser: (user: User) => void
    ): Promise<AuthResponse> {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const { uid } = userCredential.user;

            await updateProfile(userCredential.user, {
                displayName: displayName,
            });

            const updatedUser = {
                uid: userCredential.user.uid,
                email: userCredential.user.email || "",
                displayName,
            };

            setUser(updatedUser);

            await postService.createUserProfile(uid, email, displayName);
            return {
                success: true,
            };
        } catch (error: any) {
            return { error: handleFirebaseError(error), success: false };
        }
    },

    // Login a user
    async login(email: string, password: string): Promise<AuthResponse> {
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

    // Logout user
    async logOut(): Promise<AuthResponse> {
        try {
            await signOut(auth);

            return {
                success: true,
            };
        } catch (error: any) {
            return { error: handleFirebaseError(error), success: false };
        }
    },
};

export default authService;
