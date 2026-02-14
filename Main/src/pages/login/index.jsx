import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Checkbox";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";
import "./styles/Login.css"; // custom CSS for wave animation

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "admin",
    password: "admin123",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors?.[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      rememberMe: e?.target?.checked,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData?.username?.trim())
      newErrors.username = "Username is required";
    if (!formData?.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      await login(formData.username, formData.password); // << USE CONTEXT LOGIN
      navigate("/dashboard"); // SAFE NOW
    } catch (err) {
      setErrors({
        submit:
          err?.response?.data?.error ||
          "Invalid credentials. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-bg min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left Section - Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
              <Icon name="Landmark" size={36} color="white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">SDFC Lending</h1>
              <p className="text-lg opacity-80">Financial Management System</p>
            </div>
          </div>
          <div className="space-y-4 mt-12">
            <h2 className="text-3xl font-semibold">
              Streamline Your Lending Operations
            </h2>
            <p className="text-lg opacity-90 leading-relaxed">
              Manage branches, clients, loans, and payments with real-time
              analytics and automated workflows.
            </p>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-md bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 text-gray-800">
            {/* Mobile Branding */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-6 sm:mb-8">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Icon name="Landmark" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-indigo-600">
                  SDFC Lending
                </h1>
                <p className="text-sm text-gray-500">Management System</p>
              </div>
            </div>

            {/* Welcome Text */}
            <div className="space-y-2 mb-6 sm:mb-8 text-center">
              <h2 className="text-2xl sm:text-3xl font-semibold">
                Welcome Back
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Sign in to access your dashboard
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
              <Input
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                error={errors.username}
                required
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition"
                >
                  <Icon name={showPassword ? "EyeOff" : "Eye"} size={20} />
                </button>
              </div>

              {errors.submit && (
                <div className="bg-red-100 border border-red-300 rounded-lg p-3">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <Checkbox
                  label="Remember me"
                  checked={formData.rememberMe}
                  onChange={handleCheckboxChange}
                />
                <button
                  type="button"
                  onClick={() => alert("Contact admin to reset password")}
                  className="text-sm text-indigo-600 hover:text-indigo-800 transition"
                >
                  Forgot Password?
                </button>
              </div>

              <Button
                type="submit"
                size="lg"
                fullWidth
                loading={isLoading}
                iconName="LogIn"
                iconPosition="right"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <p className="text-center text-xs text-gray-300 mt-6">
              &copy; {new Date().getFullYear()} SDFC Lending System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
