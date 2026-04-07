import React from "react";
import Icon from "../../../components/AppIcon";

const TABS = [
  { key: "directory", label: "Staff", icon: "Users" },
  { key: "attendance", label: "Attendance", icon: "CalendarDays" },
  { key: "salary", label: "Salary", icon: "Landmark" },
];

const StaffSectionTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onTabChange(tab.key)}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === tab.key
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-foreground hover:border-primary/30 hover:bg-primary/5"
          }`}
        >
          <Icon name={tab.icon} size={16} />
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default StaffSectionTabs;
