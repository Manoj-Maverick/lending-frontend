import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const TransactionHistoryTab = ({ loanId }) => {
  const mockTransactions = [
    {
      id: "TXN-001",
      date: "2026-01-15",
      amount: 23540,
      type: "EMI Payment",
      method: "Bank Transfer",
      reference: "REF123456789",
      status: "Success",
      processedBy: "Sunil Verma",
    },
    {
      id: "TXN-002",
      date: "2025-12-15",
      amount: 23540,
      type: "EMI Payment",
      method: "Cash",
      reference: "REF123456788",
      status: "Success",
      processedBy: "Anjali Desai",
    },
    {
      id: "TXN-003",
      date: "2025-11-15",
      amount: 23540,
      type: "EMI Payment",
      method: "Cheque",
      reference: "CHQ987654321",
      status: "Success",
      processedBy: "Sunil Verma",
    },
    {
      id: "TXN-004",
      date: "2025-10-15",
      amount: 23540,
      type: "EMI Payment",
      method: "Bank Transfer",
      reference: "REF123456787",
      status: "Success",
      processedBy: "Karthik Rao",
    },
    {
      id: "TXN-005",
      date: "2025-09-15",
      amount: 23540,
      type: "EMI Payment",
      method: "Cash",
      reference: "REF123456786",
      status: "Success",
      processedBy: "Anjali Desai",
    },
    {
      id: "TXN-006",
      date: "2025-08-15",
      amount: 500000,
      type: "Loan Disbursement",
      method: "Bank Transfer",
      reference: "DISB123456",
      status: "Success",
      processedBy: "Sunil Verma",
    },
  ];

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

  const getTypeColor = (type) => {
    return type === "Loan Disbursement"
      ? "text-blue-600 dark:text-blue-400"
      : "text-emerald-600 dark:text-emerald-400";
  };

  const handleDownloadReceipt = (transactionId) => {
    console.log("Downloading receipt for:", transactionId);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="text-lg font-semibold text-foreground">
          Transaction History
        </h3>
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          <Icon name="Download" size={16} className="mr-2" />
          Export All
        </Button>
      </div>

      <div className="space-y-3">
        {mockTransactions?.map((transaction) => (
          <div
            key={transaction?.id}
            className="bg-muted/30 border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon
                      name={
                        transaction?.type === "Loan Disbursement"
                          ? "ArrowDownCircle"
                          : "ArrowUpCircle"
                      }
                      size={20}
                      className={getTypeColor(transaction?.type)}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {transaction?.type}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {transaction?.id}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="text-sm font-medium text-foreground">
                      {formatDate(transaction?.date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="text-sm font-medium text-foreground">
                      {formatCurrency(transaction?.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Method</p>
                    <p className="text-sm font-medium text-foreground">
                      {transaction?.method}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Reference</p>
                    <p className="text-sm font-medium text-foreground">
                      {transaction?.reference}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                  <Icon name="CheckCircle" size={12} className="mr-1" />
                  {transaction?.status}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadReceipt(transaction?.id)}
                >
                  <Icon name="Download" size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistoryTab;
