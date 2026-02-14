import React, { useState } from "react";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDateRange, setSelectedDateRange] = useState("monthly");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(null);
  const [scheduledReports, setScheduledReports] = useState([
    {
      id: 1,
      name: "Daily Executive Summary",
      frequency: "Every Day at 9:00 AM",
      nextRun: "Tomorrow, Jan 23, 2026",
      format: "PDF",
    },
    {
      id: 2,
      name: "Weekly Performance Report",
      frequency: "Every Monday at 2:00 PM",
      nextRun: "Jan 27, 2026",
      format: "Excel",
    },
    {
      id: 3,
      name: "Monthly Financial Statement",
      frequency: "1st of every month",
      nextRun: "Feb 1, 2026",
      format: "PDF",
    },
  ]);

  const reportCategories = [
    { id: "overview", label: "Overview", icon: "BarChart3" },
    { id: "financial", label: "Financial", icon: "DollarSign" },
    { id: "loans", label: "Loans", icon: "Wallet" },
    { id: "collections", label: "Collections", icon: "TrendingUp" },
    { id: "staff", label: "Staff", icon: "Users" },
    { id: "branches", label: "Branches", icon: "Building2" },
  ];

  const overviewReports = [
    {
      id: 1,
      title: "Executive Summary",
      description: "High-level overview of key metrics and KPIs",
      icon: "Briefcase",
      metrics: ["Total Clients", "Active Loans", "Total Revenue"],
    },
    {
      id: 2,
      title: "Daily Dashboard Report",
      description: "Daily summary of all business activities",
      icon: "Calendar",
      metrics: ["New Loans", "Payments", "Approvals"],
    },
    {
      id: 3,
      title: "Weekly Performance",
      description: "Weekly performance analysis and trends",
      icon: "TrendingUp",
      metrics: ["Growth %", "Target Achievement", "Collection Rate"],
    },
    {
      id: 4,
      title: "Monthly Snapshot",
      description: "Comprehensive monthly business snapshot",
      icon: "FileText",
      metrics: ["Revenue", "Disbursements", "Outstanding"],
    },
  ];

  const financialReports = [
    {
      id: 1,
      title: "Income Statement",
      description: "Revenue, expenses, and profit/loss analysis",
      icon: "PieChart",
      metrics: ["Total Revenue", "Total Expenses", "Net Profit"],
    },
    {
      id: 2,
      title: "Balance Sheet",
      description: "Assets, liabilities, and equity overview",
      icon: "BarChart2",
      metrics: ["Total Assets", "Total Liabilities", "Net Worth"],
    },
    {
      id: 3,
      title: "Cash Flow Statement",
      description: "Cash inflows and outflows analysis",
      icon: "Activity",
      metrics: ["Operating CF", "Investing CF", "Financing CF"],
    },
    {
      id: 4,
      title: "Interest Income Report",
      description: "Detailed interest income breakdown",
      icon: "DollarSign",
      metrics: ["Total Interest", "Pending Interest", "Average Rate"],
    },
  ];

  const loanReports = [
    {
      id: 1,
      title: "Loan Disbursement Report",
      description: "All loan disbursements during the period",
      icon: "CheckCircle",
      metrics: ["Disbursal Count", "Total Amount", "Avg Amount"],
    },
    {
      id: 2,
      title: "Loan Portfolio Analysis",
      description: "Breakdown of loan portfolio by type and status",
      icon: "PieChart",
      metrics: ["Active Loans", "Closed Loans", "Total Value"],
    },
    {
      id: 3,
      title: "Overdue Loan Report",
      description: "Details of all overdue and delinquent loans",
      icon: "AlertTriangle",
      metrics: ["Overdue Count", "Overdue Amount", "% of Portfolio"],
    },
    {
      id: 4,
      title: "Loan Closure Report",
      description: "Loans closed during the reporting period",
      icon: "CheckSquare",
      metrics: ["Closures", "Amount Closed", "Avg Duration"],
    },
  ];

  const collectionReports = [
    {
      id: 1,
      title: "Payment Collection Report",
      description: "Detailed payment collection analysis",
      icon: "CreditCard",
      metrics: ["Total Collected", "Payment Count", "Avg Payment"],
    },
    {
      id: 2,
      title: "Collection Efficiency",
      description: "Collection rates and efficiency metrics",
      icon: "TrendingUp",
      metrics: ["Collection Rate %", "On-Time %", "Recovery %"],
    },
    {
      id: 3,
      title: "Default Analysis",
      description: "Analysis of defaulted and written-off loans",
      icon: "Frown",
      metrics: ["Default Count", "Default Amount", "Recovery"],
    },
    {
      id: 4,
      title: "Payment Mode Analysis",
      description: "Breakdown of payments by mode",
      icon: "PieChart",
      metrics: ["Cheque", "Cash", "Bank Transfer"],
    },
  ];

  const staffReports = [
    {
      id: 1,
      title: "Staff Productivity Report",
      description: "Performance metrics for each staff member",
      icon: "Users",
      metrics: ["Loans Processed", "Avg Processing Time", "Success Rate"],
    },
    {
      id: 2,
      title: "Staff Performance Ranking",
      description: "Ranking of staff based on performance",
      icon: "Award",
      metrics: ["Top Performer", "Avg Rating", "Target Achievement"],
    },
    {
      id: 3,
      title: "Attendance & Leave Report",
      description: "Staff attendance and leave records",
      icon: "Calendar",
      metrics: ["Present Days", "Leave Days", "Attendance %"],
    },
    {
      id: 4,
      title: "Commission Report",
      description: "Commission calculation for staff members",
      icon: "DollarSign",
      metrics: ["Total Commission", "Avg Commission", "Top Earner"],
    },
  ];

  const branchReports = [
    {
      id: 1,
      title: "Branch Performance Report",
      description: "Comparative performance of all branches",
      icon: "BarChart2",
      metrics: ["Revenue by Branch", "Clients by Branch", "Growth %"],
    },
    {
      id: 2,
      title: "Branch Comparison",
      description: "Side-by-side comparison of branch metrics",
      icon: "Columns",
      metrics: ["KPIs", "Targets Met", "Rankings"],
    },
    {
      id: 3,
      title: "Branch Profitability",
      description: "Profitability analysis by branch",
      icon: "TrendingUp",
      metrics: ["Revenue", "Expenses", "Net Profit"],
    },
    {
      id: 4,
      title: "Branch Wise Collection",
      description: "Collection performance by branch",
      icon: "PieChart",
      metrics: ["Collection Rate", "Outstanding", "Recovery"],
    },
  ];

  const getReportsForTab = () => {
    switch (activeTab) {
      case "overview":
        return overviewReports;
      case "financial":
        return financialReports;
      case "loans":
        return loanReports;
      case "collections":
        return collectionReports;
      case "staff":
        return staffReports;
      case "branches":
        return branchReports;
      default:
        return [];
    }
  };

  const handleGenerateReport = async (report) => {
    setGeneratingReport(report.id);
    console.log(`Generating report: ${report.title}`, {
      report: report.title,
      dateRange: selectedDateRange,
      branch: selectedBranch,
      format: selectedFormat,
    });

    // Simulate API call
    setTimeout(() => {
      setGeneratingReport(null);
      setSuccessMessage(
        `Report "${report.title}" generated successfully! Downloaded as ${selectedFormat.toUpperCase()}.`,
      );
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const handleScheduleReport = (report) => {
    console.log(`Scheduling report: ${report.title}`);
    setSuccessMessage(`Report "${report.title}" scheduled successfully!`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDownloadTemplate = (report) => {
    console.log(`Downloading template for: ${report.title}`);
    setSuccessMessage(`Template for "${report.title}" downloaded!`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleApplyFilters = () => {
    console.log("Applying filters:", {
      dateRange: selectedDateRange,
      branch: selectedBranch,
      format: selectedFormat,
    });
    setSuccessMessage("Filters applied successfully!");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDeleteScheduledReport = (reportId) => {
    if (confirm("Delete this scheduled report?")) {
      setScheduledReports((prev) => prev.filter((r) => r.id !== reportId));
      setSuccessMessage("Scheduled report deleted!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleEditScheduledReport = (reportId) => {
    console.log("Edit scheduled report:", reportId);
    setSuccessMessage("Scheduled report updated!");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCreateScheduledReport = () => {
    console.log("Create new scheduled report");
    setSuccessMessage("New scheduled report created!");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
          <Icon name="FileText" size={32} className="text-primary" />
          Reports
        </h1>
        <p className="text-muted-foreground mt-2">
          Generate and analyze business reports
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-4 p-4 bg-success/10 border border-success text-success rounded-lg flex items-center gap-2">
          <Icon name="CheckCircle" size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-4 md:p-6 mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Date Range
            </label>
            <Select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              options={[
                { value: "daily", label: "Daily" },
                { value: "weekly", label: "Weekly" },
                { value: "monthly", label: "Monthly" },
                { value: "quarterly", label: "Quarterly" },
                { value: "yearly", label: "Yearly" },
                { value: "custom", label: "Custom Range" },
              ]}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Branch
            </label>
            <Select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              options={[
                { value: "all", label: "All Branches" },
                { value: "main", label: "Main Branch" },
                { value: "north", label: "North Branch" },
                { value: "south", label: "South Branch" },
                { value: "east", label: "East Branch" },
                { value: "west", label: "West Branch" },
              ]}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Export Format
            </label>
            <Select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              options={[
                { value: "pdf", label: "PDF" },
                { value: "excel", label: "Excel" },
                { value: "csv", label: "CSV" },
                { value: "json", label: "JSON" },
              ]}
            />
          </div>

          <div className="flex items-end">
            <Button
              variant="default"
              iconName="RefreshCw"
              className="w-full"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Report Categories - Tabs */}
      <div className="bg-card rounded-lg border border-border mb-6 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="flex border-b border-border">
            {reportCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`px-4 md:px-6 py-4 font-medium text-sm md:text-base whitespace-nowrap transition-colors flex items-center gap-2 ${
                  activeTab === category.id
                    ? "text-accent border-b-2 border-accent bg-accent/5"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon name={category.icon} size={18} />
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        {getReportsForTab().map((report) => (
          <div
            key={report.id}
            className="bg-card rounded-lg border border-border p-4 md:p-6 hover:border-accent transition-colors"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon name={report.icon} size={24} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">
                  {report.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {report.description}
                </p>
              </div>
            </div>

            {/* Metrics Preview */}
            <div className="mb-4 p-3 bg-muted/30 rounded-lg">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Includes:
              </p>
              <div className="flex flex-wrap gap-2">
                {report.metrics.map((metric, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground"
                  >
                    {metric}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                iconName="Download"
                onClick={() => handleGenerateReport(report)}
                disabled={generatingReport === report.id}
                className="flex-1"
              >
                {generatingReport === report.id ? "Generating..." : "Generate"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Clock"
                onClick={() => handleScheduleReport(report)}
                title="Schedule Report"
              />
              <Button
                variant="outline"
                size="sm"
                iconName="FileDown"
                onClick={() => handleDownloadTemplate(report)}
                title="Download Template"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Scheduled Reports Section */}
      <div className="bg-card rounded-lg border border-border p-4 md:p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Clock" size={20} />
          Scheduled Reports
        </h2>

        <div className="space-y-3">
          {scheduledReports.map((schedule) => (
            <div
              key={schedule.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
            >
              <div>
                <p className="font-medium text-foreground">{schedule.name}</p>
                <div className="text-sm text-muted-foreground mt-1 space-y-1">
                  <p>
                    <Icon name="RotateCw" size={14} className="inline mr-2" />
                    {schedule.frequency}
                  </p>
                  <p>
                    <Icon name="Calendar" size={14} className="inline mr-2" />
                    Next: {schedule.nextRun}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                  {schedule.format}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Edit"
                  onClick={() => handleEditScheduledReport(schedule.id)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Trash2"
                  className="text-error"
                  onClick={() => handleDeleteScheduledReport(schedule.id)}
                />
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          iconName="Plus"
          className="w-full mt-4"
          onClick={handleCreateScheduledReport}
        >
          Create Scheduled Report
        </Button>
      </div>
    </>
  );
};

export default Reports;
