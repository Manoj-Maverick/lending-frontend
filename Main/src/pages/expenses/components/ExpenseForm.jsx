import React, { useEffect, useMemo, useState } from "react";
import Button from "components/ui/Button";
import Input from "components/ui/Input";
import Select from "components/ui/Select";
import { useCreateExpense } from "hooks/expenses/useCreateExpense";
import { useBranchesList } from "hooks/branches/useBranchesList";
import { useAuth } from "auth/AuthContext";
import { useUIContext } from "context/UIContext";

const getToday = () => new Date().toISOString().slice(0, 10);

const ExpenseForm = ({ categories = [], branchId = "", onCreated }) => {
  const { user } = useAuth();
  const { showToast } = useUIContext();
  const createExpenseMutation = useCreateExpense();
  const { data: branchesResponse } = useBranchesList({
    page: 1,
    limit: 100,
    search: "",
    status: "all",
    sortBy: "name-asc",
  });

  const branchOptions = useMemo(
    () =>
      (branchesResponse?.data ?? []).map((branch) => ({
        value: String(branch.id),
        label: branch.branch_name,
      })),
    [branchesResponse?.data],
  );

  const [formData, setFormData] = useState({
    branch_id: branchId || "",
    category_id: "",
    amount: "",
    expense_date: getToday(),
    notes: "",
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, branch_id: branchId || prev.branch_id }));
  }, [branchId]);

  const categoryOptions = categories.map((category) => ({
    value: String(category.id),
    label: `${category.name}${category.is_fixed ? " • Fixed" : " • Variable"}`,
  }));

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.branch_id || !formData.category_id || !formData.amount) {
      showToast?.("Please fill all required expense fields", "warning");
      return;
    }

    try {
      await createExpenseMutation.mutateAsync({
        branch_id: Number(formData.branch_id),
        category_id: Number(formData.category_id),
        amount: Number(formData.amount),
        expense_date: formData.expense_date,
        notes: formData.notes,
      });

      showToast?.("Expense saved successfully", "success");
      setFormData({
        branch_id: branchId || "",
        category_id: "",
        amount: "",
        expense_date: getToday(),
        notes: "",
      });
      onCreated?.();
    } catch (error) {
      showToast?.(error?.message || "Failed to save expense", "error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Add Expense</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Record one outgoing branch transaction at a time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Select
          label="Branch"
          value={formData.branch_id}
          onChange={(value) => handleChange("branch_id", value)}
          options={branchOptions}
          disabled={user?.role !== "ADMIN"}
          placeholder="Select branch"
          required
        />

        <Select
          label="Category"
          value={formData.category_id}
          onChange={(value) => handleChange("category_id", value)}
          options={categoryOptions}
          placeholder="Select category"
          required
        />

        <Input
          label="Amount"
          type="number"
          min="0"
          step="0.01"
          value={formData.amount}
          onChange={(event) => handleChange("amount", event.target.value)}
          placeholder="Enter amount"
          required
        />

        <Input
          label="Expense Date"
          type="date"
          value={formData.expense_date}
          onChange={(event) =>
            handleChange("expense_date", event.target.value)
          }
          required
        />
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-foreground">
          Notes
        </label>
        <textarea
          className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2"
          value={formData.notes}
          onChange={(event) => handleChange("notes", event.target.value)}
          placeholder="Optional remarks, vendor info, or reason"
        />
      </div>

      <div className="mt-5 flex justify-end">
        <Button type="submit" loading={createExpenseMutation.isPending}>
          Save Expense
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;
