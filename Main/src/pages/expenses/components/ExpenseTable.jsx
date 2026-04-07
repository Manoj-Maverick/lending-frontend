import React from "react";
import Button from "components/ui/Button";

const formatCurrency = (value) =>
  `\u20B9${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const ExpenseTable = ({
  expenses = [],
  pagination,
  isLoading,
  page,
  onPageChange,
}) => {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-lg font-semibold text-foreground">Expense Entries</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Review every recorded branch expense with category and creator detail.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Branch
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Type
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Notes
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Created By
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  Loading expenses...
                </td>
              </tr>
            ) : expenses.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  No expenses found for the selected filters.
                </td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 text-sm text-foreground">
                    {expense.expense_date}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {expense.branch_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {expense.category_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {expense.is_fixed ? "Fixed" : "Variable"}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-foreground">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {expense.notes || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {expense.created_by_name || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-border px-5 py-4">
        <p className="text-sm text-muted-foreground">
          Page {pagination?.page || page} of {pagination?.totalPages || 1}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={(pagination?.page || page) <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={(pagination?.page || page) >= (pagination?.totalPages || 1)}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTable;
