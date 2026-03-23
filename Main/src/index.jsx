import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { UIContextProvider } from "context/UIContext";
import { AuthProvider } from "auth/AuthContext";
import { ToastProvider } from "context/ToastContext";
import FullScreenLoader from "components/ui/FullScreenLoader";
import App from "./App";
import "./styles/tailwind.css";
import "./styles/index.css";
import "./styles/motion-foundation.css";

const queryClient = new QueryClient();
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <ToastProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UIContextProvider>
          <React.Suspense fallback={<FullScreenLoader />}>
            <App />
          </React.Suspense>
        </UIContextProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ToastProvider>,
);
