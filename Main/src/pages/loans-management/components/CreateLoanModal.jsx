import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import DocumentCaptureField from "../../../components/ui/DocumentCaptureField";
import { useAuth } from "auth/AuthContext";
import { useCreateLoan } from "hooks/loans/useCreateLoan";
import { useToast } from "context/ToastContext";
import { useBorrowerGuarantors } from "hooks/borrowers/useBorrowerDetails";
import { useBorrowerDetails } from "hooks/borrowers/useBorrowerDetails";
// Fixed dummy borrower
const DUMMY_BORROWER = {
  id: "CUS0418",
  name: "Rani Das",
  phone: "8510946946",
  code: "CUS0418",
  aadhaar_last4: "6946",
};

const CreateLoanModal = ({ borrowerId, isOpen, onClose, oldLoanId }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [guarantorMode, setGuarantorMode] = useState("new"); // only "existing" | "new" now
  const { mutate: createLoan, isPending } = useCreateLoan();
  const { data: guarantors = [] } = useBorrowerGuarantors(borrowerId);
  const { showToast } = useToast();
  const today = new Date().toISOString().split("T")[0];
  const { data: borrower } = useBorrowerDetails(borrowerId);

  const [formData, setFormData] = useState({
    // 1–4 Basic Identity
    loan_code: `LN-CDL-2025-${String(1000 + Math.floor(Math.random() * 9000)).padStart(5, "0")}`,
    customer_id: null,
    branch_id: null,
    parent_loan_id: oldLoanId ? oldLoanId : null,

    // 5–9 Financial Core
    principal_amount: "15000",
    interest_rate: "18",
    interest_type: "FLAT",
    interest_amount: "0",
    total_payable: "0",

    // 10–13 Tenure & Repayment
    tenure_value: "24",
    tenure_unit: "WEEK",
    repayment_type: "WEEKLY",
    repayment_interval: 1,
    installment_amount: "0",

    // 14–17 Dates
    sanctioned_date: today,
    start_date: "",
    last_due_date: "",
    collection_weekday: "",

    // 18–20 Charges & Rules
    processing_fee: "500",
    penalty_rate: "2.00",
    grace_days: "3",

    // 21–22 Status
    status: "ACTIVE",

    // 23–25 Approval & Audit
    approved_by: user.id,
    approved_at: today,

    // 26 Extra
    week_day: "",

    // Guarantor fields (new + existing)
    guarantor_id: "", // for existing
    guarantorFullName: "Sunil Kumar Yadav",
    guarantorPhone: "9823456781",
    guarantorAlternatePhone: "9123789456",
    guarantorEmail: "sunil.yadav84@gmail.com",
    guarantorRelation: "brother",
    guarantorAddress: "45, Patel Nagar",
    guarantorCity: "Delhi",
    guarantorState: "Delhi",
    guarantorPincode: "110008",
    guarantorOccupation: "Shopkeeper",
    guarantorMonthlyIncome: "28000",
    guarantorAadhaar: "123456789012",
    guarantorPan: "ABCDE1234F",
    guarantor_photo: null,
    guarantor_aadhar_doc: null,
    guarantor_pan_doc: null,

    // Loan documents (new section)
    loan_agreement: null,
    promissory_note: null,
    signature_sheet: null,
    other_document: null,
  });
  const [errors, setErrors] = useState({});

  const existingGuarantors = [
    ...guarantors.map((g) => ({
      id: g.id,
      fullName: g.full_name,
      phone: g.phone,
    })),
    //
  ];

  const relationOptions = [
    { value: "father", label: "Father" },
    { value: "mother", label: "Mother" },
    { value: "spouse", label: "Spouse" },
    { value: "sibling", label: "Brother/Sister" },
    { value: "friend", label: "Friend" },
    { value: "other", label: "Other" },
  ];

  const steps = [
    { number: 1, title: "Loan Terms" },
    { number: 2, title: "Schedule" },
    { number: 3, title: "Guarantor & Loan Docs" },
  ];

  const interestTypeOptions = [
    { value: "FLAT", label: "Flat Interest" },
    { value: "REDUCING", label: "Reducing Balance" },
  ];

  const repaymentTypeOptions = [
    { value: "WEEKLY", label: "Weekly" },
    { value: "MONTHLY", label: "Monthly" },
    { value: "DAILY", label: "Daily" },
  ];

  const weekdayOptions = [
    { value: "MON", label: "Monday" },
    { value: "TUE", label: "Tuesday" },
    { value: "WED", label: "Wednesday" },
    { value: "THU", label: "Thursday" },
    { value: "FRI", label: "Friday" },
    { value: "SAT", label: "Saturday" },
    { value: "SUN", label: "Sunday" },
  ];
  useEffect(() => {
    formData.branch_id = borrower?.branchId;
    formData.customer_id = borrower?.id;
  }, [borrower]);

  // Sync tenure_unit based on repayment_type
  useEffect(() => {
    let newUnit = "WEEK";
    if (formData.repayment_type === "MONTHLY") newUnit = "MONTH";
    if (formData.repayment_type === "DAILY") newUnit = "DAY";

    if (newUnit !== formData.tenure_unit) {
      setFormData((prev) => ({ ...prev, tenure_unit: newUnit }));
    }
  }, [formData.repayment_type]);

  // Auto-detect collection_weekday from selected start_date
  useEffect(() => {
    if (!formData.start_date) {
      setFormData((prev) => ({ ...prev, collection_weekday: "" }));
      return;
    }

    const date = new Date(formData.start_date);
    const dayIndex = date.getDay();
    const weekdayMap = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const detected = weekdayMap[dayIndex];

    if (detected !== formData.collection_weekday) {
      setFormData((prev) => ({
        ...prev,
        collection_weekday: detected,
        week_day: detected,
      }));
    }
  }, [formData.start_date]);

  // Calculate last due date
  useEffect(() => {
    if (
      !formData.start_date ||
      !formData.tenure_value ||
      !formData.tenure_unit
    ) {
      setFormData((prev) => ({ ...prev, last_due_date: "" }));
      return;
    }

    const start = new Date(formData.start_date);
    let days = 0;

    if (formData.tenure_unit === "WEEK")
      days = Number(formData.tenure_value) * 7;
    else if (formData.tenure_unit === "MONTH")
      days = Number(formData.tenure_value) * 30;
    else if (formData.tenure_unit === "DAY")
      days = Number(formData.tenure_value);

    const end = new Date(start);
    end.setDate(end.getDate() + days - 1);

    setFormData((prev) => ({
      ...prev,
      last_due_date: end.toISOString().split("T")[0],
    }));
  }, [formData.start_date, formData.tenure_value, formData.tenure_unit]);

  const calculateInstallment = () => {
    const p = Number(formData.principal_amount) || 0;
    const r = Number(formData.interest_rate) || 0;
    const t = Number(formData.tenure_value) || 0;
    if (p <= 0 || r <= 0 || t <= 0) return "0";

    let interest =
      formData.interest_type === "FLAT"
        ? p * (r / 100)
        : p * (r / 100) * (t / 24); // rough estimate

    return Math.round((p + interest) / t).toString();
  };

  const generatePaymentSchedule = () => {
    if (
      !formData.start_date ||
      !formData.tenure_value ||
      !formData.principal_amount
    )
      return [];

    const schedule = [];
    const start = new Date(formData.start_date);
    const tenure = Number(formData.tenure_value);
    const emi = calculateInstallment();
    const now = new Date();

    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    for (let i = 1; i <= tenure; i++) {
      const due = new Date(start);

      if (formData.tenure_unit === "WEEK") {
        due.setDate(due.getDate() + (i - 1) * 7);
      } else if (formData.tenure_unit === "MONTH") {
        due.setMonth(due.getMonth() + (i - 1));
      } else {
        due.setDate(due.getDate() + (i - 1));
      }

      const dayName = weekdays[due.getDay()];
      const dueStr = `${due.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })} (${dayName})`;

      let status = "PENDING";
      let fine = "0";

      const total = (Number(emi) + Number(fine)).toString();

      schedule.push({
        installment: i,
        dueDate: dueStr,
        emi: Number(emi).toLocaleString("en-IN"),
        fine: Number(fine).toLocaleString("en-IN"),
        totalDue: Number(total).toLocaleString("en-IN"),
        status,
      });
    }
    return schedule;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (
        !formData.principal_amount ||
        Number(formData.principal_amount) < 1000
      )
        newErrors.principal_amount = "Minimum ₹1,000";
      if (!formData.interest_rate) newErrors.interest_rate = "Required";
      if (!formData.tenure_value) newErrors.tenure_value = "Required";
      if (!formData.start_date) newErrors.start_date = "Required";
      if (!formData.purpose?.trim()) newErrors.purpose = "Required";
    }
    if (step === 3) {
      if (guarantorMode === "new") {
        if (!formData.guarantorFullName?.trim())
          newErrors.guarantorFullName = "Required";
        if (!formData.guarantorPhone?.trim())
          newErrors.guarantorPhone = "Required";
        else if (!/^\d{10}$/.test(formData.guarantorPhone))
          newErrors.guarantorPhone = "Invalid phone";
        if (!formData.guarantorRelation)
          newErrors.guarantorRelation = "Required";
      }
      if (guarantorMode === "existing" && !formData.guarantor_id) {
        newErrors.guarantor_id = "Please select a guarantor";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) setCurrentStep((p) => p + 1);
  };

  const handleBack = () => setCurrentStep((p) => p - 1);

  const handleSubmit = () => {
    if (!validateStep(currentStep)) return;

    const fd = new FormData();

    // ─────────────────────────────
    // 1️⃣ Calculate derived values
    // ─────────────────────────────
    const emi = calculateInstallment();
    const totalPayable = Number(emi) * Number(formData.tenure_value || 0);

    const interestAmount = (
      (Number(formData.principal_amount) * Number(formData.interest_rate)) /
      100
    ).toFixed(2);

    // ─────────────────────────────
    // 2️⃣ Build STRUCTURED OBJECTS
    // ─────────────────────────────

    const loan = {
      identity: {
        loan_code: formData.loan_code,
        customer_id: formData.customer_id,
        branch_id: formData.branch_id,
        parent_loan_id: formData.parent_loan_id,
      },

      financial: {
        principal_amount: formData.principal_amount,
        interest_rate: formData.interest_rate,
        interest_type: formData.interest_type,
        interest_amount: interestAmount,
        installment_amount: emi,
        total_payable: totalPayable.toString(),
        processing_fee: formData.processing_fee,
        penalty_rate: formData.penalty_rate,
        grace_days: formData.grace_days,
      },

      schedule: {
        tenure_value: formData.tenure_value,
        tenure_unit: formData.tenure_unit,
        repayment_type: formData.repayment_type,
        repayment_interval: formData.repayment_interval,
        sanctioned_date: formData.sanctioned_date,
        start_date: formData.start_date,
        last_due_date: formData.last_due_date,
        collection_weekday: formData.collection_weekday,
      },

      status: {
        status: "ACTIVE",
        approved_by: formData.approved_by,
        approved_at: new Date().toISOString(),
      },
    };

    let guarantor = null;

    if (guarantorMode === "new") {
      guarantor = {
        personal: {
          full_name: formData.guarantorFullName,
          phone: formData.guarantorPhone,
          alternate_phone: formData.guarantorAlternatePhone,
          email: formData.guarantorEmail,
          relation: formData.guarantorRelation,
        },

        address: {
          address: formData.guarantorAddress,
          city: formData.guarantorCity,
          state: formData.guarantorState,
          pincode: formData.guarantorPincode,
        },

        financial: {
          occupation: formData.guarantorOccupation,
          monthly_income: formData.guarantorMonthlyIncome,
        },

        kyc: {
          aadhaar: formData.guarantorAadhaar,
          pan: formData.guarantorPan,
        },
      };
    }

    // ─────────────────────────────
    // 3️⃣ Append JSON Nodes
    // ─────────────────────────────

    fd.append("loan", JSON.stringify(loan));

    fd.append(
      "meta",
      JSON.stringify({
        guarantor_mode: guarantorMode,
        guarantor_id:
          guarantorMode === "existing" ? formData.guarantor_id : null,
      }),
    );

    if (guarantor) {
      fd.append("guarantor", JSON.stringify(guarantor));
    }

    // ─────────────────────────────
    // 4️⃣ Append FILES separately
    // ─────────────────────────────

    // Guarantor Files
    if (formData.guarantor_photo)
      fd.append("guarantor_photo", formData.guarantor_photo);

    if (formData.guarantor_aadhar_doc)
      fd.append("guarantor_aadhar_doc", formData.guarantor_aadhar_doc);

    if (formData.guarantor_pan_doc)
      fd.append("guarantor_pan_doc", formData.guarantor_pan_doc);

    // Loan Files
    if (formData.loan_agreement)
      fd.append("loan_agreement", formData.loan_agreement);

    if (formData.promissory_note)
      fd.append("promissory_note", formData.promissory_note);

    if (formData.signature_sheet)
      fd.append("signature_sheet", formData.signature_sheet);

    if (formData.other_document)
      fd.append("other_document", formData.other_document);

    // ─────────────────────────────
    // 5️⃣ Submit
    // ─────────────────────────────

    console.log("STRUCTURED SUBMISSION:");
    console.log({ loan, guarantor, mode: guarantorMode });

    createLoan(fd, {
      onSuccess: (data) => {
        showToast("Loan created successfully!", "success");
        console.log("Loan created successfully:", data);
      },
      onError: (error) => {
        showToast("Error creating loan. Please try again.", "error");
        console.error("Error creating loan:", error);
      },
    });

    setTimeout(() => {
      onClose();
    }, 800);
  };

  const schedule = generatePaymentSchedule();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[96vh] overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Create New Loan
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Step {currentStep} of {steps.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Icon
              name="X"
              size={22}
              className="text-gray-600 dark:text-gray-300"
            />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="py-3 sm:py-4 border-b bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between px-4 sm:px-6 md:justify-center md:gap-10 lg:gap-16">
            {steps.map((step, idx) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                      currentStep === step.number
                        ? "bg-blue-600 text-white ring-2 ring-blue-300"
                        : currentStep > step.number
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Icon name="Check" size={16} />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className="text-[10px] sm:text-xs mt-1 font-medium text-center">
                    {step.title}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 max-w-[40px] sm:max-w-[80px] md:max-w-[120px] ${
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold">
                Borrower & Loan Details
              </h3>

              {/* Borrower info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                  label="Borrower Name"
                  value={borrower?.name}
                  disabled
                  readOnly
                  className="bg-gray-50"
                />
                <Input
                  label="Borrower Code"
                  value={borrower?.code}
                  disabled
                  readOnly
                  className="bg-gray-50"
                />
                <Input
                  label="Phone Number"
                  value={borrower?.phone}
                  disabled
                  readOnly
                  className="bg-gray-50"
                />
                <Input
                  label="Aadhaar (last 4)"
                  value={`XXXX XXXX ${borrower?.kyc?.aadhaarLast4 || "XXXX"}`}
                  disabled
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <Input
                label="Loan Code"
                value={formData.loan_code}
                disabled
                readOnly
              />

              <Input
                label="Principal Amount (₹)"
                type="number"
                value={formData.principal_amount}
                onChange={(e) =>
                  handleChange("principal_amount", e.target.value)
                }
                error={errors.principal_amount}
                placeholder="Minimum ₹1,000"
              />
              <Select
                label="Repayment Type *"
                value={formData.repayment_type}
                onChange={(v) => handleChange("repayment_type", v)}
                options={repaymentTypeOptions}
              />
              <Input
                label="Repayment Interval (gap between due dates)"
                type="number"
                value={formData.repayment_interval}
                onChange={(e) =>
                  handleChange("repayment_interval", e.target.value)
                }
                error={errors.repayment_interval}
                placeholder="Minimum 1 day/week/month (based on type)"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Interest Rate (%)"
                  type="number"
                  value={formData.interest_rate}
                  onChange={(e) =>
                    handleChange("interest_rate", e.target.value)
                  }
                  step="0.01"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tenure
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="number"
                      min="1"
                      value={formData.tenure_value}
                      onChange={(e) =>
                        handleChange("tenure_value", e.target.value)
                      }
                      className="block w-full px-3 py-2 pr-16 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter tenure"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">
                        {formData.tenure_unit || "MONTH"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Select
                label="Interest Type"
                value={formData.interest_type}
                onChange={(v) => handleChange("interest_type", v)}
                options={interestTypeOptions}
              />

              <Input
                label="Processing Fee (₹)"
                type="number"
                value={formData.processing_fee}
                onChange={(e) => handleChange("processing_fee", e.target.value)}
              />

              <Input
                label="Penalty Rate (%)"
                type="number"
                value={formData.penalty_rate}
                onChange={(e) => handleChange("penalty_rate", e.target.value)}
                step="0.1"
              />

              <Input
                label="Grace Days"
                type="number"
                value={formData.grace_days}
                onChange={(e) => handleChange("grace_days", e.target.value)}
              />

              <Select
                label="Collection Weekday (auto-filled from Start Date)"
                value={formData.collection_weekday}
                options={weekdayOptions}
                disabled
                className="bg-gray-50 cursor-not-allowed"
              />

              <Input
                label="Sanctioned Date"
                type="date"
                value={formData.sanctioned_date}
                onChange={(e) =>
                  handleChange("sanctioned_date", e.target.value)
                }
              />

              <Input
                label="Start Date *"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange("start_date", e.target.value)}
                // min={formData.sanctioned_date || today}
              />

              <Input
                label="Last Due Date"
                type="date"
                value={formData.last_due_date}
                disabled
                className="bg-gray-50"
              />

              <div>
                <label className="block text-sm font-medium mb-2">
                  Loan Purpose <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full px-4 py-3 border rounded-lg"
                  rows={3}
                  value={formData.purpose}
                  onChange={(e) => handleChange("purpose", e.target.value)}
                  placeholder="Business expansion, medical emergency, agriculture..."
                />
                {errors.purpose && (
                  <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>
                )}
              </div>

              <Input
                label="Collateral (if any)"
                value={formData.collateral}
                onChange={(e) => handleChange("collateral", e.target.value)}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">
                Payment Schedule Preview
              </h3>

              {schedule.length === 0 ? (
                <div className="text-center py-12 text-gray-500 border rounded-lg">
                  Please fill principal amount, tenure and start date to preview
                </div>
              ) : (
                <>
                  {/* Mobile - Card view */}
                  <div className="md:hidden space-y-4">
                    {schedule.map((row) => (
                      <div
                        key={row.installment}
                        className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-medium text-base">
                            #{row.installment}
                          </span>
                          {row.status === "PAID" && (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                              PAID
                            </span>
                          )}
                          {row.status === "DELAYED" && (
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">
                              DELAYED
                            </span>
                          )}
                          {row.status === "PENDING" && (
                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
                              PENDING
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-500 text-xs">
                              Due Date
                            </div>
                            {row.dueDate}
                          </div>
                          <div className="text-right">
                            <div className="text-gray-500 text-xs">EMI</div>₹
                            {row.emi}
                          </div>
                          <div>
                            <div className="text-gray-500 text-xs">Fine</div>₹
                            {row.fine}
                          </div>
                          <div className="text-right">
                            <div className="text-gray-500 text-xs">
                              Total Due
                            </div>
                            <strong>₹{row.totalDue}</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop - Table view */}
                  <div className="hidden md:block overflow-x-auto border rounded-lg">
                    <table className="w-full text-sm min-w-[800px]">
                      <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                          <th className="p-4 text-left sticky left-0 bg-gray-100 dark:bg-gray-800 z-10 min-w-[60px]">
                            Inst.
                          </th>
                          <th className="p-4 text-left min-w-[180px]">
                            Due Date & Weekday
                          </th>
                          <th className="p-4 text-right min-w-[110px]">EMI</th>
                          <th className="p-4 text-right min-w-[90px]">Fine</th>
                          <th className="p-4 text-right min-w-[120px]">
                            Total Due
                          </th>
                          <th className="p-4 text-center min-w-[110px]">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedule.map((row) => (
                          <tr
                            key={row.installment}
                            className="border-t hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          >
                            <td className="p-4 sticky left-0 bg-white dark:bg-gray-900 z-0 font-medium">
                              #{row.installment}
                            </td>
                            <td className="p-4">{row.dueDate}</td>
                            <td className="p-4 text-right">₹{row.emi}</td>
                            <td className="p-4 text-right">₹{row.fine}</td>
                            <td className="p-4 text-right font-medium">
                              ₹{row.totalDue}
                            </td>
                            <td className="p-4 text-center">
                              {row.status === "PAID" && (
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">
                                  PAID
                                </span>
                              )}
                              {row.status === "DELAYED" && (
                                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs">
                                  DELAYED
                                </span>
                              )}
                              {row.status === "PENDING" && (
                                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs">
                                  PENDING
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="pt-4 text-sm sm:text-base text-right">
                    <strong>Total payable:</strong> ₹
                    {(
                      Number(calculateInstallment()) *
                      Number(formData.tenure_value || 0)
                    ).toLocaleString("en-IN")}
                  </div>
                </>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border flex flex-col gap-6">
                <div>
                  <h3 className="text-lg font-semibold">
                    Guarantor (Required)
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {guarantorMode === "existing"
                      ? "Select from existing borrowers"
                      : "Enter new guarantor details"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setGuarantorMode("existing")}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      guarantorMode === "existing"
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    Select Existing
                  </button>
                  <button
                    onClick={() => setGuarantorMode("new")}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      guarantorMode === "new"
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    Add New
                  </button>
                </div>

                {guarantorMode === "existing" && (
                  <div className="space-y-4">
                    <Select
                      label="Select Existing Guarantor"
                      value={formData.guarantor_id}
                      onChange={(v) => handleChange("guarantor_id", v)}
                      options={existingGuarantors.map((g) => ({
                        value: g.id,
                        label: `${g.fullName} (${g.phone})`,
                      }))}
                      placeholder="Choose guarantor..."
                      error={errors.guarantor_id}
                    />
                  </div>
                )}

                {guarantorMode === "new" && (
                  <div className="space-y-6 animate-fade-in">
                    <Input
                      label="Guarantor Full Name"
                      value={formData.guarantorFullName}
                      onChange={(e) =>
                        handleChange("guarantorFullName", e.target.value)
                      }
                      error={errors.guarantorFullName}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Phone Number"
                        type="tel"
                        value={formData.guarantorPhone}
                        onChange={(e) =>
                          handleChange("guarantorPhone", e.target.value)
                        }
                        error={errors.guarantorPhone}
                      />
                      <Select
                        label="Relation"
                        options={relationOptions}
                        value={formData.guarantorRelation}
                        onChange={(v) => handleChange("guarantorRelation", v)}
                        error={errors.guarantorRelation}
                      />
                    </div>
                    <Input
                      label="Address"
                      value={formData.guarantorAddress}
                      onChange={(e) =>
                        handleChange("guarantorAddress", e.target.value)
                      }
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Occupation"
                        value={formData.guarantorOccupation}
                        onChange={(e) =>
                          handleChange("guarantorOccupation", e.target.value)
                        }
                      />
                      <Input
                        label="Monthly Income (₹)"
                        type="number"
                        value={formData.guarantorMonthlyIncome}
                        onChange={(e) =>
                          handleChange("guarantorMonthlyIncome", e.target.value)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Input
                        label="City"
                        value={formData.guarantorCity}
                        onChange={(e) =>
                          handleChange("guarantorCity", e.target.value)
                        }
                      />
                      <Input
                        label="State"
                        value={formData.guarantorState}
                        onChange={(e) =>
                          handleChange("guarantorState", e.target.value)
                        }
                      />
                      <Input
                        label="Pincode"
                        value={formData.guarantorPincode}
                        onChange={(e) =>
                          handleChange("guarantorPincode", e.target.value)
                        }
                        maxLength={6}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Aadhaar Number"
                        value={formData.guarantorAadhaar}
                        onChange={(e) =>
                          handleChange("guarantorAadhaar", e.target.value)
                        }
                        maxLength={12}
                      />
                      <Input
                        label="PAN Number"
                        value={formData.guarantorPan}
                        onChange={(e) =>
                          handleChange("guarantorPan", e.target.value)
                        }
                        maxLength={10}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Alternate Phone"
                        type="tel"
                        value={formData.guarantorAlternatePhone}
                        onChange={(e) =>
                          handleChange(
                            "guarantorAlternatePhone",
                            e.target.value,
                          )
                        }
                      />
                      <Input
                        label="Email"
                        type="email"
                        value={formData.guarantorEmail}
                        onChange={(e) =>
                          handleChange("guarantorEmail", e.target.value)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <DocumentCaptureField
                        label="Guarantor Photo (optional)"
                        accept="image/*"
                        value={formData.guarantor_photo}
                        onChange={(f) => handleChange("guarantor_photo", f)}
                      />
                      <DocumentCaptureField
                        label="Guarantor Aadhar Document (optional)"
                        accept=".pdf,image/*"
                        value={formData.guarantor_aadhar_doc}
                        onChange={(f) =>
                          handleChange("guarantor_aadhar_doc", f)
                        }
                      />
                      <DocumentCaptureField
                        label="Guarantor PAN Document (optional)"
                        accept=".pdf,image/*"
                        value={formData.guarantor_pan_doc}
                        onChange={(f) => handleChange("guarantor_pan_doc", f)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* New section - Loan Documents */}
              <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border">
                <h3 className="text-lg font-semibold mb-4">Loan Documents</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                  <DocumentCaptureField
                    label="Loan Agreement / Contract"
                    accept=".pdf,image/*"
                    value={formData.loan_agreement}
                    onChange={(f) => handleChange("loan_agreement", f)}
                  />
                  <DocumentCaptureField
                    label="Promissory Note"
                    accept=".pdf,image/*"
                    value={formData.promissory_note}
                    onChange={(f) => handleChange("promissory_note", f)}
                  />
                  <DocumentCaptureField
                    label="Signature Sheet / Acknowledgement"
                    accept="image/*,.pdf"
                    value={formData.signature_sheet}
                    onChange={(f) => handleChange("signature_sheet", f)}
                  />
                  <DocumentCaptureField
                    label="Other Supporting Document"
                    accept=".pdf,image/*"
                    value={formData.other_document}
                    onChange={(f) => handleChange("other_document", f)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-t bg-gray-50 dark:bg-gray-800/50 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-3 w-full sm:w-auto">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 sm:flex-none"
              >
                <Icon name="ChevronLeft" size={16} className="mr-1.5" /> Back
              </Button>
            )}
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
          </div>

          {currentStep < steps.length ? (
            <Button onClick={handleNext} className="w-full sm:w-auto">
              Next <Icon name="ChevronRight" size={16} className="ml-1.5" />
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              iconName={isPending ? "Loader" : "Check"}
              iconPosition="left"
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              {isPending ? "Creating Loan..." : "Create Loan"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateLoanModal;
