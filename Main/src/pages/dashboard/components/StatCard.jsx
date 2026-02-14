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
      className={`bg-card border border-border rounded-lg p-4 md:p-5 lg:p-6 transition-all duration-250 hover:shadow-elevation-md ${
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
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className="flex-1">
          <p className="text-xs md:text-sm text-muted-foreground font-medium mb-1 md:mb-2">
            {title}
          </p>
          <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">
            {value}
          </h3>
          {/* {subtitle && (
            <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">
              {subtitle}
            </p>
          )} */}
        </div>
        <div
          className={`w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-lg flex items-center justify-center ${
            colorClasses?.[color] || colorClasses?.blue
          }`}
        >
          <Icon name={icon} size={20} className="md:w-6 md:h-6 lg:w-7 lg:h-7" />
        </div>
      </div>
      {/* {trend && (
        <div className="flex items-center gap-1 md:gap-2">
          <Icon
            name={trend === "up" ? "TrendingUp" : "TrendingDown"}
            size={14}
            className={`md:w-4 md:h-4 ${
              trend === "up" ? "text-emerald-600" : "text-red-600"
            }`}
          />
          <span
            className={`text-xs md:text-sm font-medium ${
              trend === "up" ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {trendValue}
          </span>
          <span className="text-xs md:text-sm text-muted-foreground">
            vs last month
          </span>
        </div>
      )} */}
    </div>
  );
};

export default StatCard;
