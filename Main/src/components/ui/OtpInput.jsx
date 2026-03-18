import React, { useRef } from "react";

const OtpInput = ({ length = 4, value, onChange }) => {
  const inputs = useRef([]);

  const handleChange = (e, index) => {
    const digit = e.target.value.replace(/\D/, "");

    const newOtp = [...value];
    newOtp[index] = digit;

    onChange(newOtp.join(""));

    if (digit && index < length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <div className="flex gap-2">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputs.current[index] = el)}
          type="text"
          maxLength="1"
          value={value[index] || ""}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="
            w-12 h-12 text-center text-lg font-semibold rounded-lg
            border border-gray-300 bg-white text-gray-900
            focus:outline-none focus:ring-2 focus:ring-blue-500
            
            dark:border-gray-600
            dark:bg-gray-800
            dark:text-gray-100
            dark:focus:ring-blue-400
          "
        />
      ))}
    </div>
  );
};

export default OtpInput;
