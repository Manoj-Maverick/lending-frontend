import React from "react";
import Icon from "../../../components/AppIcon";

const CollectionStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((s, i) => (
        <div key={i} className="bg-card border rounded-lg p-4">
          <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center">
            <Icon name={s.icon} size={24} />
          </div>
          <p className="text-sm text-muted-foreground mt-3">{s.title}</p>
          <p className="text-2xl font-bold">₹{s.value.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default CollectionStats;
