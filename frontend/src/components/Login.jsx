import React, { useState } from "react";
import {
    Eye,
    EyeOff,
    User,
    Mail,
    Lock,
    UserPlus,
    LogIn,
    Camera,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userActions } from "@/store/userSlice";
import { toast } from "sonner";

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        username: "",
        password: "",
        role: "public",
        profilePicture: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [demoLoading, setDemoLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 4) {
            newErrors.password = "Password must be at least 6 characters";
        }

        // Register-specific validations
        if (!isLogin) {
            if (!formData.name) {
                newErrors.name = "Name is required";
            }
            if (!formData.username) {
                newErrors.username = "Username is required";
            } else if (formData.username.length < 3) {
                newErrors.username = "Username must be at least 3 characters";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);

        // Simulate API call

        // Here you would typically make an API call to your backend
        const response = fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/${
                isLogin ? "login" : "register"
            }`,
            {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "content-type": "application/json",
                },
                credentials: "include",
            }
        )
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                localStorage.setItem("user", JSON.stringify(data.user));
                dispatch(userActions.setUser(data.user));
                localStorage.setItem("token", data.token);
                if (data.ok) {
                    navigate("/");
                    setIsLoading(false);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleInputChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setFormData({
            email: "",
            name: "",
            username: "",
            password: "",
            role: "public",
            profilePicture: "",
        });
        setErrors({});
    };

    const handleProfilePictureUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData((prev) => ({
                    ...prev,
                    profilePicture: e.target.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Fetch demo user credentials and fill form
    const handleDemoLogin = async (role) => {
        setDemoLoading(true);
        try {
            const res = await fetch(
                `${
                    import.meta.env.VITE_BACKEND_URL
                }/api/auth/demo-user?role=${role}`
            );
            const data = await res.json();
            if (data.ok && data.user) {
                setFormData((prev) => ({
                    ...prev,
                    email: data.user.email,
                    password: data.user.password,
                }));
                setErrors((prev) => ({ ...prev, email: "", password: "" }));
            }
        } catch (err) {
            // Optionally handle error
            toast.error(err.message);
        }
        setDemoLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-2 sm:p-4">
            <div className="w-full max-w-xs sm:max-w-md">
                <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-4 sm:p-8 border border-white/20">
                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-[#b2cefd] text-black rounded-full mb-4">
                            {isLogin ? (
                                <LogIn className="w-6 h-6 sm:w-8 sm:h-8 text-[#1c1c1c]" />
                            ) : (
                                <UserPlus className="w-6 h-6 sm:w-8 sm:h-8 text-[#1c1c1c]" />
                            )}
                        </div>
                        <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-2">
                            {isLogin ? "Welcome Back" : "Create Account"}
                        </h1>
                        <p className="text-xs sm:text-base text-gray-600">
                            {isLogin
                                ? "Sign in to your account"
                                : "Join our community today"}
                        </p>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                        {/* Demo Buttons */}
                        {isLogin && (
                            <div className="flex justify-between mb-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleDemoLogin("public")}
                                    disabled={demoLoading}
                                    className="flex-1 bg-blue-100 text-blue-700 py-2 rounded-xl font-medium text-xs sm:text-sm hover:bg-blue-200 transition-all disabled:opacity-50"
                                >
                                    {demoLoading ? "Loading..." : "Public Demo"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDemoLogin("celeb")}
                                    disabled={demoLoading}
                                    className="flex-1 bg-yellow-100 text-yellow-700 py-2 rounded-xl font-medium text-xs sm:text-sm hover:bg-yellow-200 transition-all disabled:opacity-50"
                                >
                                    {demoLoading
                                        ? "Loading..."
                                        : "Celebrity Demo"}
                                </button>
                            </div>
                        )}

                        {/* Name Field (Register only) */}
                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "name",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                            errors.name
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-red-500 text-xs sm:text-sm">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Username Field (Register only) */}
                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Username
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "username",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                            errors.username
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="Choose a username"
                                    />
                                </div>
                                {errors.username && (
                                    <p className="text-red-500 text-xs sm:text-sm">
                                        {errors.username}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "email",
                                            e.target.value
                                        )
                                    }
                                    className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                        errors.email
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="Enter your email"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-xs sm:text-sm">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "password",
                                            e.target.value
                                        )
                                    }
                                    className={`w-full pl-9 sm:pl-10 pr-12 py-2.5 sm:py-3 text-sm sm:text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                        errors.password
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                                    ) : (
                                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs sm:text-sm">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Role Selection (Register only) */}
                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Account Type
                                </label>
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleInputChange("role", "public")
                                        }
                                        className={`flex items-center justify-center p-2.5 sm:p-3 border rounded-xl transition-all ${
                                            formData.role === "public"
                                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                                : "border-gray-300 hover:border-gray-400 text-gray-700"
                                        }`}
                                    >
                                        <span className="text-sm font-medium">
                                            Public
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleInputChange("role", "celeb")
                                        }
                                        className={`flex items-center justify-center p-2.5 sm:p-3 border  rounded-xl transition-all ${
                                            formData.role === "celeb"
                                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                                : "border-gray-300 hover:border-gray-400 text-gray-700"
                                        }`}
                                    >
                                        <span className="text-sm font-medium">
                                            Celebrity
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r bg-[#b2cefd] text py-2.5 sm:py-3 rounded-xl font-medium text-sm sm:text-base hover:bg-[#91b9ff] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-black cursor-pointer"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>
                                        {isLogin
                                            ? "Signing In..."
                                            : "Creating Account..."}
                                    </span>
                                </div>
                            ) : (
                                <span>
                                    {isLogin ? "Sign In" : "Create Account"}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Auth Mode Toggle */}
                    <div className="mt-6 sm:mt-8 text-center">
                        <p className="text-sm sm:text-base text-gray-600">
                            {isLogin
                                ? "Don't have an account?"
                                : "Already have an account?"}
                            <button
                                onClick={toggleAuthMode}
                                className="ml-2 text-blue-500 hover:text-blue-700 font-medium hover:underline transition-colors"
                            >
                                {isLogin ? "Sign Up" : "Sign In"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
