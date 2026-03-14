import React, { useState, useEffect } from "react";
import { OtpInput, Button } from "components/shared";
import Icon from "components/AppIcon";
import apiClient from "api/client";

const RESEND_COOLDOWN_SECONDS = 60;

const PhoneVerification = ({ phone, onVerified, verified }) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [timeLeft, setTimeLeft] = useState(0);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const startCooldown = () => {
    setTimeLeft(RESEND_COOLDOWN_SECONDS);
  };

  const sendOtp = async (isResend = false) => {
    if (!phone || phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await apiClient.post("/api/generateOTP", { phone });

      setOtpSent(true);
      setOtp("");
      startCooldown();
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length !== 4) {
      setError("Please enter the 4-digit OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await apiClient.post("/api/verifyOTP", {
        phone,
        otp,
      });

      onVerified(true);
    } catch (err) {
      const msg = err.message?.toLowerCase() || "";

      if (msg.includes("expired")) {
        setError("OTP expired. Please request a new one.");
      } else if (msg.includes("invalid")) {
        setError("Invalid OTP. Please try again.");
      } else {
        setError("Verification failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (verified) {
    return (
      <div className="flex items-center gap-2 text-green-600 mt-2 font-medium">
        <Icon name="CheckCircle" size={18} />
        Phone number verified successfully
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-2">
      {!otpSent && (
        <Button
          onClick={() => sendOtp()}
          disabled={loading || !phone}
          size="sm"
        >
          {loading ? "Sending..." : "Send OTP"}
        </Button>
      )}

      {otpSent && (
        <>
          <div className="flex items-center gap-3">
            <OtpInput
              length={4}
              value={otp}
              onChange={(val) => {
                setOtp(val);
                if (error) setError("");
              }}
              disabled={loading}
            />

            <Button
              onClick={verifyOtp}
              disabled={loading || otp.length !== 4}
              size="sm"
            >
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </div>

          {/* Resend Section */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {timeLeft > 0 ? (
              <>Resend OTP in {formatTime(timeLeft)}</>
            ) : (
              <Button
                variant="link"
                size="sm"
                onClick={() => sendOtp(true)}
                disabled={loading}
                className="p-0 h-auto font-medium text-blue-600"
              >
                Resend OTP
              </Button>
            )}
          </div>
        </>
      )}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default PhoneVerification;
