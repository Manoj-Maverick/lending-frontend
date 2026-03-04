import React from "react";
import { cn } from "../../utils/cn";

const PageShell = ({ className, children }) => {
  return <section className={cn("page-modern-shell", className)}>{children}</section>;
};

export default PageShell;
