import React from "react";
import Icon from "../../../components/AppIcon";

const DailyCollectionTable = () => {
  const dailyData = [
    {
      day: "Monday",
      expected: 15000,
      collected: 14500,
      percentage: 96.67,
      status: "good",
    },
    {
      day: "Tuesday",
      expected: 18000,
      collected: 17200,
      percentage: 95.56,
      status: "good",
    },
    {
      day: "Wednesday",
      expected: 16500,
      collected: 15800,
      percentage: 95.76,
      status: "good",
    },
    {
      day: "Thursday",
      expected: 17000,
      collected: 14500,
      percentage: 85.29,
      status: "warning",
    },
    {
      day: "Friday",
      expected: 19000,
      collected: 18500,
      percentage: 97.37,
      status: "good",
    },
    {
      day: "Saturday",
      expected: 14000,
      collected: 13200,
      percentage: 94.29,
      status: "good",
    },
    {
      day: "Sunday",
      expected: 12000,
      collected: 0,
      percentage: 0,
      status: "pending",
    },
  ];

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

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 md:p-5 lg:p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-base md:text-lg lg:text-xl font-semibold text-foreground">
            Daily Collection Summary
          </h2>
          <Icon name="Calendar" size={20} className="text-muted-foreground" />
        </div>
        <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">
          Week of January 13 - January 19, 2026
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
              <th className="px-4 py-3 text-right text-xs md:text-sm font-medium text-muted-foreground">
                %
              </th>
              <th className="px-4 py-3 text-center text-xs md:text-sm font-medium text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {dailyData?.map((item, index) => (
              <tr
                key={item?.day}
                className={`border-b border-border hover:bg-muted/20 transition-colors ${
                  index === dailyData?.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="px-4 py-3 md:py-4 text-xs md:text-sm font-medium text-foreground">
                  {item?.day}
                </td>
                <td className="px-4 py-3 md:py-4 text-right text-xs md:text-sm text-foreground whitespace-nowrap">
                  ${item?.expected?.toLocaleString()}
                </td>
                <td className="px-4 py-3 md:py-4 text-right text-xs md:text-sm font-medium text-foreground whitespace-nowrap">
                  ${item?.collected?.toLocaleString()}
                </td>
                <td
                  className={`px-4 py-3 md:py-4 text-right text-xs md:text-sm font-medium whitespace-nowrap ${getStatusColor(
                    item?.status,
                  )}`}
                >
                  {item?.percentage?.toFixed(2)}%
                </td>
                <td className="px-4 py-3 md:py-4 text-center">
                  <div className="flex items-center justify-center">
                    <Icon
                      name={getStatusIcon(item?.status)}
                      size={18}
                      className={getStatusColor(item?.status)}
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
