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
      direction: prev?.key === key && prev?.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortConfig?.key === "date") {
      return sortConfig?.direction === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    }
    if (sortConfig?.key === "amount") {
      return sortConfig?.direction === "asc" ? a?.amount - b?.amount : b?.amount - a?.amount;
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
    <div className="bg-card rounded-2xl border border-border shadow-sm p-4 md:p-6 mb-5 md:mb-6">
      <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4 md:mb-6">Recent Transactions</h2>

      <div className="hidden md:block overflow-x-auto px-2 pb-2">
        <table className="w-full min-w-[680px] border-separate border-spacing-y-2">
          <thead className="bg-muted/30">
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center gap-2">
                  Date
                  <Icon
                    name={sortConfig?.key === "date" && sortConfig?.direction === "asc" ? "ChevronUp" : "ChevronDown"}
                    size={14}
                  />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Client</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center gap-2">
                  Amount
                  <Icon
                    name={sortConfig?.key === "amount" && sortConfig?.direction === "asc" ? "ChevronUp" : "ChevronDown"}
                    size={14}
                  />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((transaction) => (
              <tr
                key={transaction?.id}
                className="bg-background border border-border shadow-sm hover:bg-muted/20 hover:shadow-md transition-all"
              >
                <td className="px-4 py-3 rounded-l-lg text-sm text-foreground">
                  {new Date(transaction.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  <div className="line-clamp-1">{transaction?.clientName}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{transaction?.loanCode}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Icon
                      name={getTypeIcon(transaction?.type)}
                      size={16}
                      color={transaction?.type === "Payment" ? "var(--color-success)" : "var(--color-primary)"}
                    />
                    <span className="text-sm text-foreground">{transaction?.type}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-foreground">
                  Rs {transaction?.amount?.toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3 rounded-r-lg">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction?.status)}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {transaction?.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {sortedTransactions.map((transaction) => (
          <div key={transaction?.id} className="bg-background rounded-xl border border-border p-3 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground text-sm">{transaction?.clientName}</p>
                <p className="text-xs text-muted-foreground">{transaction?.loanCode}</p>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction?.status)}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                {transaction?.status}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon
                  name={getTypeIcon(transaction?.type)}
                  size={15}
                  color={transaction?.type === "Payment" ? "var(--color-success)" : "var(--color-primary)"}
                />
                {transaction?.type}
              </div>
              <p className="font-semibold text-foreground">Rs {transaction?.amount?.toLocaleString("en-IN")}</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {new Date(transaction.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
