import { useAuth } from "@/context/authcontext";
import { router } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
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

import { SignupError } from ".";

const index = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
        }

        setErrors(newErrors);
    };

    const logIn = async () => {
        // Mark all fields as touched
        setTouched({ email: true, password: true });

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await login(email.trim(), password);

            if (response.success) {
                router.replace("/(tabs)");
            } else {
                // Show specific error in the appropriate field
                if (response.error?.includes("email")) {
                    setErrors({ email: response.error });
                } else {
                    setErrors({ password: response.error });
                }
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
                    <Text style={styles.title}>Log in</Text>
                    <Text style={styles.subtitle}>Log in your account</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[
                                styles.textInput,
                                touched.email &&
                                    errors.email &&
                                    styles.inputError,
                            ]}
                            placeholder="Email"
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

                    <TouchableOpacity
                        style={[
                            styles.button,
                            loading && styles.buttonDisabled,
                        ]}
                        onPress={logIn}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.buttonText}>Log in</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push("/(auth)")}
                        disabled={loading}
                    >
                        <Text style={styles.linkText}>
                            DOn't have an account?
                            <Text style={styles.linkBold}> Sign up</Text>
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
    inputError: {
        borderColor: "#FF3B30",
        borderWidth: 2,
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
        shadowColor: "#5C6BC0",
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
