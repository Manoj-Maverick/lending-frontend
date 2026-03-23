import React from "react";
import { Loader2 } from "lucide-react";
import { useTypewriter, Cursor } from "react-simple-typewriter";

export default function FullScreenLoader() {
  const [text] = useTypewriter({
    words: [
      "Initializing secure session...",
      "Fetching dashboard data...",
      "Syncing branches...",
      "Preparing your workspace...",
    ],
    loop: true,
    delaySpeed: 1500,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white"
      role="status"
      aria-live="polite"
    >
      <div className="absolute h-[400px] w-[400px] rounded-full bg-red-500/20 blur-3xl animate-pulse" />

      <div className="relative flex flex-col items-center gap-6">
        <Loader2 className="h-12 w-12 animate-spin text-red-500" />

        <div className="text-lg text-gray-300 font-medium">
          {text}
          <Cursor cursorStyle="|" />
        </div>

        <p className="text-sm text-gray-500">
          Please wait while we load your data
        </p>
      </div>
    </div>
  );
}
