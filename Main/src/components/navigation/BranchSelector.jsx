import React, { useState, useRef, useEffect } from "react";
import Icon from "../AppIcon";

const BranchSelector = ({ branches = [], selectedBranch, onBranchChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const allBranchesOption = {
    id: "all",
    branch_name: "All Branches",
    location: "System Wide",
  };

  const branchesWithAllOption = [allBranchesOption, ...branches];
  // console.log("Branches with All Option:", branchesWithAllOption);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef?.current &&
        !dropdownRef?.current?.contains(event?.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event?.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleBranchSelect = (branch) => {
    setIsOpen(false);
    setSearchQuery("");
    if (onBranchChange) {
      onBranchChange(branch);
      console.log("Selected Branch:", branch);
    }
  };

  const filteredBranches = branchesWithAllOption?.filter(
    (branch) =>
      branch?.branch_name
        ?.toLowerCase()
        ?.includes(searchQuery?.toLowerCase()) ||
      branch?.location?.toLowerCase()?.includes(searchQuery?.toLowerCase()),
  );

  return (
    <div className="branch-selector relative" ref={dropdownRef}>
      <div
        className="branch-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e?.key === "Enter" || e?.key === " ") {
            setIsOpen(!isOpen);
          }
        }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Icon name="Building2" size={18} />
        <div className="flex flex-col items-start min-w-0">
          <span className="text-sm font-medium truncate max-w-[140px] sm:max-w-[200px]">
            {selectedBranch?.branch_name ?? "All Branches"}
          </span>
          <span className="hidden md:block text-xs text-muted-foreground truncate max-w-[200px]">
            {selectedBranch?.location ?? "System Wide"}
          </span>
        </div>

        <Icon
          name={isOpen ? "ChevronUp" : "ChevronDown"}
          size={16}
          className="ml-auto"
        />
      </div>
      {isOpen && (
        <div
          className="branch-selector-dropdown absolute left-0 right-0 z-50"
          role="listbox"
        >
          <input
            type="text"
            className="branch-selector-search"
            placeholder="Search branches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            autoFocus
          />
          <div className="branch-selector-list">
            {filteredBranches?.length > 0 ? (
              filteredBranches?.map((branch) => (
                <div
                  key={branch?.id}
                  className={`branch-selector-item ${
                    selectedBranch?.id === branch?.id ? "selected" : ""
                  }`}
                  onClick={() => handleBranchSelect(branch)}
                  role="option"
                  aria-selected={selectedBranch?.id === branch?.id}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e?.key === "Enter" || e?.key === " ") {
                      handleBranchSelect(branch);
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon name="Building2" size={18} />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {branch?.branch_name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {branch?.location}
                      </span>
                    </div>
                    {selectedBranch?.id === branch?.id && (
                      <Icon
                        name="Check"
                        size={16}
                        className="ml-auto text-accent"
                      />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No branches found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchSelector;
