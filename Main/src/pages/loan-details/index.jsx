import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import AddPaymentModal from "./components/QuickPaymentModal";
import LoanInfoTab from "./components/LoanInfoTab";
import PaymentScheduleTab from "./components/PaymentScheduleTab";
import TransactionHistoryTab from "./components/TransactionHistoryTab";
import DocumentsTab from "./components/DocumentsTab";
import ForecloseModal from "./components/ForeCloseModal";
import { useLoanDetails } from "hooks/loans/useLoanDetails";
import { formatCurrencyINR } from "utils/format";
import { useLocation } from "react-router-dom";
import { Skeleton } from "components/ui/Skeleton";
import { useAuth } from "auth/AuthContext";
import { useReviewLoanRequest } from "hooks/loans/useLoanApprovals";
import { useUIContext } from "context/UIContext";

const LoanDetailsSkeleton = () => (
  <>
    <div className="mb-4 md:mb-6">
      <Skeleton className="h-5 w-40" />
    </div>

    <div className="mx-auto min-w-0 space-y-6">
      <div className="rounded-lg border border-border bg-card p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-48 md:h-10 md:w-60" />
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
            <Skeleton className="h-4 w-56 md:w-80" />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Skeleton className="h-10 w-full rounded-xl sm:w-40" />
            <Skeleton className="h-10 w-full rounded-xl sm:w-44" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="rounded-lg bg-muted/50 p-4">
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-7 w-28" />
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="border-b border-border px-4 py-4 md:px-6">
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-28 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-4 p-4 md:p-6">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="space-y-2 rounded-lg border border-border p-4"
              >
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-40" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </>
);
function capitalizeFirst(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
const getStatusColor = (status) => {
  const colors = {
    ACTIVE:
      "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    PENDING_APPROVAL:
      "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
    OVERDUE: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
    CLOSED:
      "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
    REJECTED:
      "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400",
    FORECLOSED:
      "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
  };
  return colors?.[status] || colors?.ACTIVE;
};

const getRepaymentColor = (type) => {
  const colors = {
    DAILY:
      "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",

    WEEKLY:
      "bg-pink-500/10 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400",

    MONTHLY:
      "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",

    CUSTOM:
      "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
  };

  return (
    colors?.[type] ||
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
  );
};

const LoanDetails = () => {
  const { user } = useAuth();
  const { showToast } = useUIContext();
  const { loanId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isForecloseModalOpen, setIsForecloseModalOpen] = useState(false);
  const location = useLocation();
  const { data, isLoading, isError, error } = useLoanDetails(loanId);
  const reviewLoanMutation = useReviewLoanRequest();
  const canReviewLoan =
    (user?.role === "ADMIN" || user?.role === "BRANCH_MANAGER") &&
    data?.status === "PENDING_APPROVAL";
  const isApprovedLoan = !["PENDING_APPROVAL", "REJECTED", "CANCELLED"].includes(
    data?.status,
  );
  const parms = new URLSearchParams(location.search);
  useEffect(() => {
    if (!isLoading && parms.get("pay") === "true") {
      setIsPaymentModalOpen(true);
    }
  }, [isLoading, location?.state]);
  if (isLoading) {
    return <LoanDetailsSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-4 text-destructive">
        Failed to load loan info: {error?.message}
      </div>
    );
  }

  if (!data) {
    return <div className="p-4 text-muted-foreground">No loan found.</div>;
  }

  const loanData = {
    clientId: data.client_id,
    loanId: loanId,
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
    repaymentType: data.repayment_type,
    purpose: data.purpose || "-",
    disbursedDate: data.start_date,
    maturityDate: data.last_due_date,
    totalPayable: Number(data.total_payable),
    requestedByName: data.requested_by_name,
    requestedAt: data.requested_at,
    rejectionReason: data.rejection_reason,
    approvedByName: data.approved_by,
    approvedAt: data.approved_at,
  };

  const tabs = [
    { id: "info", label: "Loan Info", icon: "FileText" },
    ...(isApprovedLoan
      ? [
          { id: "schedule", label: "Payment Schedule", icon: "Calendar" },
          {
            id: "transactions",
            label: "Transaction History",
            icon: "History",
          },
        ]
      : []),
    { id: "documents", label: "Documents", icon: "Paperclip" },
  ];

  return (
    <>
      <div className="mb-4 md:mb-6">
        <button
          onClick={() => navigate("/loans-management")}
          className="inline-flex items-center gap-2 text-sm md:text-base text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon name="ArrowLeft" size={20} />
          <span>Back to Loans Management</span>
        </button>
      </div>

      <div className=" mx-auto space-y-6 min-w-0">
        <div className="bg-card border border-border rounded-lg p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <Icon name="Wallet" size={28} className="text-primary" />
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Loan {loanData.id}
                </h1>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    loanData.status,
                  )}`}
                >
                  {loanData.status}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRepaymentColor(
                    loanData.repaymentType,
                  )}`}
                >
                  {loanData.repaymentType}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2 break-words">
                Borrower: {loanData.clientName} ({loanData.clientCode})
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {canReviewLoan && (
                <>
                  <Button
                    variant="success"
                    onClick={async () => {
                      try {
                        await reviewLoanMutation.mutateAsync({
                          loanId,
                          action: "APPROVE",
                        });
                        showToast?.("Loan request approved", "success");
                        navigate(0);
                      } catch (reviewError) {
                        showToast?.(
                          reviewError?.message || "Failed to approve request",
                          "error",
                        );
                      }
                    }}
                  >
                    <Icon name="CheckCheck" size={16} className="mr-2" />
                    Approve Request
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      const rejectionReason =
                        window.prompt(
                          `Why are you rejecting ${loanData.id}?`,
                          "Insufficient review details",
                        ) || "";

                      try {
                        await reviewLoanMutation.mutateAsync({
                          loanId,
                          action: "REJECT",
                          rejectionReason,
                        });
                        showToast?.("Loan request rejected", "success");
                        navigate(0);
                      } catch (reviewError) {
                        showToast?.(
                          reviewError?.message || "Failed to reject request",
                          "error",
                        );
                      }
                    }}
                  >
                    <Icon name="CircleX" size={16} className="mr-2" />
                    Reject Request
                  </Button>
                </>
              )}
              <Button
                onClick={() => setIsPaymentModalOpen(true)}
                disabled={loanData.status !== "ACTIVE"}
                className="w-full sm:w-auto"
              >
                <Icon name="CreditCard" size={16} className="mr-2" />
                Process Payment
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsForecloseModalOpen(true)}
                disabled={loanData.status !== "ACTIVE"}
              >
                <Icon name="Lock" size={16} className="mr-2" />
                Foreclose / Settle Early
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <Stat label="Loan Amount" value={loanData.loanAmount} />
            <Stat label="Total Payable" value={loanData.totalPayable} />
            <Stat label="Remaining Balance" value={loanData.remainingBalance} />
            <Stat
              label={`${capitalizeFirst(loanData.repaymentType)} Installment`}
              value={loanData.monthlyEMI}
            />
            <Stat label="Interest Rate" value={`${loanData.interestRate}%`} />
          </div>
        </div>

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

          <div className="p-4 md:p-6 min-w-0">
            {activeTab === "info" && (
              <LoanInfoTab
                data={data}
                canReviewLoan={canReviewLoan}
                isReviewing={reviewLoanMutation.isPending}
                onApprove={async () => {
                  try {
                    await reviewLoanMutation.mutateAsync({
                      loanId,
                      action: "APPROVE",
                    });
                    showToast?.("Loan request approved", "success");
                    navigate(0);
                  } catch (reviewError) {
                    showToast?.(
                      reviewError?.message || "Failed to approve request",
                      "error",
                    );
                  }
                }}
                onReject={async (rejectionReason) => {
                  try {
                    await reviewLoanMutation.mutateAsync({
                      loanId,
                      action: "REJECT",
                      rejectionReason,
                    });
                    showToast?.("Loan request rejected", "success");
                    navigate(0);
                  } catch (reviewError) {
                    showToast?.(
                      reviewError?.message || "Failed to reject request",
                      "error",
                    );
                  }
                }}
              />
            )}
            {activeTab === "schedule" && (
              <PaymentScheduleTab loanId={loanId} loanStatus={loanData.status} />
            )}
            {activeTab === "transactions" && (
              <TransactionHistoryTab loanStatus={loanData.status} />
            )}
            {activeTab === "documents" && <DocumentsTab loanId={loanId} />}
          </div>
        </div>
      </div>

      <AddPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        loanData={loanData}
      />
      <ForecloseModal
        isOpen={isForecloseModalOpen}
        onClose={() => setIsForecloseModalOpen(false)}
        loanData={loanData}
      />
    </>
  );
};

const Stat = ({ label, value }) => (
  <div className="bg-muted/50 rounded-lg p-4">
    <p className="text-xs text-muted-foreground mb-1">{label}</p>
    <p className="text-xl font-semibold text-foreground break-words">
      {typeof value === "number" ? formatCurrencyINR(value) : value}
    </p>
  </div>
);

export default LoanDetails;
