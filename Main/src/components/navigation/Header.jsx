import React from "react";
import Breadcrumb from "./Breadcrumb";
import BranchSelector from "./BranchSelector";
import UserProfileMenu from "./UserProfileMenu";
import Icon from "../AppIcon";
import BranchDisplay from "./BranchDisplay";
export default function Header({
  user,
  selectedBranch,
  branches,
  handleBranchChange,
  handleThemeToggle,
  currentTheme,
  isMobileOpen,
  setIsMobileOpen,
}) {
  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm overflow-x-clip">
      <div className="flex items-center h-16 md:h-20 px-4 md:px-6 lg:px-8">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            className="mobile-menu-button lg:hidden"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle mobile menu"
          >
            <Icon name={isMobileOpen ? "X" : "Menu"} size={20} />
          </button>
          <div className="hidden sm:block min-w-0">
            <Breadcrumb />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="ml-auto flex items-center gap-2 md:gap-4 min-w-0">
          <div className="hidden md:block ">
            {user?.role == "ADMIN" ? (
              <BranchSelector
                selectedBranch={selectedBranch}
                onBranchChange={handleBranchChange}
                branches={branches}
              />
            ) : user?.branchId != null ? (
              <BranchDisplay
                branch={
                  user?.branchId
                    ? branches?.find((b) => b.id == user.branchId)
                    : null
                }
              />
            ) : (
              ""
            )}
          </div>
          <UserProfileMenu
            onThemeToggle={handleThemeToggle}
            currentTheme={currentTheme}
          />
        </div>
      </div>
    </header>
  );
}
