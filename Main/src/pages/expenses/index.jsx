import React, { useMemo, useState } from "react";
import Icon from "components/AppIcon";
import PageShell from "components/ui/PageShell";
import Button from "components/ui/Button";
import { useAuth } from "auth/AuthContext";
import { useUIContext } from "context/UIContext";
import { useExpenses } from "hooks/expenses/useExpenses";
import { useExpenseSummary } from "hooks/expenses/useExpenseSummary";
import { useExpenseCategories } from "hooks/expenses/useExpenseCategories";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseFilters from "./components/ExpenseFilters";
import ExpenseSummary from "./components/ExpenseSummary";
import ExpenseTable from "./components/ExpenseTable";

const getMonthStart = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
};

const getToday = () => new Date().toISOString().slice(0, 10);

const ExpensesPage = () => {
  const { user } = useAuth();
  const { selectedBranch } = useUIContext();
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const resolvedBranchId = useMemo(() => {
    if (user?.role !== "ADMIN") {
      return user?.branchId ? String(user.branchId) : "";
    }

    if (selectedBranch?.id && selectedBranch.id !== "all") {
      return String(selectedBranch.id);
    }

    return "";
  }, [selectedBranch?.id, user?.branchId, user?.role]);

  const [filters, setFilters] = useState({
    branch_id: resolvedBranchId,
    category_id: "",
    start_date: getMonthStart(),
    end_date: getToday(),
  });

  React.useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      branch_id: resolvedBranchId,
    }));
  }, [resolvedBranchId]);

  const expenseFilters = {
    ...filters,
    page,
    limit: 10,
  };

  const { data: categoriesResponse } = useExpenseCategories();
  const { data: expensesResponse, isLoading, isError, error } =
    useExpenses(expenseFilters);
  const { data: summaryResponse, isLoading: isSummaryLoading } =
    useExpenseSummary(filters);

  const expenses = expensesResponse?.data ?? [];
  const pagination = expensesResponse?.pagination;
  const categories = categoriesResponse?.data ?? [];
  const summary = summaryResponse?.data;

  const handleFilterChange = (key, value) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  if (isError) {
    return (
      <PageShell className="pb-4">
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
          Failed to load expenses: {error?.message}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell className="pb-4">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Icon name="Receipt" size={14} />
            Branch Expense Control
          </div>
          <h1 className="flex items-center gap-3 text-3xl font-semibold text-foreground md:text-4xl">
            <Icon name="Wallet" size={32} className="text-primary" />
            Expense Management
          </h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Track outgoing branch spend, review category-wise totals, and keep
            salary separate while still counting it in overall expense analysis.
          </p>
        </div>

        <Button
          variant={showForm ? "outline" : "default"}
          iconName={showForm ? "X" : "Plus"}
          iconPosition="left"
          onClick={() => setShowForm((prev) => !prev)}
          className="w-full sm:w-auto"
        >
          {showForm ? "Close Form" : "Add Expense"}
        </Button>
      </div>

      {showForm && (
        <ExpenseForm
          categories={categories}
          branchId={resolvedBranchId}
          onCreated={() => setShowForm(false)}
        />
      )}

      <ExpenseFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        categories={categories}
        branchLocked={user?.role !== "ADMIN"}
      />

      <ExpenseSummary data={summary} isLoading={isSummaryLoading} />

      <ExpenseTable
        expenses={expenses}
        pagination={pagination}
        isLoading={isLoading}
        page={page}
        onPageChange={setPage}
      />
    </PageShell>
  );
};

export default ExpensesPage;
