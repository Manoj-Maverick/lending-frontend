import React from "react";
const tabs = [
  { id: "all", label: "All" },
  { id: "paid", label: "Paid" },
  { id: "pending", label: "Pending" },
  { id: "overdue", label: "Overdue" },
];

const CollectionTabs = ({ activeTab, onChange }) => {
  return (
    <div className="bg-card border border-border rounded-lg mb-6 overflow-x-auto">
      <div className="flex">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === t.id
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CollectionTabs;
