import React from "react";
import Button from "../../../components/ui/Button";

const CollectionDateScope = ({ scope, onChange }) => {
  const items = [
    { id: "today", label: "Today" },
    { id: "tomorrow", label: "Tomorrow" },
    { id: "next7", label: "Next 7 Days" },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {items.map((i) => (
        <Button
          key={i.id}
          variant={scope === i.id ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(i.id)}
        >
          {i.label}
        </Button>
      ))}
    </div>
  );
};

export default CollectionDateScope;
