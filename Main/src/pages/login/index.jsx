import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Checkbox";
import { useAuth } from "../../auth/AuthContext";
import "./styles/login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const typingMessages = [
    "Collections, Loans & Recovery",
    "Daily Dues and Smart Follow-up",
    "Branch-wise Financial Control",
    "Real-time Lending Insights",
  ];

  const [formData, setFormData] = useState({
    username: "admin",
    password: "admin123",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTypingIndex((prev) => (prev + 1) % typingMessages.length);
    }, 2800);

    return () => clearInterval(timer);
  }, [typingMessages.length]);

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
    <div className="login-scene min-h-screen px-4 py-8 sm:px-6">
      <div className="login-aurora" aria-hidden="true" />
      <div className="login-noise" aria-hidden="true" />
      <div className="login-money-bg" aria-hidden="true">
        <span className="money-chip money-chip-1">Rs</span>
        <span className="money-chip money-chip-2">Loan</span>
        <span className="money-chip money-chip-3">Rs</span>
        <span className="money-chip money-chip-4">EMI</span>
        <span className="money-chip money-chip-5">Rs</span>
        <span className="money-chip money-chip-6">Cashflow</span>
        <span className="money-chip money-chip-7">Rs</span>
      </div>
      <div className="login-orb login-orb-one" aria-hidden="true" />
      <div className="login-orb login-orb-two" aria-hidden="true" />
      <div className="login-orb login-orb-three" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="login-info-panel hidden rounded-3xl p-8 lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-8">
            <p className="inline-flex w-fit rounded-full border border-cyan-100/40 bg-cyan-100/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
              Lending Intelligence
            </p>
            <div className="space-y-4">
              <h2 className="text-4xl font-semibold leading-tight text-slate-50 xl:text-5xl">
                One platform for your
              </h2>
              <p
                key={typingIndex}
                className="login-typing text-3xl font-semibold text-cyan-200 xl:text-4xl"
              >
                {typingMessages[typingIndex]}
              </p>
              <p className="max-w-xl text-base leading-relaxed text-slate-200/90">
                Track borrowers, collect dues faster, and monitor branch-level
                performance with real-time visibility.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="info-stat">
              <p className="info-stat-value">Live</p>
              <p className="info-stat-label">Collections</p>
            </div>
            <div className="info-stat">
              <p className="info-stat-value">Smart</p>
              <p className="info-stat-label">Recovery</p>
            </div>
            <div className="info-stat">
              <p className="info-stat-value">Daily</p>
              <p className="info-stat-label">Insights</p>
            </div>
          </div>
        </section>

        <div className="flex w-full justify-center lg:justify-end">
          <section className="login-form-panel w-full max-w-lg rounded-3xl p-6 shadow-2xl sm:p-10">
            <div className="mb-8 flex items-center justify-center gap-3">
              <div className="login-logo-wrap">
                <Icon name="Landmark" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-slate-50">
                  SDFC Lending
                </h1>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-300">
                  Finance Platform
                </p>
              </div>
            </div>

            <div className="space-y-2 text-center sm:space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-200">
                Secure Login
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-50">
                Welcome back
              </h2>
              <p className="text-sm text-slate-200">
                Continue to your lending dashboard
              </p>
            </div>

            <form
              onSubmit={handleLogin}
              className="mt-8 space-y-4 sm:space-y-5"
            >
              <Input
                className="login-input"
                label="Username"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleInputChange}
                error={errors.username}
                required
              />

              <div className="relative">
                <Input
                  className="login-input pr-11"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="login-eye-btn"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <Icon name={showPassword ? "EyeOff" : "Eye"} size={18} />
                </button>
              </div>

              {errors.submit && (
                <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3">
                  <p className="text-sm text-rose-700">{errors.submit}</p>
                </div>
              )}

              <div className="flex items-center justify-between gap-4">
                <Checkbox
                  className="text-slate-200"
                  label="Remember me"
                  checked={formData.rememberMe}
                  onChange={handleCheckboxChange}
                />
                <button
                  type="button"
                  onClick={() => alert("Contact admin to reset password")}
                  className="text-sm font-medium text-cyan-200 transition hover:text-cyan-100"
                >
                  Forgot Password?
                </button>
              </div>

              <Button
                className="login-submit-btn"
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

            <div className="mt-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-slate-200/30" />
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                Protected Session
              </p>
              <span className="h-px flex-1 bg-slate-200/30" />
            </div>

            <p className="mt-6 text-center text-xs text-slate-300">
              &copy; {new Date().getFullYear()} SDFC Lending System
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Login;
