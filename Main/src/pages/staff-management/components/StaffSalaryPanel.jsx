import React, { useMemo, useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { useUIContext } from "context/UIContext";
import { useSaveStaffSalary, useStaffSalary } from "hooks/staff/useStaffSalary";

const formatCurrency = (value) =>
  `Rs ${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const StaffSalaryPanel = ({ staff = [], filters = {} }) => {
  const { showToast } = useUIContext();
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [formData, setFormData] = useState({
    salary_amount: "",
    bonus: "",
    deductions: "",
    status: "UNPAID",
    paid_date: "",
  });

  const staffOptions = useMemo(
    () =>
      (staff || []).map((member) => ({
        value: String(member.id),
        label: `${member.name} • ${member.branch || "Unassigned"}`,
      })),
    [staff],
  );

  const selectedStaff = useMemo(
    () => staff.find((member) => String(member.id) === String(selectedStaffId)),
    [staff, selectedStaffId],
  );

  const { data: salaryResponse, isLoading } = useStaffSalary({
    branch_id: filters.branch !== "all" ? filters.branch : undefined,
    role: filters.role,
    employee_id: selectedStaffId || undefined,
    month,
  });
  const saveSalaryMutation = useSaveStaffSalary();
  const salaryRecords = salaryResponse?.data || [];

  const totalPayroll = salaryRecords.reduce(
    (sum, record) => sum + Number(record?.netAmount || 0),
    0,
  );
  const averageSalary =
    salaryRecords.length > 0 ? totalPayroll / salaryRecords.length : 0;
  const paidPayroll = salaryRecords
    .filter((record) => record?.status === "PAID")
    .reduce((sum, record) => sum + Number(record?.netAmount || 0), 0);
  const unpaidCount = salaryRecords.filter(
    (record) => record?.status !== "PAID",
  ).length;

  const statCards = [
    {
      label: "Recorded Payroll",
      value: formatCurrency(totalPayroll),
      icon: "Wallet",
      tone: "bg-primary/10 text-primary",
    },
    {
      label: "Average Salary",
      value: formatCurrency(averageSalary),
      icon: "BarChart3",
      tone: "bg-emerald-500/10 text-emerald-600",
    },
    {
      label: "Paid Payroll",
      value: formatCurrency(paidPayroll),
      icon: "BadgeCheck",
      tone: "bg-violet-500/10 text-violet-600",
    },
    {
      label: "Unpaid Records",
      value: unpaidCount,
      icon: "Clock3",
      tone: "bg-amber-500/10 text-amber-600",
    },
  ];

  const handleSelectStaff = (value) => {
    setSelectedStaffId(value);
    const member = staff.find((item) => String(item.id) === String(value));
    setFormData((prev) => ({
      ...prev,
      salary_amount: member?.salary ? String(member.salary) : "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedStaff) {
      showToast?.("Select a staff member first", "warning");
      return;
    }

    try {
      await saveSalaryMutation.mutateAsync({
        employee_id: Number(selectedStaff.id),
        branch_id: Number(selectedStaff.branchId),
        salary_amount: Number(formData.salary_amount || 0),
        bonus: Number(formData.bonus || 0),
        deductions: Number(formData.deductions || 0),
        month,
        status: formData.status,
        paid_date: formData.paid_date || null,
      });

      showToast?.("Salary record saved successfully", "success");
    } catch (error) {
      showToast?.(error?.message || "Failed to save salary record", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </p>
                <p className="mt-2 text-3xl font-semibold text-foreground">
                  {card.value}
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

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-card p-5 shadow-sm"
      >
        <div className="mb-4 flex items-center gap-2">
          <Icon name="Landmark" size={18} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Record Monthly Salary
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
          <Select
            label="Staff Member"
            options={staffOptions}
            value={selectedStaffId}
            onChange={handleSelectStaff}
            searchable
            placeholder="Select staff"
            className="xl:col-span-2"
          />
          <Input
            label="Salary Month"
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <Input
            label="Base Salary"
            type="number"
            min="0"
            step="0.01"
            value={formData.salary_amount}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                salary_amount: e.target.value,
              }))
            }
          />
          <Input
            label="Bonus"
            type="number"
            min="0"
            step="0.01"
            value={formData.bonus}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, bonus: e.target.value }))
            }
          />
          <Input
            label="Deductions"
            type="number"
            min="0"
            step="0.01"
            value={formData.deductions}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, deductions: e.target.value }))
            }
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Select
            label="Payment Status"
            options={[
              { value: "UNPAID", label: "Unpaid" },
              { value: "PAID", label: "Paid" },
              { value: "PARTIAL", label: "Partial" },
            ]}
            value={formData.status}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, status: value }))
            }
          />
          <Input
            label="Paid Date"
            type="date"
            value={formData.paid_date}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, paid_date: e.target.value }))
            }
          />
          <div className="rounded-xl border border-border bg-background px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Net Salary
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {formatCurrency(
                Number(formData.salary_amount || 0) +
                  Number(formData.bonus || 0) -
                  Number(formData.deductions || 0),
              )}
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button type="submit" loading={saveSalaryMutation.isPending}>
            Save Salary Record
          </Button>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border p-4 md:p-5">
          <h2 className="text-lg font-semibold text-foreground">
            Salary Records
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Monthly payroll records for the selected staff scope.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/40">
              <tr>
                {["Staff", "Role", "Branch", "Month", "Net", "Status", "Paid Date"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    Loading salary records...
                  </td>
                </tr>
              ) : salaryRecords.length > 0 ? (
                salaryRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">
                      {record.employeeName}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {record.role}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {record.branch || "Unassigned"}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {record.month}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-foreground">
                      {formatCurrency(record.netAmount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {record.status}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {record.paidDate || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No salary records available for this month.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffSalaryPanel;
