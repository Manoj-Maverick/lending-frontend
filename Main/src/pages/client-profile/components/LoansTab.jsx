import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { useCustomerLoans } from "hooks/clients.profile.page.hooks/useGetClientLoans";

const LoansTab = ({ customerId, onCreateLoan }) => {
  const navigate = useNavigate();

  // 🔌 Fetch loans + stats using hook
  const { data, isLoading, isError, error } = useCustomerLoans(customerId);

  if (isLoading) {
    return <div className="p-6 text-muted-foreground">Loading loans...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-destructive">
        Failed to load loans: {error.message}
      </div>
    );
  }

  // API returns: { loans, stats }
  const rawLoans = data?.loans || [];
  const stats = data?.stats || {
    totalLoans: 0,
    activeLoans: 0,
    totalDisbursed: 0,
    totalOutstanding: 0,
  };

  // 🧱 Map backend fields to UI-friendly shape
  const loans = rawLoans.map((l) => ({
    id: l.id,
    loanCode: l.loan_code,
    principal: Number(l.principal_amount),
    interestRate: Number(l.interest_amount), // or compute % if needed
    totalPayable: Number(l.total_payable),
    outstanding: Number(l.outstanding),
    status: l.status, // 'ACTIVE', 'CLOSED', 'FORECLOSED'
    startDate: l.start_date,
  }));

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: "bg-success/10 text-success",
      CLOSED: "bg-primary/10 text-primary",
      DELAYED: "bg-warning/10 text-warning",
      FORECLOSED: "bg-destructive/10 text-destructive",
    };
    return colors?.[status] || "bg-muted/10 text-muted-foreground";
  };

  const getStatusIcon = (status) => {
    const icons = {
      ACTIVE: "CheckCircle",
      CLOSED: "Lock",
      DELAYED: "AlertCircle",
      FORECLOSED: "XCircle",
    };
    return icons?.[status] || "Circle";
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl md:text-2xl font-semibold text-foreground">
            Loan Accounts
          </h3>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            View and manage client loan accounts
          </p>
        </div>
        <Button
          variant="default"
          iconName="Plus"
          iconPosition="left"
          onClick={onCreateLoan}
          className="w-full sm:w-auto"
        >
          Create New Loan
        </Button>
      </div>

      {/* 📊 Loan Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-card rounded-lg p-4 md:p-6 shadow-elevation-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="Wallet" size={20} color="var(--color-primary)" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">
              Total Loans
            </p>
          </div>
          <p className="text-2xl md:text-3xl font-semibold text-foreground">
            {stats.totalLoans}
          </p>
        </div>

        <div className="bg-card rounded-lg p-4 md:p-6 shadow-elevation-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Icon name="CheckCircle" size={20} color="var(--color-success)" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">
              Active Loans
            </p>
          </div>
          <p className="text-2xl md:text-3xl font-semibold text-foreground">
            {stats.activeLoans}
          </p>
        </div>

        <div className="bg-card rounded-lg p-4 md:p-6 shadow-elevation-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Icon name="DollarSign" size={20} color="var(--color-accent)" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">
              Total Disbursed
            </p>
          </div>
          <p className="text-2xl md:text-3xl font-semibold text-foreground">
            ₹{stats.totalDisbursed.toLocaleString()}
          </p>
        </div>

        <div className="bg-card rounded-lg p-4 md:p-6 shadow-elevation-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Icon name="TrendingUp" size={20} color="var(--color-warning)" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">
              Outstanding
            </p>
          </div>
          <p className="text-2xl md:text-3xl font-semibold text-foreground">
            ₹{stats.totalOutstanding.toLocaleString()}
          </p>
        </div>
      </div>

      {/* 📋 Loans List */}
      {loans.length === 0 ? (
        <div className="bg-card rounded-lg p-8 md:p-12 text-center shadow-elevation-sm">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-muted/30 rounded-full flex items-center justify-center mb-4">
            <Icon name="Wallet" size={32} className="text-muted-foreground" />
          </div>
          <h4 className="text-lg md:text-xl font-semibold text-foreground mb-2">
            No Loans Found
          </h4>
          <p className="text-sm md:text-base text-muted-foreground mb-6">
            Create a new loan account to get started
          </p>
          <Button
            variant="outline"
            iconName="Plus"
            iconPosition="left"
            onClick={onCreateLoan}
          >
            Create First Loan
          </Button>
        </div>
      ) : (
        <div className="bg-card rounded-lg shadow-elevation-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-medium text-muted-foreground">
                    Loan Code
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-medium text-muted-foreground">
                    Principal
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-medium text-muted-foreground">
                    Interest
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-medium text-muted-foreground">
                    Total Payable
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-medium text-muted-foreground">
                    Outstanding
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-medium text-muted-foreground">
                    Start Date
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-right text-xs md:text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-muted/10">
                    <td className="px-4 md:px-6 py-3 md:py-4 text-primary font-medium">
                      {loan.loanCode}
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      ₹{loan.principal.toLocaleString()}
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      {loan.interestRate}
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 font-medium">
                      ₹{loan.totalPayable.toLocaleString()}
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 font-medium text-warning">
                      ₹{loan.outstanding.toLocaleString()}
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          loan.status,
                        )}`}
                      >
                        <Icon name={getStatusIcon(loan.status)} size={14} />
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-muted-foreground">
                      {loan.startDate}
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Eye"
                        onClick={() => navigate(`/loan-details/${loan.id}`)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoansTab;
