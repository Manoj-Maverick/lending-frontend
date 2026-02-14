import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

const PaymentsManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isCollectingPayment, setIsCollectingPayment] = useState(null);
  const [payments, setPayments] = useState([
    {
      id: "PMT-001",
      clientName: "Rajesh Kumar",
      loanId: "LN-001",
      amount: 23540,
      dueDate: "2024-01-15",
      status: "Paid",
      paymentDate: "2024-01-14",
      method: "Bank Transfer",
      remarks: "On time payment",
    },
    {
      id: "PMT-002",
      clientName: "Priya Sharma",
      loanId: "LN-002",
      amount: 18920,
      dueDate: "2024-01-20",
      status: "Pending",
      paymentDate: null,
      method: null,
      remarks: "Awaiting payment",
    },
    {
      id: "PMT-003",
      clientName: "Amit Patel",
      loanId: "LN-003",
      amount: 28750,
      dueDate: "2024-01-10",
      status: "Overdue",
      paymentDate: null,
      method: null,
      remarks: "5 days overdue",
    },
    {
      id: "PMT-004",
      clientName: "Sneha Reddy",
      loanId: "LN-004",
      amount: 21600,
      dueDate: "2024-01-25",
      status: "Paid",
      paymentDate: "2024-01-24",
      method: "Cheque",
      remarks: "Cheque cleared",
    },
    {
      id: "PMT-005",
      clientName: "Vikram Singh",
      loanId: "LN-005",
      amount: 19500,
      dueDate: "2024-02-05",
      status: "Pending",
      paymentDate: null,
      method: null,
      remarks: "Due next week",
    },
    {
      id: "PMT-006",
      clientName: "Anita Desai",
      loanId: "LN-006",
      amount: 25300,
      dueDate: "2024-01-18",
      status: "Overdue",
      paymentDate: null,
      method: null,
      remarks: "2 days overdue",
    },
  ]);

  const stats = [
    {
      title: "Total Due",
      value: "₹2,45,000",
      icon: "Wallet",
      color: "text-primary",
    },
    {
      title: "Paid This Month",
      value: "₹85,440",
      icon: "CheckCircle",
      color: "text-success",
    },
    {
      title: "Pending",
      value: "₹90,540",
      icon: "Clock",
      color: "text-warning",
    },
    {
      title: "Overdue",
      value: "₹69,020",
      icon: "AlertTriangle",
      color: "text-error",
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      Paid: "bg-success/10 text-success dark:bg-success/20",
      Pending: "bg-warning/10 text-warning dark:bg-warning/20",
      Overdue: "bg-error/10 text-error dark:bg-error/20",
    };
    return colors[status] || "bg-muted/10 text-muted-foreground";
  };

  const getMethodIcon = (method) => {
    const icons = {
      "Bank Transfer": "ArrowRight",
      Cheque: "CheckSquare",
      Cash: "Banknote",
      Online: "Zap",
    };
    return icons[method] || "CreditCard";
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.loanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || payment.status === selectedStatus;
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "paid" && payment.status === "Paid") ||
      (activeTab === "pending" && payment.status === "Pending") ||
      (activeTab === "overdue" && payment.status === "Overdue");

    return matchesSearch && matchesStatus && matchesTab;
  });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const displayedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleCollectPayment = (payment) => {
    setIsCollectingPayment(payment.id);
    setTimeout(() => {
      setIsCollectingPayment(null);
      setPayments((prev) =>
        prev.map((p) =>
          p.id === payment.id
            ? {
                ...p,
                status: "Paid",
                paymentDate: new Date().toISOString().split("T")[0],
                method: "Cash",
              }
            : p,
        ),
      );
      setSuccessMessage(`Payment collected from ${payment.clientName}!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const handleGenerateReceipt = (payment) => {
    console.log("Generating receipt for:", payment);
    setSuccessMessage(`Receipt generated for payment ${payment.id}!`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSendReminder = (payment) => {
    console.log("Sending payment reminder to:", payment.clientName);
    setSuccessMessage(`Reminder sent to ${payment.clientName}!`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleRecordPayment = (payment) => {
    console.log("Recording payment:", payment);
    setSuccessMessage(`Payment recorded successfully!`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleExportPayments = () => {
    console.log("Exporting payments data...");
    setSuccessMessage("Payments exported as CSV!");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handlePrintPaymentList = () => {
    console.log("Printing payment list...");
    window.print();
  };

  const handleViewLoanDetails = (loanId) => {
    // Mock loans database - in real app, this would be fetched from API
    const mockLoans = [
      {
        id: "LN-001",
        clientName: "Rajesh Kumar",
        clientCode: "CL-001",
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
      },
      {
        id: "LN-002",
        clientName: "Priya Sharma",
        clientCode: "CL-002",
        loanAmount: 1000000,
        disbursedAmount: 1000000,
        remainingBalance: 850000,
        interestRate: 11.5,
        tenure: 36,
        monthlyEMI: 18920,
        status: "Active",
        purpose: "Home Renovation",
        disbursedDate: "2025-07-20",
        maturityDate: "2028-07-20",
        branch: "North Branch",
        collateralType: "Home",
        collateralValue: 1500000,
        collateralDescription: "Apartment at Park Avenue",
        approvedBy: "Raghav Singh",
        approvedDate: "2025-07-10",
      },
      {
        id: "LN-003",
        clientName: "Amit Patel",
        clientCode: "CL-003",
        loanAmount: 750000,
        disbursedAmount: 750000,
        remainingBalance: 620000,
        interestRate: 12,
        tenure: 24,
        monthlyEMI: 28750,
        status: "Active",
        purpose: "Purchase Equipment",
        disbursedDate: "2025-06-15",
        maturityDate: "2027-06-15",
        branch: "South Branch",
        collateralType: "Equipment",
        collateralValue: 900000,
        collateralDescription: "Industrial machinery",
        approvedBy: "Priya Khanna",
        approvedDate: "2025-06-05",
      },
      {
        id: "LN-004",
        clientName: "Sneha Reddy",
        clientCode: "CL-004",
        loanAmount: 600000,
        disbursedAmount: 600000,
        remainingBalance: 480000,
        interestRate: 11.75,
        tenure: 24,
        monthlyEMI: 21600,
        status: "Active",
        purpose: "Business Expansion",
        disbursedDate: "2025-05-10",
        maturityDate: "2027-05-10",
        branch: "East Branch",
        collateralType: "Property",
        collateralValue: 800000,
        collateralDescription: "Commercial property",
        approvedBy: "Vikram Kumar",
        approvedDate: "2025-05-01",
      },
      {
        id: "LN-005",
        clientName: "Vikram Singh",
        clientCode: "CL-005",
        loanAmount: 1200000,
        disbursedAmount: 1200000,
        remainingBalance: 1050000,
        interestRate: 11,
        tenure: 36,
        monthlyEMI: 19500,
        status: "Active",
        purpose: "Factory Setup",
        disbursedDate: "2025-09-01",
        maturityDate: "2028-09-01",
        branch: "West Branch",
        collateralType: "Property",
        collateralValue: 1800000,
        collateralDescription: "Industrial land",
        approvedBy: "Anjali Desai",
        approvedDate: "2025-08-20",
      },
      {
        id: "LN-006",
        clientName: "Anita Desai",
        clientCode: "CL-006",
        loanAmount: 550000,
        disbursedAmount: 550000,
        remainingBalance: 425000,
        interestRate: 12.5,
        tenure: 24,
        monthlyEMI: 25300,
        status: "Active",
        purpose: "Vehicle Purchase",
        disbursedDate: "2025-04-15",
        maturityDate: "2027-04-15",
        branch: "Main Branch",
        collateralType: "Vehicle",
        collateralValue: 650000,
        collateralDescription: "Commercial vehicle",
        approvedBy: "Suresh Nair",
        approvedDate: "2025-04-01",
      },
    ];

    const loanData = mockLoans.find((loan) => loan.id === loanId);
    navigate("/loan-details", { state: { loanData } });
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
            <Icon name="CreditCard" size={32} className="text-primary" />
            Payments Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Track and manage loan payment collections
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            iconName="Download"
            onClick={handleExportPayments}
            className="flex-1 sm:flex-none"
          >
            Export
          </Button>
          <Button
            variant="outline"
            iconName="Printer"
            onClick={handlePrintPaymentList}
            className="flex-1 sm:flex-none"
          >
            Print
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-4 p-4 bg-success/10 border border-success text-success rounded-lg flex items-center gap-2">
          <Icon name="CheckCircle" size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-card rounded-lg border border-border p-4 md:p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center ${stat.color}`}
              >
                <Icon name={stat.icon} size={24} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
            <p className="text-2xl md:text-3xl font-bold text-foreground">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-card rounded-lg border border-border p-4 md:p-6 mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Search Payment
            </label>
            <Input
              placeholder="Client name, Loan ID, or Payment ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              iconName="Search"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Status Filter
            </label>
            <Select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              options={[
                { value: "all", label: "All Status" },
                { value: "Paid", label: "Paid" },
                { value: "Pending", label: "Pending" },
                { value: "Overdue", label: "Overdue" },
              ]}
            />
          </div>

          <div className="flex items-end">
            <Button
              variant="default"
              iconName="RefreshCw"
              className="w-full"
              onClick={() => {
                setSearchTerm("");
                setSelectedStatus("all");
                setCurrentPage(1);
              }}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Tabs */}
      <div className="bg-card rounded-lg border border-border mb-6 overflow-hidden">
        <div className="flex border-b border-border">
          {[
            { id: "all", label: "All Payments", icon: "List" },
            { id: "paid", label: "Paid", icon: "CheckCircle" },
            { id: "pending", label: "Pending", icon: "Clock" },
            { id: "overdue", label: "Overdue", icon: "AlertTriangle" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
              className={`px-4 md:px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? "text-accent border-b-2 border-accent bg-accent/5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon name={tab.icon} size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden mb-6">
        {displayedPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                    Client & Loan
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                    Due Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                    Method
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {displayedPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-muted/40 transition">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">
                          {payment.clientName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {payment.loanId}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-foreground">
                        ₹{payment.amount.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-muted-foreground">
                        {payment.dueDate}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          payment.status,
                        )}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {payment.method ? (
                        <div className="flex items-center gap-2">
                          <Icon
                            name={getMethodIcon(payment.method)}
                            size={16}
                            className="text-accent"
                          />
                          <span className="text-sm text-foreground">
                            {payment.method}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {payment.status === "Pending" && (
                          <Button
                            variant="default"
                            size="sm"
                            iconName="CreditCard"
                            onClick={() => handleCollectPayment(payment)}
                            disabled={isCollectingPayment === payment.id}
                            title="Collect Payment"
                          >
                            {isCollectingPayment === payment.id
                              ? "Collecting..."
                              : "Collect"}
                          </Button>
                        )}
                        {payment.status === "Overdue" && (
                          <Button
                            variant="warning"
                            size="sm"
                            iconName="AlertTriangle"
                            onClick={() => handleSendReminder(payment)}
                            title="Send Reminder"
                          >
                            Remind
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="FileText"
                          onClick={() => handleGenerateReceipt(payment)}
                          title="Generate Receipt"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Eye"
                          onClick={() => handleViewLoanDetails(payment.loanId)}
                          title="View Loan Details"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <Icon
              name="CreditCard"
              size={48}
              className="mx-auto text-muted-foreground/50 mb-4"
            />
            <p className="text-muted-foreground">No payments found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {displayedPayments.length} of {filteredPayments.length}{" "}
            payments
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              iconName="ChevronLeft"
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <Button
                  key={idx + 1}
                  variant={currentPage === idx + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              iconName="ChevronRight"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentsManagement;
