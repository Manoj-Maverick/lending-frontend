import React from "react";
import Icon from "../../../components/AppIcon";
import { useLoanSchedule } from "hooks/loans/useLoanDetails";
import { TableCardSkeleton } from "components/ui/Skeleton";

const STATUS_STYLES = {
  PAID: {
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    dot: "bg-emerald-500",
    icon: "CheckCircle",
  },
  PENDING: {
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    dot: "bg-amber-500",
    icon: "Clock",
  },
  OVERDUE: {
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
    dot: "bg-rose-500",
    icon: "AlertTriangle",
  },
  DELAYED: {
    badge:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    dot: "bg-violet-500",
    icon: "AlertCircle",
  },

  // ⭐ NEW UPCOMING STATUS
  UPCOMING: {
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
    dot: "bg-sky-500",
    icon: "Calendar",
  },
};

const PaymentScheduleTab = ({ loanId }) => {
  const { data, isLoading, isError, error } = useLoanSchedule(loanId);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  if (isLoading) {
    return <TableCardSkeleton rows={6} columns={6} showAvatar={false} />;
  }

  if (isError) {
    return (
      <div className="p-4 text-destructive">
        Failed to load schedule: {error.message}
      </div>
    );
  }

  const schedule = data || [];

  // ⭐ Find next EMI (first pending/delayed after today)
  const today = new Date();

  const nextEmi = schedule.find(
    (s) => s.status === "PENDING" && new Date(s.due_date) >= today,
  );

  const getStatus = (item) => {
    if (nextEmi && item.id === nextEmi.id) {
      return STATUS_STYLES.UPCOMING;
    }

    return STATUS_STYLES[item.status] || STATUS_STYLES.PENDING;
  };

  const formatStatusLabel = (item) => {
    if (nextEmi && item.id === nextEmi.id) return "Upcoming";
    return item.status?.charAt(0) + item.status?.slice(1).toLowerCase();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-lg font-semibold text-foreground">
          Payment Schedule
        </h3>

        <div className="flex items-center gap-4 text-sm">
          <Legend color="bg-emerald-500" label="Paid" />
          <Legend color="bg-amber-500" label="Pending" />
          <Legend color="bg-sky-500" label="Upcoming EMI" />
          <Legend color="bg-rose-500" label="Overdue" />
          <Legend color="bg-violet-500" label="Delayed" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="w-full text-sm">
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
            {schedule.map((item) => {
              const status = getStatus(item);

              return (
                <tr
                  key={item.id}
                  className={`transition-colors ${
                    nextEmi && item.id === nextEmi.id
                      ? "bg-sky-50 dark:bg-sky-900/10"
                      : "hover:bg-muted/30"
                  }`}
                >
                  <td className="px-4 py-3 font-medium">
                    #{item.installment_no}
                  </td>

                  <td className="px-4 py-3">{formatDate(item.due_date)}</td>

                  <td className="px-4 py-3 text-right font-medium">
                    {formatCurrency(item.due_amount)}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {formatCurrency(item.fine_amount)}
                  </td>

                  <td className="px-4 py-3 text-right font-semibold">
                    {formatCurrency(
                      Number(item.due_amount) + Number(item.fine_amount || 0),
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${status.badge}`}
                    >
                      <Icon name={status.icon} size={12} />
                      {formatStatusLabel(item)}
                    </span>
                  </td>
                </tr>
              );
            })}

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
  <th className={`px-4 py-3 text-sm font-semibold text-${align}`}>
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
