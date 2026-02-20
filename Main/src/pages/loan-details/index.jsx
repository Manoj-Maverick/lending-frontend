import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import AddPaymentModal from "./components/QuickPaymentModal";
import LoanInfoTab from "./components/LoanInfoTab";
import PaymentScheduleTab from "./components/PaymentScheduleTab";
import TransactionHistoryTab from "./components/TransactionHistoryTab";
import DocumentsTab from "./components/DocumentsTab";
import { useGetLoanDetails } from "hooks/loans.details.page/useGetLoanProfileInfo";
function capitalizeFirst(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
const LoanDetails = () => {
  const { loanId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("info");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const { data, isLoading, isError, error } = useGetLoanDetails(loanId);

  // ⏳ Loading
  if (isLoading) {
    return (
      <div className="p-4 text-muted-foreground">Loading loan info...</div>
    );
  }

  // ❌ Error
  if (isError) {
    return (
      <div className="p-4 text-destructive">
        Failed to load loan info: {error.message}
      </div>
    );
  }

  if (!data) {
    return <div className="p-4 text-muted-foreground">No loan found.</div>;
  }

  // 🧱 Map backend → UI shape used by this page
  const loanData = {
    id: data.loan_code,
    status: data.status,
    branch: data.branch_name,

    clientName: data.client_name,
    clientCode: data.customer_code,

    loanAmount: Number(data.principal_amount),
    disbursedAmount: Number(data.principal_amount),
    remainingBalance: Number(data.remaining_balance),
    interestRate: Number(data.interest_rate),
    tenure: `${data.tenure_value} ${data.tenure_unit}`,
    monthlyEMI: Number(data.installment_amount),
    repayment_type: data.repayment_type,
    purpose: data.purpose || "-",
    disbursedDate: data.start_date,
    maturityDate: data.last_due_date,
  };

  const tabs = [
    { id: "info", label: "Loan Info", icon: "FileText" },
    { id: "schedule", label: "Payment Schedule", icon: "Calendar" },
    { id: "transactions", label: "Transaction History", icon: "History" },
    { id: "documents", label: "Documents", icon: "Paperclip" },
  ];

  return (
    <>
      {/* Back */}
      <div className="mb-4 md:mb-6">
        <button
          onClick={() => navigate("/loans-management")}
          className="inline-flex items-center gap-2 text-sm md:text-base text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon name="ArrowLeft" size={20} />
          <span>Back to Loans Management</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Loan summary */}
        <div className="bg-card border border-border rounded-lg p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <Icon name="Wallet" size={28} className="text-primary" />
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Loan {loanData.id}
                </h1>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    loanData.status === "ACTIVE"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-950/30 dark:text-gray-400"
                  }`}
                >
                  {loanData.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Client: {loanData.clientName} ({loanData.clientCode})
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                onClick={() => setIsPaymentModalOpen(true)}
                disabled={loanData.status !== "ACTIVE"}
                className="w-full sm:w-auto"
              >
                <Icon name="CreditCard" size={16} className="mr-2" />
                Process Payment
              </Button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <Stat label="Loan Amount" value={loanData.loanAmount} />
            <Stat label="Remaining Balance" value={loanData.remainingBalance} />
            <Stat
              label={`${capitalizeFirst(loanData.repayment_type)} Installment`}
              value={loanData.monthlyEMI}
            />
            <Stat label="Interest Rate" value={`${loanData.interestRate}%`} />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="border-b border-border">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-primary border-b-2 border-primary bg-muted/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
                  }`}
                >
                  <Icon name={tab.icon} size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 md:p-6">
            {activeTab === "info" && <LoanInfoTab data={data} />}
            {activeTab === "schedule" && <PaymentScheduleTab loanId={loanId} />}
            {activeTab === "transactions" && (
              <TransactionHistoryTab loanId={loanId} />
            )}
            {activeTab === "documents" && <DocumentsTab loanId={loanId} />}
          </div>
        </div>
      </div>

      {/* Add Payment Modal */}
      <AddPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        loanId={loanId}
      />
    </>
  );
};

const Stat = ({ label, value }) => (
  <div className="bg-muted/50 rounded-lg p-4">
    <p className="text-xs text-muted-foreground mb-1">{label}</p>
    <p className="text-xl font-semibold text-foreground">
      {typeof value === "number" ? `₹${value.toLocaleString("en-IN")}` : value}
    </p>
  </div>
);

export default LoanDetails;
