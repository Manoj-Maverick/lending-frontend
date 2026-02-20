import React from "react";
import Icon from "../../../components/AppIcon";
import { useGetLoanSchedule } from "hooks/loans.details.page/useGetLoanSchedule";

const PaymentScheduleTab = ({ loanId }) => {
  const { data, isLoading, isError, error } = useGetLoanSchedule(loanId);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      PAID: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
      PENDING:
        "bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400",
      DELAYED: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
    };
    return colors[status] || colors.PENDING;
  };

  const getStatusIcon = (status) => {
    const icons = {
      PAID: "CheckCircle",
      PENDING: "Clock",
      DELAYED: "AlertCircle",
    };
    return icons[status] || "Clock";
  };

  if (isLoading) {
    return <div className="p-4 text-muted-foreground">Loading schedule...</div>;
  }

  if (isError) {
    return (
      <div className="p-4 text-destructive">
        Failed to load schedule: {error.message}
      </div>
    );
  }

  const schedule = data || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Payment Schedule
        </h3>
        <div className="flex items-center gap-4 text-sm">
          <Legend color="bg-emerald-500" label="Paid" />
          <Legend color="bg-orange-500" label="Pending" />
          <Legend color="bg-red-500" label="Overdue" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <Th>Installment</Th>
              <Th>Due Date</Th>
              <Th align="right">EMI Amount</Th>
              <Th align="right">Fine</Th>
              <Th align="right">Total Due</Th>
              <Th align="center">Status</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {schedule.map((item) => (
              <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-foreground">
                  #{item.installment_no}
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {formatDate(item.due_date)}
                </td>
                <td className="px-4 py-3 text-sm text-right font-medium">
                  {formatCurrency(item.due_amount)}
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  {formatCurrency(item.fine_amount)}
                </td>
                <td className="px-4 py-3 text-sm text-right font-medium">
                  {formatCurrency(
                    Number(item.due_amount) + Number(item.fine_amount || 0),
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      item.status,
                    )}`}
                  >
                    <Icon name={getStatusIcon(item.status)} size={12} />
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}

            {schedule.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-muted-foreground"
                >
                  No schedule found for this loan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Th = ({ children, align = "left" }) => (
  <th
    className={`text-${align} px-4 py-3 text-sm font-semibold text-foreground`}
  >
    {children}
  </th>
);

const Legend = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 rounded-full ${color}`} />
    <span className="text-muted-foreground">{label}</span>
  </div>
);

export default PaymentScheduleTab;
