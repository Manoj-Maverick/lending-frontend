import React from "react";
import Icon from "../../../components/AppIcon";

const PaymentScheduleTab = ({ loanData }) => {
  const generatePaymentSchedule = () => {
    const schedule = [];
    const startDate = new Date(loanData?.disbursedDate);
    const monthlyEMI = loanData?.monthlyEMI;
    const monthlyInterestRate = loanData?.interestRate / 12 / 100;
    let remainingPrincipal = loanData?.loanAmount;

    for (let i = 1; i <= loanData?.tenure; i++) {
      const dueDate = new Date(startDate);
      dueDate?.setMonth(dueDate?.getMonth() + i);

      const interestAmount = remainingPrincipal * monthlyInterestRate;
      const principalAmount = monthlyEMI - interestAmount;
      remainingPrincipal -= principalAmount;

      const isPaid = i <= 5;
      const isOverdue = !isPaid && dueDate < new Date();

      schedule?.push({
        installmentNo: i,
        dueDate: dueDate?.toISOString()?.split("T")?.[0],
        emiAmount: monthlyEMI,
        principalAmount: principalAmount,
        interestAmount: interestAmount,
        remainingBalance: Math.max(0, remainingPrincipal),
        status: isPaid ? "Paid" : isOverdue ? "Overdue" : "Pending",
      });
    }

    return schedule;
  };

  const schedule = generatePaymentSchedule();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      Paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
      Pending:
        "bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400",
      Overdue: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
    };
    return colors?.[status] || colors?.Pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      Paid: "CheckCircle",
      Pending: "Clock",
      Overdue: "AlertCircle",
    };
    return icons?.[status] || "Clock";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Payment Schedule
        </h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-muted-foreground">Paid</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-muted-foreground">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-muted-foreground">Overdue</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">
                Installment
              </th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">
                Due Date
              </th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-foreground">
                EMI Amount
              </th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-foreground">
                Principal
              </th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-foreground">
                Interest
              </th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-foreground">
                Balance
              </th>
              <th className="text-center px-4 py-3 text-sm font-semibold text-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {schedule?.map((item) => (
              <tr
                key={item?.installmentNo}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3 text-sm font-medium text-foreground">
                  #{item?.installmentNo}
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {formatDate(item?.dueDate)}
                </td>
                <td className="px-4 py-3 text-sm text-foreground text-right font-medium">
                  {formatCurrency(item?.emiAmount)}
                </td>
                <td className="px-4 py-3 text-sm text-foreground text-right">
                  {formatCurrency(item?.principalAmount)}
                </td>
                <td className="px-4 py-3 text-sm text-foreground text-right">
                  {formatCurrency(item?.interestAmount)}
                </td>
                <td className="px-4 py-3 text-sm text-foreground text-right font-medium">
                  {formatCurrency(item?.remainingBalance)}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item?.status)}`}
                  >
                    <Icon name={getStatusIcon(item?.status)} size={12} />
                    {item?.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentScheduleTab;
