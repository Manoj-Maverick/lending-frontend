import React from "react";
import Icon from "../AppIcon";

const BranchDisplay = ({ branch }) => {
  const hasBranch = branch && branch.branch_name;

  return (
    <div
      className="
        branch-selector-trigger 
        flex items-center gap-3 
        cursor-default 
        select-none 
        min-w-[180px]
      "
    >
      <Icon name="Building2" size={18} className="text-muted-foreground" />

      <div className="flex flex-col items-start min-w-0">
        <span className="text-sm font-medium truncate max-w-[140px] sm:max-w-[200px]">
          {hasBranch ? branch.branch_name : "No Branch Assigned"}
        </span>

        <span className="hidden md:block text-xs text-muted-foreground truncate max-w-[200px]">
          {hasBranch ? branch.location : "Please contact admin"}
        </span>
      </div>
    </div>
  );
};

export default BranchDisplay;
