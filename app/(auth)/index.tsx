import { useAuth } from "@/context/authcontext";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface SignupError {
    password?: string | boolean;
    displayName?: string | boolean;
    email?: string | boolean;
}

const index = () => {
    const { signup } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [errors, setErrors] = useState<SignupError>({});
    const [touched, setTouched] = useState<SignupError>({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    };

    const validateForm = (): boolean => {
        const newErrors: SignupError = {};

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!password.trim()) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!displayName.trim()) {
            newErrors.displayName = "Username is required";
        } else if (displayName.trim().length < 3) {
            newErrors.displayName = "Username must be at least 3 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBlur = (field: keyof SignupError) => {
        setTouched({ ...touched, [field]: true });

        // Validate individual field on blur
        const newErrors = { ...errors };

        if (field === "email") {
            if (!email.trim()) {
                newErrors.email = "Email is required";
            } else if (!validateEmail(email)) {
                newErrors.email = "Please enter a valid email";
            } else {
                delete newErrors.email;
            }
        } else if (field === "password") {
            if (!password.trim()) {
                newErrors.password = "Password is required";
            } else if (password.length < 6) {
                newErrors.password = "Password must be at least 6 characters";
            } else {
                delete newErrors.password;
            }
        } else if (field === "displayName") {
            if (!displayName.trim()) {
                newErrors.displayName = "Username is required";
            } else if (displayName.trim().length < 3) {
                newErrors.displayName =
                    "Username must be at least 3 characters";
            } else {
                delete newErrors.displayName;
            }
        }

        setErrors(newErrors);
    };

    const signUp = async () => {
        // Mark all fields as touched
        setTouched({ email: true, password: true, displayName: true });

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await signup(
                email.trim(),
                password,
                displayName.trim()
            );

            if (response.success) {
                router.replace("/(tabs)");
            } else {
                if (response.error) Alert.alert(response?.error);
                // Show specific error in the appropriate field
            }
        } catch (err) {
            setErrors({ password: "An unexpected error occurred" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Sign up to get started</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[
                                styles.textInput,
                                touched.email &&
                                    errors.email &&
                                    styles.inputError,
                            ]}
                            placeholder="Email"
                            placeholderTextColor="#A0A0A0"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                if (touched.email && errors.email) {
                                    setErrors({ ...errors, email: undefined });
                                }
                            }}
                            onBlur={() => handleBlur("email")}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect={false}
                            editable={!loading}
                        />
                        {touched.email && errors.email && (
                            <Text style={styles.errorText}>{errors.email}</Text>
                        )}
                    </View>

                    <View style={styles.inputContainer}>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={[
                                    styles.textInput,
                                    touched.password &&
                                        errors.password &&
                                        styles.inputError,
                                ]}
                                placeholder="Password"
                                placeholderTextColor="#A0A0A0"
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    if (touched.password && errors.password) {
                                        setErrors({
                                            ...errors,
                                            password: undefined,
                                        });
                                    }
                                }}
                                onBlur={() => handleBlur("password")}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoComplete="password-new"
                                editable={!loading}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                <Text>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
                            </TouchableOpacity>
                        </View>

                        {touched.password && errors.password && (
                            <Text style={styles.errorText}>
                                {errors.password}
                            </Text>
                        )}
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[
                                styles.textInput,
                                touched.displayName &&
                                    errors.displayName &&
                                    styles.inputError,
                            ]}
                            placeholder="Username"
                            placeholderTextColor="#A0A0A0"
                            value={displayName}
                            onChangeText={(text) => {
                                setDisplayName(text);
                                if (touched.displayName && errors.displayName) {
                                    setErrors({
                                        ...errors,
                                        displayName: undefined,
                                    });
                                }
                            }}
                            onBlur={() => handleBlur("displayName")}
                            autoCapitalize="none"
                            autoComplete="username"
                            autoCorrect={false}
                            editable={!loading}
                        />
                        {touched.displayName && errors.displayName && (
                            <Text style={styles.errorText}>
                                {errors.displayName}
                            </Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.button,
                            loading && styles.buttonDisabled,
                        ]}
                        onPress={signUp}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.buttonText}>
                                Create Account
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push("/login")}
                        disabled={loading}
                    >
                        <Text style={styles.linkText}>
                            Already have an account?{" "}
                            <Text style={styles.linkBold}>Log in</Text>
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default index;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAFAFA",
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: "800",
        marginBottom: 8,
        color: "#2f95dc",
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 40,
    },
    inputContainer: {
        width: "100%",
        marginBottom: 16,
    },
    textInput: {
        height: 50,
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderColor: "#E8EAF6",
        borderWidth: 2,
        borderRadius: 12,
        paddingHorizontal: 20,
        fontSize: 16,
        color: "#3C4858",
    },
    passwordContainer: {
        position: "relative",
    },
    eyeIcon: {
        position: "absolute",
        right: 12,
        top: 16,
        fontSize: 18,
    },
    inputError: {
        borderColor: "#FF3B30",
        borderWidth: 2,
    },
    errorText: {
        color: "#FF3B30",
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    button: {
        width: "100%",
        marginTop: 8,
        marginBottom: 20,
        backgroundColor: "#2f95dc",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#2f95dc",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonDisabled: {
        backgroundColor: "#9FA8DA",
        opacity: 0.6,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "600",
    },
    linkText: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
    },
    linkBold: {
        color: "#2f95dc",
        fontWeight: "600",
    },
});
