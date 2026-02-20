import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";

const StatCard = ({ title, value, icon, color, navigateTo }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (navigateTo) {
      navigate(navigateTo);
    }
  };

  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400",
    green:
      "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400",
    orange:
      "bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400",
    purple:
      "bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400",
    red: "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400",
  };

  return (
    <div
      className={`group rounded-xl border border-border/70 bg-card p-3.5 sm:p-4 lg:p-5 shadow-sm transition-all duration-250 hover:-translate-y-0.5 hover:shadow-elevation-md ${
        navigateTo ? "cursor-pointer" : ""
      }`}
      onClick={handleClick}
      role={navigateTo ? "button" : "article"}
      tabIndex={navigateTo ? 0 : undefined}
      onKeyDown={(e) => {
        if (navigateTo && (e?.key === "Enter" || e?.key === " ")) {
          handleClick();
        }
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-xs">
            {title}
          </p>
          <h3 className="break-words text-lg font-semibold leading-tight text-foreground sm:text-xl lg:text-2xl">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 ${
            colorClasses?.[color] || colorClasses?.blue
          }`}
        >
          <Icon name={icon} size={18} className="sm:h-5 sm:w-5" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
