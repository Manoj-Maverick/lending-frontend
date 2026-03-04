import React from "react";
import { cn } from "../../utils/cn";

const AnimatedSection = ({ className, delay = 0, children }) => {
  return (
    <div
      className={cn("motion-fade-up", className)}
      style={{ "--motion-delay": `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
