import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Icon from "../../components/AppIcon";
import PersonalInfoTab from "./components/PersonalInfoTab";
import GuarantorsTab from "./components/GuarantorsTab";
import DocumentsTab from "./components/DocumentsTab";
import LoansTab from "./components/LoansTab";
import { useParams } from "react-router-dom";
import { useGetISBlocked } from "hooks/borrowers/useGetIsBlocked";
import { useUIContext } from "context/UIContext";
const BorrowerProfile = () => {
  const navigate = useNavigate();
  const { borrowerId: routeBorrowerId } = useParams();
  const location = useLocation();
  const borrowerId = routeBorrowerId;
  const { data: isBlocked } = useGetISBlocked(borrowerId);
  const [activeTab, setActiveTab] = useState("personal");
  const { showToast } = useUIContext();

  const tabs = [
    { id: "personal", label: "Personal Info", icon: "User" },
    { id: "guarantors", label: "Guarantors", icon: "Users" },
    { id: "loans", label: "Loans", icon: "Wallet" },
  ];

  const handleEdit = () => {
    console.log("Edit borrower profile");
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
          onClick={() => navigate("/borrowers-management")}
          className="inline-flex items-center gap-2 text-sm md:text-base text-muted-foreground hover:text-foreground transition-colors duration-250"
        >
          <Icon name="ArrowLeft" size={20} />
          <span>Back to Borrowers</span>
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
          <PersonalInfoTab borrowerId={borrowerId} onEdit={handleEdit} />
        )}
        {activeTab === "guarantors" && (
          <GuarantorsTab
            borrowerId={borrowerId}
            onAddGuarantor={handleAddGuarantor}
            isBlocked={isBlocked}
            showToast={showToast}
          />
        )}
        {activeTab === "loans" && (
          <LoansTab
            borrowerId={borrowerId}
            onCreateLoan={handleCreateLoan}
            isBlocked={isBlocked}
            showToast={showToast}
          />
        )}
      </div>
    </>
  );
};

export default BorrowerProfile;
