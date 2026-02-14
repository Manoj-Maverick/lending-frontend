import { createContext, useContext, useState } from "react";
const ToastContext = createContext(null);

const TOAST_STYLES = {
  success: {
    border: "border-green-500",
    bg: "bg-green-50",
    text: "text-green-800",
    icon: "✅",
    title: "Success",
  },
  error: {
    border: "border-red-500",
    bg: "bg-red-50",
    text: "text-red-800",
    icon: "❌",
    title: "Error",
  },
  info: {
    border: "border-blue-500",
    bg: "bg-blue-50",
    text: "text-blue-800",
    icon: "ℹ️",
    title: "Info",
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, message, type, exiting: false }]);

    // Auto close
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    // Trigger exit animation
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
    );

    // Remove after animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 220);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-50 space-y-3">
        {toasts.map((toast) => {
          const style = TOAST_STYLES[toast.type];

          return (
            <div
              key={toast.id}
              className={`
                w-[340px]
                rounded-xl border-l-4 ${style.border}
                ${style.bg} ${style.text}
                shadow-lg p-4
                flex gap-3 items-start
                transition-transform duration-150
                hover:-translate-y-[1px]
                ${toast.exiting ? "animate-toast-exit" : "animate-toast-enter"}
              `}
            >
              {/* Icon */}
              <div className="text-xl mt-0.5">{style.icon}</div>

              {/* Content */}
              <div className="flex-1">
                <p className="font-semibold">{style.title}</p>
                <p className="text-sm leading-snug">{toast.message}</p>
              </div>

              {/* Close */}
              <button
                onClick={() => removeToast(toast.id)}
                className="text-lg leading-none opacity-60 hover:opacity-100 transition"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
