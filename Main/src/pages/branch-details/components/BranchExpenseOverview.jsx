import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { useExpenseSummary } from "hooks/expenses/useExpenseSummary";
import { useExpenses } from "hooks/expenses/useExpenses";

const getMonthStart = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
};

const getToday = () => new Date().toISOString().slice(0, 10);

const formatCurrency = (value) =>
  `Rs ${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const BranchExpenseOverview = ({ branchId }) => {
  const navigate = useNavigate();
  const filters = {
    branch_id: branchId,
    start_date: getMonthStart(),
    end_date: getToday(),
  };

  const { data: summaryResponse, isLoading: isSummaryLoading } =
    useExpenseSummary(filters);
  const { data: expensesResponse, isLoading: isExpensesLoading } = useExpenses({
    ...filters,
    page: 1,
    limit: 5,
  });

  const summary = summaryResponse?.data;
  const expenses = expensesResponse?.data ?? [];

  const statCards = [
    {
      label: "Total Expenses",
      value: formatCurrency(summary?.total_expense),
      icon: "Wallet",
      tone: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "Direct Spend",
      value: formatCurrency(summary?.expense_total),
      icon: "Receipt",
      tone: "bg-amber-500/10 text-amber-600",
    },
    {
      label: "Salary Cost",
      value: formatCurrency(summary?.salary_total),
      icon: "Landmark",
      tone: "bg-emerald-500/10 text-emerald-600",
    },
    {
      label: "Fixed vs Variable",
      value: `${formatCurrency(summary?.fixed_expense)} / ${formatCurrency(summary?.variable_expense)}`,
      icon: "Scale",
      tone: "bg-violet-500/10 text-violet-600",
    },
  ];

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-4 md:p-6 mb-5 md:mb-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-foreground">
            Branch Expenses
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Month-to-date expense visibility for this branch, including salary.
          </p>
        </div>
        <Button
          variant="outline"
          iconName="ArrowRight"
          iconPosition="right"
          onClick={() => navigate("/expenses")}
          className="w-full md:w-auto"
        >
          Open Expense Page
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-background p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.tone}`}
              >
                <Icon name={card.icon} size={20} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="mt-2 text-lg md:text-xl font-semibold text-foreground break-words">
              {isSummaryLoading ? "Loading..." : card.value}
            </p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="mb-3 text-base font-semibold text-foreground">
          Recent Expense Entries
        </h3>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[700px] border-separate border-spacing-y-2">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Type
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {isExpensesLoading ? (
                <tr className="bg-background">
                  <td
                    colSpan={5}
                    className="px-4 py-4 text-sm text-muted-foreground"
                  >
                    Loading expense entries...
                  </td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr className="bg-background">
                  <td
                    colSpan={5}
                    className="px-4 py-4 text-sm text-muted-foreground"
                  >
                    No expense entries found for this branch in the selected
                    period.
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="bg-background border border-border shadow-sm"
                  >
                    <td className="px-4 py-3 rounded-l-lg text-sm text-foreground">
                      {expense.expense_date}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {expense.category_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {expense.is_fixed ? "Fixed" : "Variable"}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-foreground">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-4 py-3 rounded-r-lg text-sm text-muted-foreground">
                      {expense.notes || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 md:hidden">
          {isExpensesLoading ? (
            <div className="rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground">
              Loading expense entries...
            </div>
          ) : expenses.length === 0 ? (
            <div className="rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground">
              No expense entries found for this branch in the selected period.
            </div>
          ) : (
            expenses.map((expense) => (
              <div
                key={expense.id}
                className="rounded-xl border border-border bg-background p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">
                      {expense.category_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {expense.expense_date} •{" "}
                      {expense.is_fixed ? "Fixed" : "Variable"}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {expense.notes || "No notes"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BranchExpenseOverview;
