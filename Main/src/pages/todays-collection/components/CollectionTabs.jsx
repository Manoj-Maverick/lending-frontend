import React from "react";
import Icon from "../../../components/AppIcon";

const tabs = [
  { id: "all", label: "All Today", icon: "List" },
  { id: "paid", label: "Paid Today", icon: "CheckCircle" },
  { id: "pending", label: "Pending Today", icon: "Clock" },
  { id: "overdue", label: "Overdue", icon: "AlertTriangle" },
];

const CollectionTabs = ({ activeTab, onChange }) => {
  return (
    <div className="bg-card border border-border rounded-lg mb-6 overflow-x-auto">
      <div className="flex min-w-max">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`px-4 md:px-6 py-3 text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === t.id
                ? "text-accent border-b-2 border-accent bg-accent/5"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon name={t.icon} size={16} />
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CollectionTabs;
