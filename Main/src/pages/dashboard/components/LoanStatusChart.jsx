import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import Icon from "../../../components/AppIcon";

const LoanStatusChart = () => {
  const data = [
    { name: "Active Loans", value: 245, color: "#3B82F6" },
    { name: "Closed Loans", value: 189, color: "#10B981" },
    { name: "Delayed Loans", value: 34, color: "#F59E0B" },
    { name: "Foreclosed", value: 12, color: "#EF4444" },
  ];

  const totalLoans = data?.reduce((sum, item) => sum + item?.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const percentage = ((payload?.[0]?.value / totalLoans) * 100)?.toFixed(1);
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">
            {payload?.[0]?.name}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {payload?.[0]?.value} loans ({percentage}%)
          </p>
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
            Loan Status Distribution
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Total: {totalLoans} loans
          </p>
        </div>
        <Icon name="PieChart" size={20} className="text-muted-foreground" />
      </div>
      <div
        className="w-full h-64 md:h-72 lg:h-80"
        aria-label="Loan Status Distribution Pie Chart"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius="80%"
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${(percent * 100)?.toFixed(0)}%`}
            >
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry?.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value, entry) => (
                <span className="text-xs md:text-sm text-foreground">
                  {value} ({entry?.payload?.value})
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LoanStatusChart;
