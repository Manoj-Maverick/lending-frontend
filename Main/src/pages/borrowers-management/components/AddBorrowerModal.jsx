import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import DocumentCaptureField from "../../../components/ui/DocumentCaptureField";
import PhoneVerification from "auth/PhoneVerification";
import { useCreateBorrower } from "hooks/borrowers/useCreateBorrower";
import { useToast } from "context/ToastContext";
import { useUIContext } from "context/UIContext";
import { useGenerateCustomerCode } from "hooks/generators/useGenerateCustomerCode";
import { useAuth } from "auth/AuthContext";

import pincodeLookup from "../../../DataSet/tamil_nadu_pincode_lookup.json";

const AddBorrowerModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [addGuarantorNow, setAddGuarantorNow] = useState(false);
  const { mutate: createBorrower, isPending, error } = useCreateBorrower();
  const { showToast } = useToast();
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [guarantorPhoneVerified, setGuarantorPhoneVerified] = useState(false);
  const { mutate: generateCustomerCode } = useGenerateCustomerCode();

  // Dynamic area options populated from pincode lookup
  const [borrowerAreas, setBorrowerAreas] = useState([]);
  const [guarantorAreas, setGuarantorAreas] = useState([]);

  const [formData, setFormData] = useState({
    fullName: "Ravi Kumar",
    dateOfBirth: "1994-08-15",
    gender: "Male",
    maritalStatus: "Married",
    email: "ravi.kumar94@gmail.com",
    phone: "9876543210",
    alternatePhone: "9123456780",
    occupation: "Shop Owner",
    monthlyIncome: "35000",
    aadhaarNumber: "567812349876",
    panNumber: "ABCDE1234F",
    addressLine1: "12, MG Road",
    addressLine2: "Near Bus Stand",
    area: "", // renamed from city
    district: "", // new field
    state: "Tamil Nadu",
    pincode: "641001",
    residenceType: "Owned",
    yearsAtAddress: "6",
    bankName: "State Bank of India",
    accountNumber: "123456789012",
    ifscCode: "SBIN0000456",
    accountType: "Savings",
    accountHolderName: "Ravi Kumar",
    guarantorFullName: "",
    guarantorPhone: "",
    guarantorRelation: "",
    guarantorAddress: "",
    guarantorOccupation: "",
    guarantorMonthlyIncome: "",
    guarantorAadhaar: "",
    guarantorPan: "",
    guarantorAlternatePhone: "",
    guarantorEmail: "",
    guarantorArea: "", // renamed from guarantorCity
    guarantorDistrict: "", // new field
    guarantorState: "",
    guarantorPincode: "",
    photo: null,
    idProof: null,
    addressProof: null,
    incomeProof: null,
    branch: null,
    customerCode: "",
  });
  const { branches } = useUIContext();
  const [errors, setErrors] = useState({});

  const steps = [
    { number: 1, title: "Personal", icon: "User" },
    { number: 2, title: "Address", icon: "MapPin" },
    { number: 3, title: "Bank & KYC", icon: "CreditCard" },
    { number: 4, title: "Guarantor", icon: "Users" },
    { number: 5, title: "Documents", icon: "FileText" },
  ];

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const maritalStatusOptions = [
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "divorced", label: "Divorced" },
  ];

  const residenceTypeOptions = [
    { value: "owned", label: "Owned" },
    { value: "rented", label: "Rented" },
    { value: "family", label: "Family Owned" },
  ];

  const accountTypeOptions = [
    { value: "savings", label: "Savings" },
    { value: "current", label: "Current" },
  ];

  const branchOptions = [
    ...branches.map((b) => ({ value: b.id, label: b.branch_name })),
  ];

  useEffect(() => {
    if (!isOpen) return;

    if (user?.role !== "ADMIN" && user?.branchId) {
      setFormData((prev) => ({
        ...prev,
        branch: prev.branch || user.branchId,
      }));
    }
  }, [isOpen, user?.branchId, user?.role]);

  const relationOptions = [
    { value: "father", label: "Father" },
    { value: "mother", label: "Mother" },
    { value: "spouse", label: "Spouse" },
    { value: "sibling", label: "Brother/Sister" },
    { value: "friend", label: "Friend" },
    { value: "other", label: "Other" },
  ];

  // Existing customer code preview logic (unchanged)
  useEffect(() => {
    if (!formData.branch) return;

    const selectedBranch = branches.find((b) => b.id === formData.branch);

    if (!selectedBranch?.branch_code) return;

    const cityArea = selectedBranch.branch_code.split("-")[1].slice(0, 6);

    const year = new Date().getFullYear();

    const preview = `${cityArea}${year}####`;

    setFormData((prev) => ({
      ...prev,
      customerCode: preview,
    }));
  }, [formData.branch, branches]);

  // ==================== AUTO-POPULATE LOGIC FOR BORROWER ====================
  useEffect(() => {
    const pin = formData.pincode;
    if (!pin || pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      setBorrowerAreas([]);
      setFormData((prev) => ({ ...prev, district: "", area: "" }));
      return;
    }

    const data = pincodeLookup[pin];
    if (data && data.length > 0) {
      const districtVal = data[0].district;
      const areasList = data.map((item) => ({
        value: item.area,
        label: item.area,
      }));

      setBorrowerAreas(areasList);

      setFormData((prev) => ({
        ...prev,
        district: districtVal,
        state: "Tamil Nadu",
      }));
    } else {
      setBorrowerAreas([]);
      setFormData((prev) => ({ ...prev, district: "", area: "" }));
      showToast(
        "Invalid Pincode! This pincode is not found in our Tamil Nadu database.",
        "error",
      );
    }
  }, [formData.pincode]);

  // ==================== AUTO-POPULATE LOGIC FOR GUARANTOR ====================
  useEffect(() => {
    const pin = formData.guarantorPincode;
    if (!pin || pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      setGuarantorAreas([]);
      setFormData((prev) => ({
        ...prev,
        guarantorDistrict: "",
        guarantorArea: "",
      }));
      return;
    }

    const data = pincodeLookup[pin];
    if (data && data.length > 0) {
      const districtVal = data[0].district;
      const areasList = data.map((item) => ({
        value: item.area,
        label: item.area,
      }));

      setGuarantorAreas(areasList);

      setFormData((prev) => ({
        ...prev,
        guarantorDistrict: districtVal,
        guarantorState: "Tamil Nadu",
        guarantorArea:
          prev.guarantorArea &&
          areasList.some((a) => a.value === prev.guarantorArea)
            ? prev.guarantorArea
            : areasList[0]?.value || "",
      }));
    } else {
      setGuarantorAreas([]);
      setFormData((prev) => ({
        ...prev,
        guarantorDistrict: "",
        guarantorArea: "",
      }));
      showToast(
        "Invalid Pincode for Guarantor! This pincode is not found in our Tamil Nadu database.",
        "error",
      );
    }
  }, [formData.guarantorPincode]);

  const handleInputChange = (field, value) => {
    if (field === "phone") {
      setPhoneVerified(false);
    }

    if (field === "guarantorPhone") {
      setGuarantorPhoneVerified(false);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    /* -----------------------
STEP 1 — PERSONAL
----------------------- */

    if (step === 1) {
      if (!formData.fullName?.trim())
        newErrors.fullName = "Full name is required";

      if (!formData.dateOfBirth)
        newErrors.dateOfBirth = "Date of birth is required";

      if (!formData.gender) newErrors.gender = "Gender is required";

      if (!formData.phone?.trim()) newErrors.phone = "Phone is required";
      else if (!/^\d{10}$/.test(formData.phone))
        newErrors.phone = "Phone must be 10 digits";
      else if (!phoneVerified) newErrors.phone = "Phone must be verified";

      if (formData.alternatePhone && !/^\d{10}$/.test(formData.alternatePhone))
        newErrors.alternatePhone = "Invalid alternate phone";

      if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email))
        newErrors.email = "Invalid email format";

      if (formData.monthlyIncome && isNaN(formData.monthlyIncome))
        newErrors.monthlyIncome = "Income must be numeric";
    }

    /* -----------------------
STEP 2 — ADDRESS (with auto-populated Area + District)
----------------------- */

    if (step === 2) {
      if (!formData.addressLine1?.trim())
        newErrors.addressLine1 = "Address is required";

      if (!formData.area?.trim()) newErrors.area = "Area is required";

      if (!formData.district?.trim())
        newErrors.district = "District is required";

      if (!formData.state?.trim()) newErrors.state = "State is required";

      if (!formData.pincode?.trim()) newErrors.pincode = "Pincode is required";
      else if (!/^\d{6}$/.test(formData.pincode))
        newErrors.pincode = "Invalid pincode";
    }

    /* -----------------------
STEP 3 — BANK + KYC
----------------------- */

    if (step === 3) {
      if (!formData.bankName?.trim())
        newErrors.bankName = "Bank name is required";

      if (!formData.accountNumber?.trim())
        newErrors.accountNumber = "Account number is required";
      else if (!/^\d{9,18}$/.test(formData.accountNumber))
        newErrors.accountNumber = "Invalid account number";

      if (!formData.ifscCode?.trim())
        newErrors.ifscCode = "IFSC code is required";
      else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode))
        newErrors.ifscCode = "Invalid IFSC code";

      if (!formData.accountType)
        newErrors.accountType = "Account type is required";

      if (!formData.accountHolderName?.trim())
        newErrors.accountHolderName = "Account holder name is required";

      if (formData.aadhaarNumber && !/^\d{12}$/.test(formData.aadhaarNumber))
        newErrors.aadhaarNumber = "Aadhaar must be 12 digits";

      if (
        formData.panNumber &&
        !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)
      )
        newErrors.panNumber = "Invalid PAN format";
    }

    /* -----------------------
STEP 4 — GUARANTOR (with auto-populated Area + District)
----------------------- */

    if (step === 4 && addGuarantorNow) {
      if (!formData.guarantorFullName?.trim())
        newErrors.guarantorFullName = "Guarantor name is required";

      if (!formData.guarantorPhone?.trim())
        newErrors.guarantorPhone = "Guarantor phone is required";
      else if (!/^\d{10}$/.test(formData.guarantorPhone))
        newErrors.guarantorPhone = "Invalid phone";
      else if (!guarantorPhoneVerified)
        newErrors.guarantorPhone = "Verification required";

      if (!formData.guarantorRelation)
        newErrors.guarantorRelation = "Relation is required";

      // New required fields for guarantor (consistent with borrower)
      if (!formData.guarantorArea?.trim())
        newErrors.guarantorArea = "Area is required";

      if (!formData.guarantorDistrict?.trim())
        newErrors.guarantorDistrict = "District is required";

      if (
        formData.guarantorAlternatePhone &&
        !/^\d{10}$/.test(formData.guarantorAlternatePhone)
      )
        newErrors.guarantorAlternatePhone = "Invalid alternate phone";

      if (
        formData.guarantorEmail &&
        !/^\S+@\S+\.\S+$/.test(formData.guarantorEmail)
      )
        newErrors.guarantorEmail = "Invalid email";

      if (
        formData.guarantorMonthlyIncome &&
        isNaN(formData.guarantorMonthlyIncome)
      )
        newErrors.guarantorMonthlyIncome = "Income must be numeric";

      if (
        formData.guarantorPincode &&
        !/^\d{6}$/.test(formData.guarantorPincode)
      )
        newErrors.guarantorPincode = "Invalid pincode";

      if (
        formData.guarantorAadhaar &&
        !/^\d{12}$/.test(formData.guarantorAadhaar)
      )
        newErrors.guarantorAadhaar = "Invalid Aadhaar";

      if (
        formData.guarantorPan &&
        !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.guarantorPan)
      )
        newErrors.guarantorPan = "Invalid PAN";
    }

    /* -----------------------
STEP 5 — DOCUMENTS + BRANCH
----------------------- */

    if (step === 5) {
      if (!formData.branch) newErrors.branch = "Please select a branch";

      if (formData.photo && formData.photo.size > 5 * 1024 * 1024)
        newErrors.photo = "Photo must be under 5MB";

      if (formData.idProof && formData.idProof.size > 10 * 1024 * 1024)
        newErrors.idProof = "ID proof must be under 10MB";

      if (
        formData.addressProof &&
        formData.addressProof.size > 10 * 1024 * 1024
      )
        newErrors.addressProof = "Address proof must be under 10MB";

      if (formData.incomeProof && formData.incomeProof.size > 10 * 1024 * 1024)
        newErrors.incomeProof = "Income proof must be under 10MB";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (!validateStep(currentStep)) return;

    const selectedBranch = branches.find((b) => b.id === formData.branch);

    if (!selectedBranch?.branch_code) {
      showToast("Invalid branch selected", "error");
      return;
    }

    // Generate REAL customer code
    generateCustomerCode(
      {
        branchCode: selectedBranch.branch_code,
      },
      {
        onSuccess: (realCustomerCode) => {
          const fd = new FormData();

          // Append text fields (now includes "area" and "district")
          Object.entries(formData).forEach(([key, value]) => {
            if (
              value !== null &&
              value !== undefined &&
              key !== "photo" &&
              key !== "idProof" &&
              key !== "addressProof" &&
              key !== "incomeProof"
            ) {
              fd.append(key, value);
            }
          });

          // overwrite preview with real code
          fd.set("customerCode", realCustomerCode);

          // Append files
          if (formData.photo) fd.append("photo", formData.photo);
          if (formData.idProof) fd.append("idProof", formData.idProof);
          if (formData.addressProof)
            fd.append("addressProof", formData.addressProof);
          if (formData.incomeProof)
            fd.append("incomeProof", formData.incomeProof);

          createBorrower(fd, {
            onSuccess: () => {
              showToast("Borrower created successfully", "success");

              setTimeout(() => {
                handleClose();
              }, 1000);
            },
            onError: (err) => {
              console.error("Create borrower failed:", err);

              showToast(
                err?.message || "Failed to create borrower. Please try again.",
                "error",
              );
            },
          });
        },

        onError: (err) => {
          console.error("Customer code generation failed:", err);
          showToast("Failed to generate customer code", "error");
        },
      },
    );
  };

  const handleClose = () => {
    setCurrentStep(1);
    setAddGuarantorNow(false);
    setFormData({
      fullName: "",
      dateOfBirth: "",
      gender: "",
      maritalStatus: "",
      email: "",
      phone: "",
      alternatePhone: "",
      occupation: "",
      monthlyIncome: "",
      aadhaarNumber: "",
      panNumber: "",
      addressLine1: "",
      addressLine2: "",
      area: "",
      district: "",
      state: "",
      pincode: "",
      residenceType: "",
      yearsAtAddress: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      accountType: "",
      accountHolderName: "",
      guarantorFullName: "",
      guarantorPhone: "",
      guarantorRelation: "",
      guarantorAddress: "",
      guarantorOccupation: "",
      guarantorMonthlyIncome: "",
      guarantorAadhaar: "",
      guarantorPan: "",
      guarantorAlternatePhone: "",
      guarantorEmail: "",
      guarantorArea: "",
      guarantorDistrict: "",
      guarantorState: "",
      guarantorPincode: "",
      photo: null,
      idProof: null,
      addressProof: null,
      incomeProof: null,
      branch: "",
      customerCode: "",
    });
    setPhoneVerified(false);
    setGuarantorPhoneVerified(false);
    setErrors({});
    setBorrowerAreas([]);
    setGuarantorAreas([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[96vh] sm:max-h-[92vh] overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Add New Borrower
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
              Fill in the details to create a new borrower profile
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Icon
              name="X"
              size={22}
              className="text-gray-600 dark:text-gray-300 sm:size-24"
            />
          </button>
        </div>

        {/* Responsive Progress Bar */}
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex flex-wrap items-center mx-auto justify-center sm:justify-between gap-2 sm:gap-0 max-w-full sm:max-w-3xl">
            {steps.map((step, idx) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all flex-shrink-0 ${
                      currentStep === step.number
                        ? "bg-blue-600 text-white ring-2 ring-blue-300"
                        : currentStep > step.number
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Icon name="Check" size={18} className="sm:size-20" />
                    ) : (
                      step.number
                    )}
                  </div>

                  {/* Title - hidden on small screens, shown on md+ */}
                  <span className="text-[10px] sm:text-xs mt-1.5 sm:mt-2 font-medium text-gray-600 dark:text-gray-300 hidden sm:block whitespace-nowrap">
                    {step.title}
                  </span>
                </div>

                {idx < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 min-w-[16px] sm:min-w-[32px] mx-1 sm:mx-4 ${
                      currentStep > step.number
                        ? "bg-green-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <Input
                label="Full Name"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                required
                error={errors.fullName}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                  required
                  error={errors.dateOfBirth}
                />
                <Select
                  label="Gender"
                  options={genderOptions}
                  value={formData.gender}
                  onChange={(v) => handleInputChange("gender", v)}
                  required
                  error={errors.gender}
                />
              </div>
              <Select
                label="Marital Status"
                options={maritalStatusOptions}
                value={formData.maritalStatus}
                onChange={(v) => handleInputChange("maritalStatus", v)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone + Verification in SAME column */}
                <div className="space-y-4">
                  <Input
                    label="Phone Number"
                    type="tel"
                    disabled={phoneVerified}
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                    error={phoneVerified ? "" : errors.phone}
                  />
                  <PhoneVerification
                    phone={formData.phone}
                    verified={phoneVerified}
                    onVerified={() => setPhoneVerified(true)}
                  />
                </div>

                {/* Alternate Phone stays in the second column */}
                <Input
                  label="Alternate Phone"
                  type="tel"
                  value={formData.alternatePhone}
                  onChange={(e) =>
                    handleInputChange("alternatePhone", e.target.value)
                  }
                />
              </div>
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Occupation"
                  value={formData.occupation}
                  onChange={(e) =>
                    handleInputChange("occupation", e.target.value)
                  }
                />
                <Input
                  label="Monthly Income (₹)"
                  type="number"
                  value={formData.monthlyIncome}
                  onChange={(e) =>
                    handleInputChange("monthlyIncome", e.target.value)
                  }
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <Input
                label="Address Line 1"
                value={formData.addressLine1}
                onChange={(e) =>
                  handleInputChange("addressLine1", e.target.value)
                }
                required
                error={errors.addressLine1}
              />
              <Input
                label="Address Line 2 (optional)"
                value={formData.addressLine2}
                onChange={(e) =>
                  handleInputChange("addressLine2", e.target.value)
                }
              />

              {/* Pincode first (triggers auto-population) */}
              <Input
                label="Pincode"
                value={formData.pincode}
                onChange={(e) => handleInputChange("pincode", e.target.value)}
                required
                error={errors.pincode}
                maxLength={6}
              />

              {/* Area (Select populated from JSON) + District + State */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Select
                  label="Area"
                  options={borrowerAreas}
                  value={formData.area}
                  onChange={(v) => handleInputChange("area", v)}
                  required
                  error={errors.area}
                />
                <Input
                  label="District"
                  value={formData.district}
                  onChange={(e) =>
                    handleInputChange("district", e.target.value)
                  }
                  required
                  error={errors.district}
                />
                <Input
                  label="State"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  required
                  error={errors.state}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Residence Type"
                  options={residenceTypeOptions}
                  value={formData.residenceType}
                  onChange={(v) => handleInputChange("residenceType", v)}
                />
                <Input
                  label="Years at this Address"
                  type="number"
                  value={formData.yearsAtAddress}
                  onChange={(e) =>
                    handleInputChange("yearsAtAddress", e.target.value)
                  }
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <Input
                label="Bank Name"
                value={formData.bankName}
                onChange={(e) => handleInputChange("bankName", e.target.value)}
                required
                error={errors.bankName}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Account Number"
                  value={formData.accountNumber}
                  onChange={(e) =>
                    handleInputChange("accountNumber", e.target.value)
                  }
                  required
                  error={errors.accountNumber}
                />
                <Input
                  label="IFSC Code"
                  value={formData.ifscCode}
                  onChange={(e) =>
                    handleInputChange("ifscCode", e.target.value)
                  }
                  required
                  error={errors.ifscCode}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Account Type"
                  options={accountTypeOptions}
                  value={formData.accountType}
                  onChange={(v) => handleInputChange("accountType", v)}
                  required
                  error={errors.accountType}
                />
                <Input
                  label="Account Holder Name"
                  value={formData.accountHolderName}
                  onChange={(e) =>
                    handleInputChange("accountHolderName", e.target.value)
                  }
                  required
                  error={errors.accountHolderName}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Aadhaar Number"
                  value={formData.aadhaarNumber}
                  onChange={(e) =>
                    handleInputChange("aadhaarNumber", e.target.value)
                  }
                  maxLength={12}
                />
                <Input
                  label="PAN Number"
                  value={formData.panNumber}
                  onChange={(e) =>
                    handleInputChange("panNumber", e.target.value)
                  }
                  maxLength={10}
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Guarantor Information
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {addGuarantorNow
                      ? "Enter guarantor details now"
                      : "You can add a guarantor later from the borrower profile"}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setAddGuarantorNow(false)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      !addGuarantorNow
                        ? "bg-gray-800 text-white shadow-md"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    Add Later
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddGuarantorNow(true)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      addGuarantorNow
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    Add Now
                  </button>
                </div>
              </div>

              {addGuarantorNow && (
                <div className="space-y-6 pt-4 animate-fade-in">
                  <Input
                    label="Guarantor Full Name"
                    value={formData.guarantorFullName}
                    onChange={(e) =>
                      handleInputChange("guarantorFullName", e.target.value)
                    }
                    required
                    error={errors.guarantorFullName}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Input
                        label="Phone Number"
                        type="tel"
                        disabled={guarantorPhoneVerified}
                        value={formData.guarantorPhone}
                        onChange={(e) =>
                          handleInputChange("guarantorPhone", e.target.value)
                        }
                        required
                        error={
                          guarantorPhoneVerified ? "" : errors.guarantorPhone
                        }
                      />
                      <PhoneVerification
                        phone={formData.guarantorPhone}
                        verified={guarantorPhoneVerified}
                        onVerified={() => setGuarantorPhoneVerified(true)}
                      />
                    </div>

                    <Select
                      label="Relation"
                      options={relationOptions}
                      value={formData.guarantorRelation}
                      onChange={(v) =>
                        handleInputChange("guarantorRelation", v)
                      }
                      required
                      error={errors.guarantorRelation}
                    />
                  </div>
                  <Input
                    label="Address"
                    value={formData.guarantorAddress}
                    onChange={(e) =>
                      handleInputChange("guarantorAddress", e.target.value)
                    }
                  />

                  {/* Guarantor Pincode (triggers auto-population) */}
                  <Input
                    label="Pincode"
                    value={formData.guarantorPincode}
                    onChange={(e) =>
                      handleInputChange("guarantorPincode", e.target.value)
                    }
                    maxLength={6}
                    error={errors.guarantorPincode}
                  />

                  {/* Area (Select) + District + State */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Select
                      label="Area"
                      options={guarantorAreas}
                      value={formData.guarantorArea}
                      onChange={(v) => handleInputChange("guarantorArea", v)}
                      error={errors.guarantorArea}
                    />
                    <Input
                      label="District"
                      value={formData.guarantorDistrict}
                      onChange={(e) =>
                        handleInputChange("guarantorDistrict", e.target.value)
                      }
                      error={errors.guarantorDistrict}
                    />
                    <Input
                      label="State"
                      value={formData.guarantorState}
                      onChange={(e) =>
                        handleInputChange("guarantorState", e.target.value)
                      }
                      error={errors.guarantorState}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Occupation"
                      value={formData.guarantorOccupation}
                      onChange={(e) =>
                        handleInputChange("guarantorOccupation", e.target.value)
                      }
                    />
                    <Input
                      label="Monthly Income (₹)"
                      type="number"
                      value={formData.guarantorMonthlyIncome}
                      onChange={(e) =>
                        handleInputChange(
                          "guarantorMonthlyIncome",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Aadhaar Number"
                      value={formData.guarantorAadhaar}
                      onChange={(e) =>
                        handleInputChange("guarantorAadhaar", e.target.value)
                      }
                      maxLength={12}
                    />
                    <Input
                      label="PAN Number"
                      value={formData.guarantorPan}
                      onChange={(e) =>
                        handleInputChange("guarantorPan", e.target.value)
                      }
                      maxLength={10}
                    />
                  </div>
                </div>
              )}

              {!addGuarantorNow && (
                <div className="py-10 text-center text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl">
                  <Icon
                    name="Users"
                    size={48}
                    className="mx-auto mb-4 opacity-60"
                  />
                  <p className="text-lg font-medium">
                    No guarantor added at this time
                  </p>
                  <p className="text-sm mt-2">
                    You can add one later from the borrower profile page
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DocumentCaptureField
                  label="Borrower Photo"
                  accept="image/*"
                  value={formData.photo}
                  onChange={(file) => handleInputChange("photo", file)}
                  helperText="Profile photo"
                />
                <DocumentCaptureField
                  label="ID Proof (Aadhaar/PAN)"
                  accept=".pdf,image/*"
                  value={formData.idProof}
                  onChange={(file) => handleInputChange("idProof", file)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DocumentCaptureField
                  label="Address Proof"
                  accept=".pdf,image/*"
                  value={formData.addressProof}
                  onChange={(file) => handleInputChange("addressProof", file)}
                />
                <DocumentCaptureField
                  label="Income Proof (optional)"
                  accept=".pdf,image/*"
                  value={formData.incomeProof}
                  onChange={(file) => handleInputChange("incomeProof", file)}
                />
              </div>
              {user?.role === "ADMIN" ? (
                <Select
                  label="Assign to Branch"
                  options={branchOptions}
                  value={formData.branch}
                  onChange={(v) => handleInputChange("branch", v)}
                  required
                  error={errors.branch}
                />
              ) : (
                <Input
                  label="Assigned Branch"
                  value={
                    branchOptions.find((branch) => branch.value === formData.branch)?.label ||
                    branchOptions.find((branch) => String(branch.value) === String(formData.branch))?.label ||
                    ""
                  }
                  disabled
                  readOnly
                />
              )}
              <Input
                label="Customer Code"
                value={formData.customerCode}
                placeholder={"customer code "}
                onChange={(e) =>
                  handleInputChange("customerCode", e.target.value)
                }
                disabled
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between text-sm">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            size="sm"
          >
            <Icon name="ChevronLeft" className="mr-1.5" size={16} />
            Back
          </Button>

          <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
            Step {currentStep} of {steps.length}
          </div>

          {currentStep < steps.length ? (
            <Button onClick={handleNext} size="sm">
              Next
              <Icon name="ChevronRight" className="ml-1.5" size={16} />
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              iconName={isPending ? "Loader" : "Check"}
              iconPosition="left"
              disabled={isPending}
              size="sm"
            >
              {isPending ? "Creating Borrower..." : "Create Borrower"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddBorrowerModal;
