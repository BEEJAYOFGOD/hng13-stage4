import { auth } from "@/firebaseconfig";
import authService from "@/services/authservice";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { Alert } from "react-native";

// Define types for user and context
export interface User {
    uid: string;
    email: string;
    displayName: string;
}


export interface AuthResponse {
    success: boolean;
    error?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<AuthResponse>;
    signup: (
        email: string,
        password: string,
        displayName: string
    ) => Promise<AuthResponse>;
    logOut: () => Promise<void>;
    setUser: (user: User) => void;
}

// Create context with proper typing
export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        console.log("Setting up auth listener...");

        // Use auth.onAuthStateChanged directly instead of authService
        const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
            console.log(
                "Auth state changed:",
                firebaseUser?.email || "No user"
            );

            // This was done to check if the userObject exist
            if (firebaseUser) {
                const simplifiedUser: User = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || "",
                    displayName: firebaseUser.displayName || "",
                };

                setUser(simplifiedUser);
            } else {
                setUser(null);
            }

            setLoading(false);
        });

        return () => {
            console.log("Cleaning up auth listener");
            unsubscribe();
        };
    }, []);

    const login = async (
        email: string,
        password: string
    ): Promise<AuthResponse> => {
        const response = await authService.login(email, password);

        if (response?.error) {
            return response;
        }

        console.log(response);

        return { success: true };
    };

    const signup = async (
        email: string,
        password: string,
        displayName: string
    ): Promise<AuthResponse> => {
        const response = await authService.signup(
            email,
            password,
            displayName,
            setUser
        );

        if (response?.error) {
            return response;
        }

        return { success: true };
    };

    const logOut = async (): Promise<void> => {
        await authService.logOut();
        Alert.alert("log out successful");
    };

    return (
        <AuthContext.Provider
            value={{ user, login, logOut, signup, loading, setUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};
