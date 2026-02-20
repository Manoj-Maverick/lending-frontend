import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const LoanInfoTab = ({ data: loanData }) => {
  console.log("LoanInfoTab received data:", loanData);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (amount == null) return "-";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!loanData) {
    return <div className="p-4 text-muted-foreground">No data found.</div>;
  }

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
          <Info label="Loan Code" value={loanData.loan_code} />
          <Info label="Branch" value={loanData.branch_name} />
          <Info
            label="Principal Amount"
            value={formatCurrency(loanData.principal_amount)}
          />
          <Info
            label="Installment Amount"
            value={formatCurrency(loanData.installment_amount)}
          />
          <Info
            label="Remaining Balance"
            value={formatCurrency(loanData.remaining_balance)}
          />
          <Info label="Interest Rate" value={`${loanData.interest_rate}%`} />
          <Info
            label="Tenure"
            value={`${loanData.tenure_value} ${loanData.tenure_unit}`}
          />
          <Info label="Repayment Type" value={loanData.repayment_type} />
          <Info
            label="Processing Fee"
            value={formatCurrency(loanData.processing_fee)}
          />
          <Info label="Penalty Rate" value={`${loanData.penalty_rate}%`} />
          <Info
            label="Total Payable"
            value={formatCurrency(loanData.total_payable)}
          />
          <Info label="Status" value={loanData.status} />
          <Info
            label="Sanctioned Date"
            value={formatDate(loanData.sanctioned_date)}
          />
          <Info label="Start Date" value={formatDate(loanData.start_date)} />
          <Info
            label="Last Due Date"
            value={formatDate(loanData.last_due_date)}
          />
        </div>
      </div>

      <Section title="Client Information">
        <Info label="Client Name" value={loanData.client_name} />
        <Info label="Customer Code" value={loanData.customer_code} />
        <Info label="Phone Number" value={loanData.phone} />
        <Info label="Email Address" value={loanData.email} />
      </Section>

      <Section title="Approval Information">
        <Info label="Approved By" value={loanData.approved_by} />
        <Info label="Approval Date" value={formatDate(loanData.approved_at)} />
        <Info
          label="Closure Reason"
          value={loanData.closure_reason ?? "-"}
          span
        />
      </Section>
    </div>
  );
};

// 🔹 Small helpers for cleaner JSX
const Section = ({ title, children }) => (
  <div className="border-t border-border pt-6">
    <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

const Info = ({ label, value, span = false }) => (
  <div className={`space-y-1 ${span ? "md:col-span-2" : ""}`}>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="text-sm font-medium text-foreground">{value ?? "-"}</p>
  </div>
);

export default LoanInfoTab;
