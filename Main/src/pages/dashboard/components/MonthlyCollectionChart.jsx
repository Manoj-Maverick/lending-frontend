import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Icon from "../../../components/AppIcon";

const MonthlyCollectionChart = () => {
  const data = [
    { month: "Jul", expected: 85000, collected: 82000 },
    { month: "Aug", expected: 92000, collected: 89500 },
    { month: "Sep", expected: 88000, collected: 86200 },
    { month: "Oct", expected: 95000, collected: 93800 },
    { month: "Nov", expected: 98000, collected: 96500 },
    { month: "Dec", expected: 105000, collected: 102000 },
    { month: "Jan", expected: 110000, collected: 95000 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">
            {label} 2026
          </p>
          {payload?.map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 mb-1"
            >
              <span className="text-xs text-muted-foreground">
                {entry?.name}:
              </span>
              <span
                className="text-xs font-medium"
                style={{ color: entry?.color }}
              >
                ${entry?.value?.toLocaleString()}
              </span>
            </div>
          ))}
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
            Monthly Collection Trends
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Last 7 months performance
          </p>
        </div>
        <Icon name="BarChart3" size={20} className="text-muted-foreground" />
      </div>
      <div
        className="w-full h-64 md:h-72 lg:h-80"
        aria-label="Monthly Collection Trends Bar Chart"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="month"
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
              axisLine={{ stroke: "var(--color-border)" }}
            />
            <YAxis
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
              axisLine={{ stroke: "var(--color-border)" }}
              tickFormatter={(value) => `₹${(value / 1000)?.toFixed(0)}k`}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "var(--color-muted)" }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px" }}
              iconType="circle"
              formatter={(value) => (
                <span className="text-xs md:text-sm text-foreground">
                  {value}
                </span>
              )}
            />
            <Bar
              dataKey="expected"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
              name="Expected"
            />
            <Bar
              dataKey="collected"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
              name="Collected"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyCollectionChart;
