import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const LoansTab = ({ loans, onCreateLoan }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    const colors = {
      Active: "bg-success/10 text-success",
      Closed: "bg-primary/10 text-primary",
      Delayed: "bg-warning/10 text-warning",
      Foreclosed: "bg-destructive/10 text-destructive",
    };
    return colors?.[status] || "bg-muted/10 text-muted-foreground";
  };

  const getStatusIcon = (status) => {
    const icons = {
      Active: "CheckCircle",
      Closed: "Lock",
      Delayed: "AlertCircle",
      Foreclosed: "XCircle",
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
      {/* Loan Statistics */}
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
            {loans?.length}
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
            {loans?.filter((l) => l?.status === "Active")?.length}
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
            $
            {loans
              ?.reduce((sum, loan) => sum + loan?.principal, 0)
              ?.toLocaleString()}
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
            $
            {loans
              ?.reduce((sum, loan) => sum + loan?.outstanding, 0)
              ?.toLocaleString()}
          </p>
        </div>
      </div>
      {/* Loans List */}
      {loans?.length === 0 ? (
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
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-medium text-muted-foreground whitespace-nowrap">
                    Loan Code
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-medium text-muted-foreground whitespace-nowrap">
                    Principal
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-medium text-muted-foreground whitespace-nowrap">
                    Interest
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-medium text-muted-foreground whitespace-nowrap">
                    Total Payable
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-medium text-muted-foreground whitespace-nowrap">
                    Outstanding
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-medium text-muted-foreground whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-medium text-muted-foreground whitespace-nowrap">
                    Start Date
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-right text-xs md:text-sm font-medium text-muted-foreground whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loans?.map((loan) => (
                  <tr
                    key={loan?.id}
                    className="hover:bg-muted/10 transition-colors duration-250"
                  >
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <span className="text-sm md:text-base font-medium text-primary whitespace-nowrap">
                        {loan?.loanCode}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <span className="text-sm md:text-base text-foreground whitespace-nowrap">
                        ${loan?.principal?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <span className="text-sm md:text-base text-foreground whitespace-nowrap">
                        {loan?.interestRate}%
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <span className="text-sm md:text-base font-medium text-foreground whitespace-nowrap">
                        ${loan?.totalPayable?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <span className="text-sm md:text-base font-medium text-warning whitespace-nowrap">
                        ${loan?.outstanding?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs md:text-sm font-medium whitespace-nowrap ${getStatusColor(loan?.status)}`}
                      >
                        <Icon name={getStatusIcon(loan?.status)} size={14} />
                        {loan?.status}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <span className="text-sm md:text-base text-muted-foreground whitespace-nowrap">
                        {loan?.startDate}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Eye"
                        onClick={() => navigate("/loan-details")}
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
