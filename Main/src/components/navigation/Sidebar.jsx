import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Icon from "../AppIcon";
import BranchSelector from "./BranchSelector";
import BranchDisplay from "./BranchDisplay";
const Sidebar = ({
  user,
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen,
  setIsMobileOpen,
  branches,
  selectedBranch,
  handleBranchChange,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuConfig = {
    ADMIN: [
      { label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
      { label: "Branches", path: "/branches-management", icon: "Building2" },
      { label: "Clients", path: "/clients-management", icon: "Users" },
      { label: "Loans", path: "/loans-management", icon: "Wallet" },
      { label: "Payments", path: "/payments-management", icon: "CreditCard" },
      {
        label: "Today's Collection",
        path: "/todays-collection",
        icon: "CalendarCheck",
      },
      { label: "Staff", path: "/staff-management", icon: "UserCog" },
      { label: "Reports", path: "/reports", icon: "FileText" },
      { label: "Settings", path: "/settings", icon: "Settings" },
    ],

    BRANCH_MANAGER: [
      { label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },

      // Manager sees "Branches" only if they manage ONE branch
      // If they manage a single branch:
      // { label: "My Branch", path: `/branches-management/${user.branchId}`, icon: "Building2" },
      // If you still want them to see list:
      { label: "Branches", path: "/branches-management", icon: "Building2" },

      { label: "Clients", path: "/clients-management", icon: "Users" },
      { label: "Loans", path: "/loans-management", icon: "Wallet" },
      { label: "Payments", path: "/payments-management", icon: "CreditCard" },
      { label: "Staff", path: "/staff-management", icon: "UserCog" },
      { label: "Reports", path: "/reports", icon: "FileText" },
      { label: "Settings", path: "/settings", icon: "Settings" },
    ],

    STAFF: [
      { label: "Home", path: "/dashboard", icon: "LayoutDashboard" },
      {
        label: "Branch",
        path: `/branch-details/${user?.branchId}`,
        icon: "Building2",
      },
      { label: "Customers", path: "/clients-management", icon: "Users" },
      { label: "Loans Accounts", path: "/loans-management", icon: "Wallet" },
      { label: "Payments", path: "/payments-management", icon: "CreditCard" },
      { label: "Settings", path: "/settings", icon: "Settings" },
    ],
  };

  const navigationItems = menuConfig[user?.role] || [];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location?.pathname === path;
    }
    return location?.pathname?.startsWith(path);
  };

  return (
    <>
      {/* <button
        className="mobile-menu-button"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle mobile menu"
      >
        <Icon name={isMobileOpen ? "X" : "Menu"} size={20} />
      </button> */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <aside
        className={`sidebar ${isCollapsed ? "collapsed" : ""} ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-250`}
      >
        {/* <aside
        className={` sidebar fixed inset-y-0 left-0 z-50 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-250
          lg:static lg:translate-x-0 ${isCollapsed ? "lg:collapsed" : ""}
  `}
      > */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Icon name="Building2" size={32} color="var(--color-primary)" />
          </div>
          <span className="sidebar-logo-text">SDFC</span>
        </div>

        <nav className="sidebar-nav">
          {/* Mobile Branch Selector */}
          {user.role == "ADMIN" ? (
            <div className="md:hidden ">
              <BranchSelector
                selectedBranch={selectedBranch}
                onBranchChange={handleBranchChange}
                branches={branches}
              />
            </div>
          ) : (
            ""
          )}

          {navigationItems?.map((item) => (
            <div
              key={item?.path}
              className={`sidebar-nav-item ${isActive(item?.path) ? "active" : ""}`}
              onClick={() => handleNavigation(item?.path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e?.key === "Enter" || e?.key === " ") {
                  handleNavigation(item?.path);
                }
              }}
              aria-label={item?.label}
            >
              <Icon name={item?.icon} size={20} />
              <span className="sidebar-nav-item-text">{item?.label}</span>
            </div>
          ))}
        </nav>
        {onToggleCollapse && (
          <div className="hidden lg:flex">
            <button
              className="sidebar-toggle"
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Icon
                name={isCollapsed ? "ChevronRight" : "ChevronLeft"}
                size={16}
              />
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
