import React, { useState } from "react";
import Icon from "../../../components/AppIcon";

const RecentTransactions = ({ transactions }) => {
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev?.key === key && prev?.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedTransactions = [...transactions]?.sort((a, b) => {
    if (sortConfig?.key === "date") {
      return sortConfig?.direction === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    }
    if (sortConfig?.key === "amount") {
      return sortConfig?.direction === "asc"
        ? a?.amount - b?.amount
        : b?.amount - a?.amount;
    }
    return 0;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-success/10 text-success";
      case "Pending":
        return "bg-warning/10 text-warning";
      case "Failed":
        return "bg-error/10 text-error";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Payment":
        return "ArrowDownCircle";
      case "Disbursement":
        return "ArrowUpCircle";
      default:
        return "Circle";
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-elevation-sm p-4 md:p-6 mb-4 md:mb-6">
      <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4 md:mb-6">
        Recent Transactions
      </h2>
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/30">
              <tr>
                <th
                  className="px-4 py-3 text-left text-xs md:text-sm font-medium text-muted-foreground cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center gap-2">
                    Date
                    <Icon
                      name={
                        sortConfig?.key === "date" &&
                        sortConfig?.direction === "asc"
                          ? "ChevronUp"
                          : "ChevronDown"
                      }
                      size={14}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs md:text-sm font-medium text-muted-foreground">
                  Client
                </th>
                <th className="px-4 py-3 text-left text-xs md:text-sm font-medium text-muted-foreground">
                  Type
                </th>
                <th
                  className="px-4 py-3 text-left text-xs md:text-sm font-medium text-muted-foreground cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center gap-2">
                    Amount
                    <Icon
                      name={
                        sortConfig?.key === "amount" &&
                        sortConfig?.direction === "asc"
                          ? "ChevronUp"
                          : "ChevronDown"
                      }
                      size={14}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs md:text-sm font-medium text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {sortedTransactions?.map((transaction) => (
                <tr
                  key={transaction?.id}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-foreground">
                    {new Date(transaction.date)?.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 md:py-4 text-xs md:text-sm text-foreground">
                    <div className="line-clamp-1">
                      {transaction?.clientName}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {transaction?.loanCode}
                    </div>
                  </td>
                  <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Icon
                        name={getTypeIcon(transaction?.type)}
                        size={16}
                        color={
                          transaction?.type === "Payment"
                            ? "var(--color-success)"
                            : "var(--color-primary)"
                        }
                      />
                      <span className="text-xs md:text-sm text-foreground">
                        {transaction?.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium text-foreground">
                    ₹{transaction?.amount?.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(transaction?.status)}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {transaction?.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentTransactions;
