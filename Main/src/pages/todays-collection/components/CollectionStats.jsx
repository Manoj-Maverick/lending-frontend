import React from "react";
import Icon from "../../../components/AppIcon";

const CollectionStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-card border border-border rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
              <Icon name={item.icon} size={20} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{item.title}</p>
              <p className="text-xl font-bold">Rs {item.value.toLocaleString()}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CollectionStats;
