import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../AppIcon";
import { useAuth } from "../../auth/AuthContext";

const UserProfileMenu = ({ user, onThemeToggle, currentTheme = "light" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { logout, user: currentUser } = useAuth();

  const defaultUser = user || {
    name: currentUser?.username || "userName",
    email: currentUser?.email || "user@sdfc.com",
    role: currentUser?.role || "userRole",
    avatar: null,
  };

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

  const handleThemeToggle = () => {
    if (onThemeToggle) {
      onThemeToggle();
    }
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  const handleSettings = () => {
    setIsOpen(false);
    navigate("/settings");
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      ?.map((n) => n?.[0])
      ?.join("")
      ?.toUpperCase()
      ?.slice(0, 2);
  };

  return (
    <div className="user-profile-menu" ref={dropdownRef}>
      <div
        className="user-profile-trigger"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e?.key === "Enter" || e?.key === " ") {
            setIsOpen(!isOpen);
          }
        }}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <div className="user-profile-avatar">
          {defaultUser?.avatar ? (
            <img
              src={defaultUser?.avatar}
              alt={defaultUser?.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span>{getInitials(defaultUser?.name)}</span>
          )}
        </div>
        <div className="hidden md:flex flex-col items-start">
          <span className="text-sm font-medium">{defaultUser?.name}</span>
          <span className="text-xs text-muted-foreground">
            {defaultUser?.role}
          </span>
        </div>
        <Icon
          name={isOpen ? "ChevronUp" : "ChevronDown"}
          size={16}
          className="hidden md:block"
        />
      </div>
      {isOpen && (
        <div className="user-profile-dropdown" role="menu">
          <div className="user-profile-header">
            <div className="text-sm font-medium">{defaultUser?.name}</div>
            <div className="text-xs text-muted-foreground">
              {defaultUser?.email}
            </div>
          </div>

          <div
            className="user-profile-menu-item"
            onClick={handleThemeToggle}
            role="menuitem"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e?.key === "Enter" || e?.key === " ") {
                handleThemeToggle();
              }
            }}
          >
            <Icon name={currentTheme === "dark" ? "Sun" : "Moon"} size={18} />
            <span>{currentTheme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </div>

          <div
            className="user-profile-menu-item"
            onClick={handleSettings}
            role="menuitem"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e?.key === "Enter" || e?.key === " ") {
                handleSettings();
              }
            }}
          >
            <Icon name="Settings" size={18} />
            <span>Settings</span>
          </div>

          <div
            className="user-profile-menu-item danger"
            onClick={handleLogout}
            role="menuitem"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e?.key === "Enter" || e?.key === " ") {
                handleLogout();
              }
            }}
          >
            <Icon name="LogOut" size={18} />
            <span>Logout</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileMenu;
