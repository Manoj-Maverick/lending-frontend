import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const LoanInfoTab = ({ loanData }) => {
  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    })?.format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Loan Information
          </h3>
          <Button variant="outline" size="sm">
            <Icon name="Edit" size={16} className="mr-2" />
            Edit Details
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Loan ID</p>
            <p className="text-sm font-medium text-foreground">
              {loanData?.id}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Branch</p>
            <p className="text-sm font-medium text-foreground">
              {loanData?.branch}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Loan Amount</p>
            <p className="text-sm font-medium text-foreground">
              {formatCurrency(loanData?.loanAmount)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Disbursed Amount</p>
            <p className="text-sm font-medium text-foreground">
              {formatCurrency(loanData?.disbursedAmount)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Remaining Balance</p>
            <p className="text-sm font-medium text-foreground">
              {formatCurrency(loanData?.remainingBalance)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Interest Rate</p>
            <p className="text-sm font-medium text-foreground">
              {loanData?.interestRate}% per annum
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Tenure</p>
            <p className="text-sm font-medium text-foreground">
              {loanData?.tenure} months
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Monthly EMI</p>
            <p className="text-sm font-medium text-foreground">
              {formatCurrency(loanData?.monthlyEMI)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Loan Purpose</p>
            <p className="text-sm font-medium text-foreground">
              {loanData?.purpose}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="text-sm font-medium text-foreground">
              {loanData?.status}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Disbursed Date</p>
            <p className="text-sm font-medium text-foreground">
              {formatDate(loanData?.disbursedDate)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Maturity Date</p>
            <p className="text-sm font-medium text-foreground">
              {formatDate(loanData?.maturityDate)}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Client Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Client Name</p>
            <p className="text-sm font-medium text-foreground">
              {loanData?.clientName}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Client Code</p>
            <p className="text-sm font-medium text-foreground">
              {loanData?.clientCode}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Phone Number</p>
            <p className="text-sm font-medium text-foreground">
              {loanData?.clientPhone}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Email Address</p>
            <p className="text-sm font-medium text-foreground">
              {loanData?.clientEmail}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Collateral Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Collateral Type</p>
            <p className="text-sm font-medium text-foreground">
              {loanData?.collateralType}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Collateral Value</p>
            <p className="text-sm font-medium text-foreground">
              {formatCurrency(loanData?.collateralValue)}
            </p>
          </div>
          <div className="space-y-1 md:col-span-2">
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="text-sm font-medium text-foreground">
              {loanData?.collateralDescription}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Approval Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Approved By</p>
            <p className="text-sm font-medium text-foreground">
              {loanData?.approvedBy}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Approval Date</p>
            <p className="text-sm font-medium text-foreground">
              {formatDate(loanData?.approvedDate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanInfoTab;
