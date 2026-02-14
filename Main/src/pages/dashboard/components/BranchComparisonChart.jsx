import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Icon from "../../../components/AppIcon";

const BranchComparisonChart = () => {
  const data = [
    { branch: "Main", clients: 156, loans: 89, collection: 95000 },
    { branch: "North", clients: 134, loans: 72, collection: 82000 },
    { branch: "South", clients: 98, loans: 54, collection: 68000 },
    { branch: "East", clients: 112, loans: 63, collection: 75000 },
    { branch: "West", clients: 87, loans: 47, collection: 58000 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">
            {label} Branch
          </p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground">Clients:</span>
              <span className="text-xs font-medium text-foreground">
                {payload?.[0]?.payload?.clients}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground">
                Active Loans:
              </span>
              <span className="text-xs font-medium text-foreground">
                {payload?.[0]?.payload?.loans}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground">Collection:</span>
              <span className="text-xs font-medium text-accent">
                ${payload?.[0]?.value?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-5 lg:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h2 className="text-base md:text-lg lg:text-xl font-semibold text-foreground">
            Branch Performance Comparison
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Monthly collection by branch
          </p>
        </div>
        <Icon name="TrendingUp" size={20} className="text-muted-foreground" />
      </div>
      <div
        className="w-full h-64 md:h-72 lg:h-80"
        aria-label="Branch Performance Comparison Bar Chart"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="branch"
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
              axisLine={{ stroke: "var(--color-border)" }}
            />
            <YAxis
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
              axisLine={{ stroke: "var(--color-border)" }}
              tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}k`}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "var(--color-muted)" }}
            />
            <Bar dataKey="collection" fill="#059669" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BranchComparisonChart;
