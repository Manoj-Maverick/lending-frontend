import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import AddPaymentModal from "./components/QuickPaymentModal";
import LoanInfoTab from "./components/LoanInfoTab";
import PaymentScheduleTab from "./components/PaymentScheduleTab";
import TransactionHistoryTab from "./components/TransactionHistoryTab";
import DocumentsTab from "./components/DocumentsTab";

const LoanDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Get loan data from state or use mock data
  const loanData = location?.state?.loanData || {
    id: "LN-001",
    clientName: "Rajesh Kumar",
    clientCode: "CL-001",
    clientPhone: "+91 98765 43210",
    clientEmail: "rajesh.kumar@email.com",
    loanAmount: 500000,
    disbursedAmount: 500000,
    remainingBalance: 350000,
    interestRate: 12.5,
    tenure: 24,
    monthlyEMI: 23540,
    status: "Active",
    purpose: "Business Expansion",
    disbursedDate: "2025-08-15",
    maturityDate: "2027-08-15",
    branch: "Main Branch",
    collateralType: "Property",
    collateralValue: 750000,
    collateralDescription: "Residential property at 123 MG Road, Bangalore",
    approvedBy: "Sunil Verma",
    approvedDate: "2025-08-10",
  };

  const tabs = [
    { id: "info", label: "Loan Info", icon: "FileText" },
    { id: "schedule", label: "Payment Schedule", icon: "Calendar" },
    { id: "transactions", label: "Transaction History", icon: "History" },
    { id: "documents", label: "Documents", icon: "Paperclip" },
  ];

  return (
    <>
      <div className="mb-4 md:mb-6">
        <button
          onClick={() => navigate("/loans-management")}
          className="inline-flex items-center gap-2 text-sm md:text-base text-muted-foreground hover:text-foreground transition-colors duration-250"
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
                  Loan {loanData?.id}
                </h1>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    loanData?.status === "Active"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-950/30 dark:text-gray-400"
                  }`}
                >
                  {loanData?.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Client: {loanData?.clientName} ({loanData?.clientCode})
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                onClick={() => setIsPaymentModalOpen(true)}
                disabled={loanData?.status !== "Active"}
                className="w-full sm:w-auto"
              >
                <Icon name="CreditCard" size={16} className="mr-2" />
                Process Payment
              </Button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Loan Amount</p>
              <p className="text-xl font-semibold text-foreground">
                ₹{loanData?.loanAmount?.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">
                Remaining Balance
              </p>
              <p className="text-xl font-semibold text-foreground">
                ₹{loanData?.remainingBalance?.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Monthly EMI</p>
              <p className="text-xl font-semibold text-foreground">
                ₹{loanData?.monthlyEMI?.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">
                Interest Rate
              </p>
              <p className="text-xl font-semibold text-foreground">
                {loanData?.interestRate}%
              </p>
            </div>
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
            {activeTab === "info" && <LoanInfoTab loanData={loanData} />}
            {activeTab === "schedule" && (
              <PaymentScheduleTab loanData={loanData} />
            )}
            {activeTab === "transactions" && (
              <TransactionHistoryTab loanId={loanData?.id} />
            )}
            {activeTab === "documents" && (
              <DocumentsTab loanId={loanData?.id} />
            )}
          </div>
        </div>
      </div>

      {/* Add Payment Modal */}
      <AddPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        loanData={loanData}
      />
    </>
  );
};

export default LoanDetails;
