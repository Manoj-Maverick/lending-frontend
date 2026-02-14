import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../dashboard/components/StatCard";
import LoansTable from "./components/LoansTable";
import LoanFilters from "./components/LoanFilters";
import CreateLoanModal from "./components/CreateLoanModal";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";

const LoansManagement = () => {
  const navigate = useNavigate();
  const [isCreateLoanOpen, setIsCreateLoanOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    branch: "all",
    loanType: "all",
    searchQuery: "",
  });

  const loanStats = [
    {
      title: "Total Active Loans",
      value: "342",
      subtitle: "₹1.2 Cr disbursed",
      icon: "Wallet",
      color: "blue",
      trend: "up",
      trendValue: "+8%",
    },
    {
      title: "Pending Approvals",
      value: "28",
      subtitle: "₹45 Lakhs pending",
      icon: "Clock",
      color: "orange",
      trend: "up",
      trendValue: "+3%",
    },
    {
      title: "Overdue Loans",
      value: "15",
      subtitle: "₹8.5 Lakhs overdue",
      icon: "AlertTriangle",
      color: "red",
      trend: "down",
      trendValue: "-12%",
    },
    {
      title: "Closed This Month",
      value: "42",
      subtitle: "₹32 Lakhs recovered",
      icon: "CheckCircle",
      color: "green",
      trend: "up",
      trendValue: "+18%",
    },
  ];

  const mockLoans = [
    {
      id: "LN-2024-001",
      clientName: "Rajesh Kumar",
      clientCode: "CL-001",
      loanAmount: 50000,
      disbursedDate: "2024-03-15",
      interestRate: 12,
      tenure: 12,
      emiAmount: 4442,
      outstanding: 35000,
      status: "Active",
      branch: "Main Branch",
      nextEmiDate: "2026-02-15",
    },
    {
      id: "LN-2024-015",
      clientName: "Priya Sharma",
      clientCode: "CL-002",
      loanAmount: 100000,
      disbursedDate: "2024-05-20",
      interestRate: 11.5,
      tenure: 24,
      emiAmount: 4707,
      outstanding: 85000,
      status: "Active",
      branch: "East Branch",
      nextEmiDate: "2026-02-20",
    },
    {
      id: "LN-2024-032",
      clientName: "Amit Patel",
      clientCode: "CL-003",
      loanAmount: 75000,
      disbursedDate: "2024-06-10",
      interestRate: 12.5,
      tenure: 18,
      emiAmount: 4583,
      outstanding: 62000,
      status: "Overdue",
      branch: "West Branch",
      nextEmiDate: "2026-01-10",
    },
    {
      id: "LN-2024-008",
      clientName: "Sunita Devi",
      clientCode: "CL-004",
      loanAmount: 30000,
      disbursedDate: "2024-02-05",
      interestRate: 13,
      tenure: 12,
      emiAmount: 2685,
      outstanding: 0,
      status: "Closed",
      branch: "Main Branch",
      nextEmiDate: "-",
    },
    {
      id: "LN-2024-045",
      clientName: "Vikram Singh",
      clientCode: "CL-005",
      loanAmount: 150000,
      disbursedDate: "2024-08-12",
      interestRate: 11,
      tenure: 36,
      emiAmount: 4915,
      outstanding: 140000,
      status: "Active",
      branch: "North Branch",
      nextEmiDate: "2026-02-12",
    },
    {
      id: "LN-2024-052",
      clientName: "Meena Gupta",
      clientCode: "CL-006",
      loanAmount: 60000,
      disbursedDate: "2024-09-01",
      interestRate: 12,
      tenure: 15,
      emiAmount: 4333,
      outstanding: 55000,
      status: "Active",
      branch: "East Branch",
      nextEmiDate: "2026-02-01",
    },
    {
      id: "LN-2024-067",
      clientName: "Ramesh Yadav",
      clientCode: "CL-007",
      loanAmount: 80000,
      disbursedDate: "2024-10-15",
      interestRate: 11.5,
      tenure: 20,
      emiAmount: 4471,
      outstanding: 75000,
      status: "Active",
      branch: "West Branch",
      nextEmiDate: "2026-02-15",
    },
    {
      id: "LN-2024-078",
      clientName: "Kavita Reddy",
      clientCode: "CL-008",
      loanAmount: 45000,
      disbursedDate: "2024-11-20",
      interestRate: 12.5,
      tenure: 12,
      emiAmount: 4031,
      outstanding: 42000,
      status: "Active",
      branch: "Main Branch",
      nextEmiDate: "2026-02-20",
    },
  ];

  const [loans, setLoans] = useState(mockLoans);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleViewLoan = (loan) => {
    navigate(`/loan-details`, { state: { loanData: loan } });
  };

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
              <Icon name="Wallet" size={32} className="text-primary" />
              Loans Management
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Manage loan applications, disbursements, and payment schedules
            </p>
          </div>

          <Button
            onClick={() => setIsCreateLoanOpen(true)}
            className="w-full sm:w-auto"
          >
            <Icon name="Plus" size={16} />
            Create New Loan
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {loanStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="bg-card rounded-lg border border-border p-4 md:p-6">
          <LoanFilters filters={filters} onFilterChange={handleFilterChange} />
          <LoansTable loans={loans} onViewLoan={handleViewLoan} />
        </div>
      </div>
      {isCreateLoanOpen && (
        <CreateLoanModal
          isOpen={isCreateLoanOpen}
          onClose={() => setIsCreateLoanOpen(false)}
          onSubmit={(loanData) => {
            console.log("Loan created:", loanData);
            setIsCreateLoanOpen(false);
          }}
        />
      )}
    </>
  );
};

export default LoansManagement;
