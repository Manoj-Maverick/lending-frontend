import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Icon from "../../components/AppIcon";
import PersonalInfoTab from "./components/PersonalInfoTab";
import GuarantorsTab from "./components/GuarantorsTab";
import DocumentsTab from "./components/DocumentsTab";
import LoansTab from "./components/LoansTab";
import { useParams } from "react-router-dom";
const ClientProfile = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("personal");

  // Get client data from state or use mock data
  const clientData = location?.state?.clientData || {
    id: "CL-001",
    name: "Sarah Mitchell",
    phone: "+1 (555) 234-5678",
    email: "sarah.mitchell@email.com",
    branch: "Main Branch",
    memberSince: "January 15, 2024",
    loanStatus: "Active",
    photo:
      "https://img.rocket.new/generatedImages/rocket_gen_img_170699746-1763294878713.png",
    photoAlt:
      "Professional headshot of woman with shoulder-length brown hair wearing navy blue blazer and white blouse smiling warmly at camera",
    dateOfBirth: "March 12, 1985",
    gender: "Female",
    maritalStatus: "Married",
    occupation: "Small Business Owner",
    monthlyIncome: 4500,
    nationalId: "SSN-123-45-6789",
    address: {
      street: "456 Oak Avenue, Apartment 3B",
      city: "Springfield",
      state: "Illinois",
      zipCode: "62701",
    },
    bankInfo: {
      bankName: "First National Bank",
      accountNumber: "****5678",
      accountHolderName: "Sarah Mitchell",
      ifscCode: "FNB0001234",
    },
    stats: {
      totalLoans: 3,
      activeLoans: 1,
      totalDisbursed: 25000,
      outstanding: 8500,
    },
  };

  const mockGuarantors = [
    {
      id: 1,
      name: "Michael Thompson",
      relationship: "Spouse",
      phone: "+1 (555) 234-5679",
      email: "michael.thompson@email.com",
      address: "456 Oak Avenue, Apartment 3B, Springfield, IL 62701",
      occupation: "Software Engineer",
      monthlyIncome: 6500,
      photo:
        "https://img.rocket.new/generatedImages/rocket_gen_img_1bfef8bd5-1763295388609.png",
      photoAlt:
        "Professional headshot of man with short dark hair wearing gray suit and blue tie with confident smile",
    },
    {
      id: 2,
      name: "Jennifer Davis",
      relationship: "Sister",
      phone: "+1 (555) 345-6789",
      email: "jennifer.davis@email.com",
      address: "789 Maple Street, Springfield, IL 62702",
      occupation: "Teacher",
      monthlyIncome: 3800,
      photo:
        "https://img.rocket.new/generatedImages/rocket_gen_img_1985c262f-1763294244026.png",
      photoAlt:
        "Professional headshot of woman with long blonde hair wearing burgundy cardigan and pearl necklace with warm smile",
    },
  ];

  const mockDocuments = [
    {
      id: 1,
      name: "National ID Card",
      type: "ID Proof",
      uploadDate: "01/15/2024",
      size: 2457600,
    },
    {
      id: 2,
      name: "Utility Bill - January 2024",
      type: "Address Proof",
      uploadDate: "01/15/2024",
      size: 1843200,
    },
    {
      id: 3,
      name: "Business Income Statement",
      type: "Income Proof",
      uploadDate: "01/16/2024",
      size: 3276800,
    },
    {
      id: 4,
      name: "Passport Photo",
      type: "Photo",
      uploadDate: "01/15/2024",
      size: 512000,
    },
    {
      id: 5,
      name: "Bank Statement - December 2023",
      type: "Bank Statement",
      uploadDate: "01/16/2024",
      size: 2867200,
    },
  ];

  const mockLoans = [
    {
      id: 1,
      loanCode: "LN-2024-001",
      principal: 10000,
      interestRate: 12,
      totalPayable: 11200,
      outstanding: 8500,
      status: "Active",
      startDate: "01/20/2024",
    },
    {
      id: 2,
      loanCode: "LN-2023-045",
      principal: 8000,
      interestRate: 10,
      totalPayable: 8800,
      outstanding: 0,
      status: "Closed",
      startDate: "06/15/2023",
    },
    {
      id: 3,
      loanCode: "LN-2023-012",
      principal: 7000,
      interestRate: 11,
      totalPayable: 7770,
      outstanding: 0,
      status: "Closed",
      startDate: "02/10/2023",
    },
  ];

  const tabs = [
    { id: "personal", label: "Personal Info", icon: "User" },
    { id: "guarantors", label: "Guarantors", icon: "Users" },
    { id: "documents", label: "Documents", icon: "FileText" },
    { id: "loans", label: "Loans", icon: "Wallet" },
  ];

  const handleEdit = () => {
    console.log("Edit client profile");
  };

  const handleAddGuarantor = () => {
    console.log("Add guarantor");
  };

  const handleUploadDocument = () => {
    console.log("Upload document");
  };

  const handleDownloadDocument = (docId) => {
    console.log("Download document:", docId);
  };

  const handleDeleteDocument = (docId) => {
    console.log("Delete document:", docId);
  };

  const handleCreateLoan = () => {
    console.log("Create new loan");
  };

  return (
    <>
      {/* Back Button */}
      <div className="mb-4 md:mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate("/clients-management")}
          className="inline-flex items-center gap-2 text-sm md:text-base text-muted-foreground hover:text-foreground transition-colors duration-250"
        >
          <Icon name="ArrowLeft" size={20} />
          <span>Back to Clients</span>
        </button>
        <Icon name="User" size={28} className="text-primary ml-auto" />
      </div>

      {/* Tabs Navigation */}
      <div className="bg-card rounded-lg shadow-elevation-sm mb-4 md:mb-6 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="flex border-b border-border min-w-max">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-4 md:px-6 lg:px-8 py-3 md:py-4 text-sm md:text-base font-medium transition-colors duration-250 whitespace-nowrap ${
                  activeTab === tab?.id
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                <Icon name={tab?.icon} size={20} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Tab Content */}
      <div className="transition-opacity duration-250">
        {activeTab === "personal" && (
          <PersonalInfoTab customerId={clientId} onEdit={handleEdit} />
        )}
        {activeTab === "guarantors" && (
          <GuarantorsTab
            customerId={clientId}
            onAddGuarantor={handleAddGuarantor}
          />
        )}
        {activeTab === "documents" && (
          <DocumentsTab
            documents={mockDocuments}
            onUpload={handleUploadDocument}
            onDownload={handleDownloadDocument}
            onDelete={handleDeleteDocument}
          />
        )}
        {activeTab === "loans" && (
          <LoansTab customerId={clientId} onCreateLoan={handleCreateLoan} />
        )}
      </div>
    </>
  );
};

export default ClientProfile;
