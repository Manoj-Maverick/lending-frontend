import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const PageLoader = ({
  message = "Loading page...",
  delay = 150,
  fullHeight = true,
}) => {
  const [visible, setVisible] = useState(delay === 0);

  useEffect(() => {
    if (delay === 0) {
      setVisible(true);
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setVisible(true);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [delay]);

  if (!visible) {
    return null;
  }

  return (
    <div
      className={`flex items-center justify-center rounded-2xl border border-border bg-card/80 px-6 py-12 text-center shadow-sm backdrop-blur-sm ${
        fullHeight ? "min-h-[50vh]" : "min-h-[220px]"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-foreground">{message}</p>
        <p className="text-xs text-muted-foreground">
          Preparing the next screen...
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
