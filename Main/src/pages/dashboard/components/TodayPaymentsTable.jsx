import React from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import { useTodayPayments } from "hooks/dashboard/useTodayPayments";
import { useNavigate } from "react-router-dom";
import { useUIContext } from "context/UIContext";

const TodayPaymentsTable = () => {
  const { selectedBranch } = useUIContext();
  const navigate = useNavigate();

  const {
    data: todayPayments = [],
    isLoading,
    isError,
  } = useTodayPayments(selectedBranch?.id || "all");

  const getStatusBadge = (status) => {
    const statusConfig = {
      PAID: {
        label: "Paid",
        className:
          "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400",
        icon: "CheckCircle2",
      },
      PENDING: {
        label: "Pending",
        className:
          "bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400",
        icon: "Clock",
      },
      DELAYED: {
        label: "Overdue",
        className:
          "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400",
        icon: "AlertCircle",
      },
    };

    const config = statusConfig?.[status] || statusConfig?.PENDING;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${config.className}`}
      >
        <Icon name={config.icon} size={12} />
        {config.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Loading today's payments...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load payments
      </div>
    );
  }

  return (
    <div className="glass-surface-soft motion-hover-lift bg-card border border-border rounded-lg overflow-hidden mb-5">
      {/* Header */}
      <div className="p-4 md:p-5 lg:p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base md:text-lg lg:text-xl font-semibold text-foreground">
              Today's Payments
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              {todayPayments?.data.length} payments due today
            </p>
          </div>

          <Button variant="outline" size="sm" iconName="Download">
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-4 py-3 text-left text-xs md:text-sm font-medium text-muted-foreground">
                Borrower
              </th>
              <th className="px-4 py-3 text-left text-xs md:text-sm font-medium text-muted-foreground">
                Loan Code
              </th>
              <th className="px-4 py-3 text-left text-xs md:text-sm font-medium text-muted-foreground">
                Branch
              </th>
              <th className="px-4 py-3 text-right text-xs md:text-sm font-medium text-muted-foreground">
                Due Amount
              </th>
              <th className="px-4 py-3 text-center text-xs md:text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-center text-xs md:text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {/* Data Rows */}
            {todayPayments?.data.map((payment, index) => (
              <tr
                key={payment.schedule_id}
                className={`border-b border-border hover:bg-muted/20 transition-colors ${
                  index === todayPayments?.data.length - 1 ? "border-b-0" : ""
                }`}
              >
                {/* Borrower */}
                <td className="px-4 py-3 md:py-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={
                          payment.avatar || "https://i.pravatar.cc/150?img=10"
                        }
                        alt={payment.borrower_name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs md:text-sm font-medium text-foreground truncate">
                        {payment.borrower_name}
                      </p>

                      <p className="text-xs text-muted-foreground truncate">
                        {payment.customer_code}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Loan Code */}
                <td className="px-4 py-3 md:py-4 text-xs md:text-sm text-foreground">
                  {payment.loan_code}
                </td>

                {/* Branch */}
                <td className="px-4 py-3 md:py-4 text-xs md:text-sm text-muted-foreground">
                  {payment.branch_name}
                </td>

                {/* Amount */}
                <td className="px-4 py-3 md:py-4 text-right text-xs md:text-sm font-medium text-foreground whitespace-nowrap">
                  ₹ {Number(payment.due_amount).toLocaleString()}
                </td>

                {/* Status */}
                <td className="px-4 py-3 md:py-4 text-center">
                  {getStatusBadge(payment.status)}
                </td>

                {/* Actions */}
                <td className="px-4 py-3 md:py-4">
                  <div className="flex items-center justify-center gap-1 md:gap-2">
                    {payment.status !== "PAID" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="IndianRupee"
                        onClick={() =>
                          navigate(`/loan-details/${payment.loan_id}?pay=true`)
                        }
                      >
                        Pay
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={() => {
                        (navigate(`/loan-details/${payment.loan_id}`),
                          {
                            state: { openPayment: true },
                          });
                      }}
                    >
                      View
                    </Button>
                  </div>
                </td>
              </tr>
            ))}

            {/* Animated Empty State */}
            {todayPayments?.data.length === 0 && (
              <tr>
                <td colSpan="6" className="py-12">
                  <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                    <div className="animate-bounce">
                      <Icon name="Wallet" size={36} className="opacity-70" />
                    </div>

                    <p className="text-sm md:text-base font-medium animate-pulse">
                      No payments due today
                    </p>

                    <p className="text-xs text-muted-foreground/70">
                      Looks like all collections are clear for today 🎉
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TodayPaymentsTable;
