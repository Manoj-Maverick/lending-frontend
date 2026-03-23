import React from "react";
import { Loader2 } from "lucide-react";

const ButtonLoader = ({ className = "mr-2 h-4 w-4" }) => (
  <Loader2 className={`${className} animate-spin`} aria-hidden="true" />
);

export default ButtonLoader;
