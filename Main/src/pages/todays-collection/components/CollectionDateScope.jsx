import React from "react";
import Button from "../../../components/ui/Button";
import { Input } from "components/shared";

const CollectionDateScope = ({
  scope,
  customDate,
  onScopeChange,
  onCustomDateChange,
  items,
}) => {
  // Use passed items or fallback
  const dateItems = items || [
    { id: "today", label: "Today" },
    { id: "tomorrow", label: "Tomorrow" },
    { id: "next7", label: "Next 7 Days" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {dateItems.map((item) => (
        <Button
          key={item.id}
          variant={scope === item.id ? "default" : "outline"}
          onClick={() => onScopeChange(item.id)}
        >
          {item.label}
        </Button>
      ))}
      <Input
        type="date"
        value={customDate}
        onChange={(e) => onCustomDateChange(e.target.value)}
        className="border border-border rounded-md px-3 py-2 text-sm"
      />
    </div>
  );
};

export default CollectionDateScope;
