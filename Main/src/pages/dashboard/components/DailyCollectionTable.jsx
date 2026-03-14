import React from "react";
import Icon from "../../../components/AppIcon";
import { useDailyCollectionSummary } from "hooks/dashboard/useDailyCollectionSummary";
import { useUIContext } from "context/UIContext";

const DailyCollectionTable = () => {
  const { selectedBranch } = useUIContext();

  const { data: dailyData = [], isLoading } = useDailyCollectionSummary(
    selectedBranch?.id || "all",
  );

  const getStatus = (percentage) => {
    if (percentage >= 95) return "good";
    if (percentage >= 80) return "warning";
    return "pending";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "good":
        return "text-emerald-600 dark:text-emerald-400";
      case "warning":
        return "text-orange-600 dark:text-orange-400";
      case "pending":
        return "text-muted-foreground";
      default:
        return "text-foreground";
    }
  };

  const getBarColor = (status) => {
    switch (status) {
      case "good":
        return "bg-emerald-500";
      case "warning":
        return "bg-orange-500";
      case "pending":
        return "bg-muted-foreground";
      default:
        return "bg-muted-foreground";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "good":
        return "CheckCircle2";
      case "warning":
        return "AlertCircle";
      case "pending":
        return "Clock";
      default:
        return "Circle";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center text-muted-foreground">
        Loading collection summary...
      </div>
    );
  }

  const formattedData = (dailyData?.data || []).map((item) => {
    const expected = Number(item.expected || 0);
    const collected = Number(item.collected || 0);

    const percentage = expected === 0 ? 0 : (collected / expected) * 100;

    const status = getStatus(percentage);

    return {
      ...item,
      expected,
      collected,
      percentage,
      status,
    };
  });

  return (
    <div className="glass-surface-soft motion-hover-lift bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 md:p-5 lg:p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-base md:text-lg lg:text-xl font-semibold text-foreground">
            Daily Collection Summary
          </h2>

          <Icon name="Calendar" size={20} className="text-muted-foreground" />
        </div>

        <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">
          Last 7 days collection performance
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-4 py-3 text-left text-xs md:text-sm font-medium text-muted-foreground">
                Day
              </th>

              <th className="px-4 py-3 text-right text-xs md:text-sm font-medium text-muted-foreground">
                Expected
              </th>

              <th className="px-4 py-3 text-right text-xs md:text-sm font-medium text-muted-foreground">
                Collected
              </th>

              <th className="px-4 py-3 text-left text-xs md:text-sm font-medium text-muted-foreground">
                Progress
              </th>

              <th className="px-4 py-3 text-center text-xs md:text-sm font-medium text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {formattedData.map((item, index) => (
              <tr
                key={item.day}
                className={`border-b border-border hover:bg-muted/20 transition-colors ${
                  index === formattedData.length - 1 ? "border-b-0" : ""
                }`}
              >
                {/* Day */}
                <td className="px-4 py-3 md:py-4 text-xs md:text-sm font-medium text-foreground">
                  {item.day}
                </td>

                {/* Expected */}
                <td className="px-4 py-3 md:py-4 text-right text-xs md:text-sm text-muted-foreground whitespace-nowrap">
                  ₹ {item.expected.toLocaleString()}
                </td>

                {/* Collected (colored by performance) */}
                <td
                  className={`px-4 py-3 md:py-4 text-right text-xs md:text-sm font-semibold whitespace-nowrap ${getStatusColor(
                    item.status,
                  )}`}
                >
                  ₹ {item.collected.toLocaleString()}
                </td>

                {/* Progress */}
                <td className="px-4 py-3 md:py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-full max-w-[120px] bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getBarColor(
                          item.status,
                        )}`}
                        style={{
                          width: `${Math.min(item.percentage, 100)}%`,
                        }}
                      />
                    </div>

                    <span
                      className={`text-xs font-medium ${getStatusColor(
                        item.status,
                      )}`}
                    >
                      {item.percentage.toFixed(0)}%
                    </span>
                  </div>
                </td>

                {/* Status icon */}
                <td className="px-4 py-3 md:py-4 text-center">
                  <div className="flex items-center justify-center">
                    <Icon
                      name={getStatusIcon(item.status)}
                      size={18}
                      className={getStatusColor(item.status)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyCollectionTable;
