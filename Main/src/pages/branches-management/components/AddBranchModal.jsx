import React, { useState, useEffect, useRef } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { useCreateBranch } from "hooks/branches/useCreateBranch";
import { useToast } from "context/ToastContext";
import { useGenerateBranchCode } from "hooks/generators/useGenerateBranchCode";

import tamilNaduPincodes from "../../../dataSet/tamil_nadu_pincode_lookup.json";

const AddBranchModal = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);

  const { mutate: generateBranchCode, isPending: isGenerating } =
    useGenerateBranchCode();
  const { mutate: createBranch, isPending: isCreating } = useCreateBranch();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    phone: "",
    email: "",
    address: "",
    pincode: "",
    area: "",
    city: "",
    state: "",
    branchType: "",
    branchPhoto: null,
    registrationDoc: null,
  });

  const [errors, setErrors] = useState({});
  const [areaOptions, setAreaOptions] = useState([]);

  // Prevent duplicate toasts for same invalid pincode
  const lastWarnedPinRef = useRef(null);

  const steps = [
    { number: 1, title: "Basic Details", icon: "FileText" },
    { number: 2, title: "Address", icon: "MapPin" },
    { number: 3, title: "Branch Type & Code", icon: "Building2" },
  ];

  const branchTypeOptions = [
    { value: "HEAD", label: "Head Branch" },
    { value: "MAIN", label: "Main Branch" },
    { value: "REGULAR", label: "Sub Branch" },
  ];

  const FALLBACK_CODE_PREFIX = "TEST-BRN-";

  // ─── PINCODE LOOKUP ──────────────────────────────────────────────────────
  useEffect(() => {
    const pin = (formData.pincode || "").trim();

    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      setAreaOptions([]);
      setFormData((prev) => ({ ...prev, area: "", city: "", state: "" }));
      lastWarnedPinRef.current = null;
      return;
    }

    if (lastWarnedPinRef.current === pin) return;

    const entry = tamilNaduPincodes[pin];

    if (!entry || !Array.isArray(entry) || entry.length === 0) {
      setAreaOptions([]);
      showToast("PIN code not found in Tamil Nadu records", "warning");
      lastWarnedPinRef.current = pin;
      return;
    }

    lastWarnedPinRef.current = null;

    const options = entry.map((item) => ({
      value: item.area,
      label: item.area,
      district: item.district,
    }));

    setAreaOptions(options);

    const first = options[0];
    setFormData((prev) => ({
      ...prev,
      city: prev.city?.trim() ? prev.city : first.district,
      state: prev.state?.trim() ? prev.state : "Tamil Nadu",
      ...(options.length === 1 && !prev.area?.trim()
        ? { area: first.value }
        : {}),
    }));
  }, [formData.pincode]);

  // ─── AUTO-GENERATE / RE-GENERATE BRANCH CODE WHEN REQUIRED FIELDS CHANGE ──
  // ─── AUTO-GENERATE / RE-GENERATE BRANCH CODE WHEN INPUTS CHANGE ───────────
  useEffect(() => {
    const name = (formData.name || "").trim();
    const city = (formData.city || "").trim();
    const branchType = formData.branchType;

    // Missing required inputs → clear code
    if (!name || !city || !branchType) {
      setFormData((prev) => (prev.code ? { ...prev, code: "" } : prev));
      return;
    }

    // ── Always (re)generate when these change ───────────────────────────────
    // We removed the "if already have valid code → skip" check
    // because branch code should follow current inputs

    // Optional: show temporary state during generation
    setFormData((prev) => ({ ...prev, code: "Generating..." }));

    generateBranchCode(
      {
        branchType,
        district: city,
        area: (formData.area || "").trim() || undefined,
      },
      {
        onSuccess: (generatedCode) => {
          const newCode = String(generatedCode ?? "").trim();
          setFormData((prev) => ({ ...prev, code: newCode || "" }));
          if (newCode) {
            setErrors((prev) => ({ ...prev, code: "" }));
          }
        },
        onError: (err) => {
          const cityShort = city.toUpperCase().replace(/\s+/g, "").slice(0, 6);
          const typeShort = branchType;
          const randomPart = Date.now().toString().slice(-5);
          const fallback = `${FALLBACK_CODE_PREFIX}${typeShort}-${cityShort}-${randomPart}`;

          setFormData((prev) => ({ ...prev, code: fallback }));
          showToast(
            err?.response?.data?.message ||
              "Code generator failed – using temp code",
            "warning",
          );
        },
      },
    );
  }, [
    formData.name, // change name → new code
    formData.city, // change district/city → new code
    formData.area, // optional, but include if it affects code
    formData.branchType, // change type (HEAD/MAIN/REGULAR) → new code
    generateBranchCode,
    // Do NOT include formData.code here → would cause loop
  ]);

  // ─── VALIDATION ──────────────────────────────────────────────────────────
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.name?.trim()) newErrors.name = "Branch name is required";
      if (!formData.phone?.trim()) newErrors.phone = "Phone number is required";
    }

    if (step === 2) {
      if (!formData.address?.trim())
        newErrors.address = "Street address is required";
      if (!formData.pincode?.trim()) newErrors.pincode = "PIN code is required";
      else if (
        formData.pincode.length !== 6 ||
        !/^\d{6}$/.test(formData.pincode)
      )
        newErrors.pincode = "Enter a valid 6-digit PIN";
      if (!formData.area?.trim()) newErrors.area = "Area/locality is required";
      if (!formData.city?.trim()) newErrors.city = "City is required";
      if (!formData.state?.trim()) newErrors.state = "State is required";
    }

    if (step === 3) {
      if (!formData.branchType)
        newErrors.branchType = "Branch type is required";
      if (!formData.code?.trim()) newErrors.code = "Branch code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (!validateStep(currentStep)) return;

    createBranch(
      {
        code: (formData.code || "").trim(),
        name: (formData.name || "").trim(),
        phone: (formData.phone || "").trim(),
        email: formData.email?.trim() || undefined,
        address: (formData.address || "").trim(),
        city: (formData.city || "").trim(),
        state: (formData.state || "").trim(),
        zipCode: (formData.pincode || "").trim(),
        branchType: formData.branchType,
      },
      {
        onSuccess: () => {
          showToast("Branch created successfully", "success");
          setTimeout(onClose, 1400);
        },
        onError: (err) => {
          showToast(
            err?.response?.data?.message || "Failed to create branch",
            "error",
          );
        },
      },
    );
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleAreaChange = (selectedValue) => {
    const selected = areaOptions.find((opt) => opt.value === selectedValue);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        area: selected.value,
        city: prev.city?.trim() ? prev.city : selected.district,
      }));
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({
      name: "",
      code: "",
      phone: "",
      email: "",
      address: "",
      pincode: "",
      area: "",
      city: "",
      state: "",
      branchType: "",
      branchPhoto: null,
      registrationDoc: null,
    });
    setAreaOptions([]);
    setErrors({});
    lastWarnedPinRef.current = null;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Add New Branch
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {steps.map((step, idx) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step.number
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Icon name="Check" size={18} />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className="text-xs mt-1.5 font-medium text-gray-600 dark:text-gray-300 hidden sm:block">
                    {step.title}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-3 rounded ${
                      currentStep > step.number
                        ? "bg-blue-600"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {currentStep === 1 && (
            <div className="space-y-5">
              <Input
                label="Branch Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                error={errors.name}
              />
              <Input
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
                error={errors.phone}
              />
              <Input
                label="Email Address (optional)"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={errors.email}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5">
              <Input
                label="Street Address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                required
                error={errors.address}
                placeholder="Building name, street, landmark..."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="PIN Code"
                  value={formData.pincode}
                  onChange={(e) =>
                    handleInputChange(
                      "pincode",
                      e.target.value.replace(/\D/g, "").slice(0, 6),
                    )
                  }
                  required
                  error={errors.pincode}
                  placeholder="600001"
                  maxLength={6}
                  helperText={
                    areaOptions.length > 0
                      ? `${areaOptions.length} area${areaOptions.length > 1 ? "s" : ""} found`
                      : ""
                  }
                />

                <Select
                  label="Area / Locality"
                  options={areaOptions}
                  value={formData.area}
                  onChange={handleAreaChange}
                  placeholder={
                    areaOptions.length === 0
                      ? "Enter PIN code first..."
                      : "Select area..."
                  }
                  disabled={areaOptions.length === 0}
                  required
                  error={errors.area}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="City / District"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  disabled={areaOptions.length > 0 && !!formData.area}
                  required
                  error={errors.city}
                  helperText={
                    areaOptions.length > 0 && !formData.city?.trim()
                      ? "Auto-filled from PIN code"
                      : ""
                  }
                />

                <Input
                  label="State"
                  value={formData.state}
                  disabled
                  required
                  error={errors.state}
                  helperText="Tamil Nadu (auto-filled)"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <Select
                label="Branch Type"
                options={branchTypeOptions}
                value={formData.branchType}
                onChange={(v) => handleInputChange("branchType", v)}
                required
                error={errors.branchType}
                placeholder="Select branch type..."
              />

              <Input
                label="Branch Code"
                value={formData.code}
                readOnly
                disabled
                placeholder={
                  isGenerating
                    ? "Generating code..."
                    : formData.code
                      ? formData.code.startsWith(FALLBACK_CODE_PREFIX)
                        ? "Temporary test code"
                        : "Generated"
                      : "Will be generated automatically"
                }
                helperText={
                  formData.code?.startsWith(FALLBACK_CODE_PREFIX)
                    ? "Using temporary test code – generator unavailable"
                    : formData.code
                      ? "Auto-generated branch code"
                      : "Code will be generated once name, city & type are filled"
                }
                error={errors.code}
              />

              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-300">
                Branch code is{" "}
                <strong>automatically generated / updated</strong> when branch
                name, city/district or type changes.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? handleClose : handlePrevious}
          >
            {currentStep === 1 ? "Cancel" : "Back"}
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isCreating || isGenerating || !formData.code?.trim()}
              loading={isCreating}
            >
              {isCreating ? "Creating Branch..." : "Create Branch"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddBranchModal;
