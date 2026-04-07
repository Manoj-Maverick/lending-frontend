import React from "react";
import Icon from "components/AppIcon";

const formatCurrency = (value) =>
  `\u20B9${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const ExpenseSummary = ({ data, isLoading }) => {
  const cards = [
    {
      label: "Direct Expenses",
      value: formatCurrency(data?.expense_total),
      icon: "Receipt",
      tone: "bg-blue-50 text-blue-600",
    },
    {
      label: "Salary Total",
      value: formatCurrency(data?.salary_total),
      icon: "Landmark",
      tone: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Fixed Expenses",
      value: formatCurrency(data?.fixed_expense),
      icon: "Building",
      tone: "bg-amber-50 text-amber-600",
    },
    {
      label: "Variable Expenses",
      value: formatCurrency(data?.variable_expense),
      icon: "Activity",
      tone: "bg-rose-50 text-rose-600",
    },
    {
      label: "Overall Total",
      value: formatCurrency(data?.total_expense),
      icon: "Wallet",
      tone: "bg-violet-50 text-violet-600",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {card.label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {isLoading ? "Loading..." : card.value}
              </p>
            </div>
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.tone}`}
            >
              <Icon name={card.icon} size={20} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseSummary;
