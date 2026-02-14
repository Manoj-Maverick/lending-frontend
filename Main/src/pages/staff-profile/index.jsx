import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import PersonalInfoTab from "./components/PersonalInfoTab";
import DocumentsTab from "./components/DocumentsTab";
import PerformanceTab from "./components/PerformanceTab";
import EditStaffModal from "../staff-management/components/EditStaffModal";

const StaffProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // Get staff data from state or use mock data
  const mockStaff = location?.state?.staffData || {
    id: "ST-001",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@lendweb.com",
    phone: "+91 98765 43210",
    branch: "Main Branch",
    employedSince: "January 15, 2023",
    status: "Active",
    photo:
      "https://img.rocket.new/generatedImages/rocket_gen_img_1b09cae8d-1763295945796.png",
    photoAlt: "Professional headshot of Rajesh Kumar",
    dateOfBirth: "March 12, 1985",
    gender: "Male",
    address: {
      street: "456 Oak Avenue, Apartment 3B",
      city: "Bangalore",
      state: "Karnataka",
      zipCode: "560001",
    },
    role: "Branch Manager",
    department: "Management",
    employmentType: "Full-Time",
    joinDate: "January 15, 2023",
    bankInfo: {
      bankName: "HDFC Bank",
      accountNumber: "****5678",
      accountHolderName: "Rajesh Kumar",
      ifscCode: "HDFC0000001",
    },
    stats: {
      totalProjects: 24,
      activeProjects: 5,
      performanceRating: "4.8",
      yearsOfExperience: 8,
    },
  };

  const mockDocuments = [
    {
      id: 1,
      name: "ID Proof - Aadhar",
      type: "ID",
      uploadDate: "2023-01-15",
      status: "Verified",
      fileUrl: "#",
    },
    {
      id: 2,
      name: "Address Proof - Electricity Bill",
      type: "Address",
      uploadDate: "2023-01-15",
      status: "Verified",
      fileUrl: "#",
    },
    {
      id: 3,
      name: "Educational Certificate - B.Tech",
      type: "Education",
      uploadDate: "2023-01-15",
      status: "Verified",
      fileUrl: "#",
    },
    {
      id: 4,
      name: "Experience Certificate - Previous Company",
      type: "Experience",
      uploadDate: "2023-01-15",
      status: "Pending",
      fileUrl: "#",
    },
  ];

  const mockPerformanceData = {
    overallRating: "4.8",
    totalRatings: 125,
    reviews: [
      {
        id: 1,
        reviewer: "Admin",
        date: "2024-01-10",
        rating: "5",
        comment:
          "Excellent work on branch management. Great leadership skills.",
      },
      {
        id: 2,
        reviewer: "HR Team",
        date: "2024-01-05",
        rating: "4.5",
        comment:
          "Good performance. Keep up the excellent work with team coordination.",
      },
      {
        id: 3,
        reviewer: "Finance Team",
        date: "2023-12-28",
        rating: "5",
        comment:
          "Exceptional financial management. All targets achieved ahead of schedule.",
      },
    ],
    metrics: {
      clientSatisfaction: 92,
      targetAchievement: 110,
      teamLeadership: 95,
      loanProcessing: 98,
    },
  };

  const breadcrumbItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Staff Management", path: "/staff-management" },
    { label: mockStaff.name, path: `/staff-profile/` },
  ];

  const tabs = [
    { id: "personal", label: "Personal Info", icon: "User" },
    { id: "documents", label: "Documents", icon: "FileText" },
    { id: "performance", label: "Performance", icon: "TrendingUp" },
  ];

  const handleEditStaff = (updatedData) => {
    console.log("Updated staff profile:", updatedData);
    setIsEditModalOpen(false);
    // Add API call here to update staff data
  };

  const handleDisableStaff = () => {
    if (confirm("Are you sure you want to disable this staff member?")) {
      console.log("Staff disabled:", staffId);
      setIsMoreMenuOpen(false);
      // Add API call here
    }
  };

  const handleArchiveStaff = () => {
    if (confirm("Are you sure you want to archive this staff member?")) {
      console.log("Staff archived:", staffId);
      setIsMoreMenuOpen(false);
      // Add API call here
    }
  };

  const handleDeleteStaff = () => {
    if (
      confirm("Are you sure you want to delete this staff member permanently?")
    ) {
      console.log("Staff deleted:", staffId);
      navigate("/staff-management");
      // Add API call here
    }
  };

  const handleDownloadReport = () => {
    console.log("Downloading staff report:", staffId);
    // Add download functionality here
  };

  const handleDownloadDocument = (doc) => {
    console.log("Downloading document:", doc);
    // Add download functionality here
  };

  const handleDeleteDocument = (doc) => {
    if (confirm(`Are you sure you want to delete "${doc.name}"?`)) {
      console.log("Deleting document:", doc);
      // Add API call here to delete document
    }
  };

  const handleUploadDocument = () => {
    console.log("Opening upload dialog");
    // Add file upload dialog here
  };

  const handleReviewDocument = (doc) => {
    console.log("Reviewing document:", doc);
    // Add review workflow here
  };

  const handleDownloadPerformanceReport = () => {
    console.log("Downloading performance report for:", staffId);
    // Add download functionality here
  };

  const handleAddPerformanceReview = () => {
    console.log("Adding performance review for:", staffId);
    // Open review dialog or modal here
  };

  return (
    <>
      <div className="mb-4 md:mb-6">
        <button
          onClick={() => navigate("/staff-management")}
          className="inline-flex items-center gap-2 text-sm md:text-base text-muted-foreground hover:text-foreground transition-colors duration-250"
        >
          <Icon name="ArrowLeft" size={20} />
          <span>Back to Staff Management</span>
        </button>
      </div>
      {/* Page Header */}
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {mockStaff.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            Staff ID: {mockStaff.staffId}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            iconName="Edit"
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit Staff
          </Button>
          <div className="relative">
            <Button
              variant="outline"
              iconName="MoreVertical"
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            />
            {isMoreMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                <button
                  onClick={handleDisableStaff}
                  className="w-full text-left px-4 py-2 hover:bg-muted/50 transition-colors flex items-center gap-3 border-b border-border"
                >
                  <Icon name="Ban" size={16} />
                  <span className="text-sm">Disable Staff</span>
                </button>
                <button
                  onClick={handleArchiveStaff}
                  className="w-full text-left px-4 py-2 hover:bg-muted/50 transition-colors flex items-center gap-3 border-b border-border"
                >
                  <Icon name="Archive" size={16} />
                  <span className="text-sm">Archive Staff</span>
                </button>
                <button
                  onClick={handleDownloadReport}
                  className="w-full text-left px-4 py-2 hover:bg-muted/50 transition-colors flex items-center gap-3 border-b border-border"
                >
                  <Icon name="Download" size={16} />
                  <span className="text-sm">Download Report</span>
                </button>
                <button
                  onClick={handleDeleteStaff}
                  className="w-full text-left px-4 py-2 hover:bg-error/10 transition-colors flex items-center gap-3 text-error"
                >
                  <Icon name="Trash2" size={16} />
                  <span className="text-sm">Delete Staff</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 border-b border-border overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon name={tab.icon} size={18} />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "personal" && (
        <PersonalInfoTab
          staff={mockStaff}
          onEdit={() => setIsEditModalOpen(true)}
        />
      )}
      {activeTab === "documents" && (
        <DocumentsTab
          documents={mockDocuments}
          onDownload={handleDownloadDocument}
          onDelete={handleDeleteDocument}
          onUpload={handleUploadDocument}
          onReview={handleReviewDocument}
        />
      )}
      {activeTab === "performance" && (
        <PerformanceTab
          performance={mockPerformanceData}
          onDownloadReport={handleDownloadPerformanceReport}
          onAddReview={handleAddPerformanceReview}
        />
      )}

      {/* Edit Staff Modal */}
      <EditStaffModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditStaff}
        staffData={mockStaff}
      />
    </>
  );
};

export default StaffProfile;
