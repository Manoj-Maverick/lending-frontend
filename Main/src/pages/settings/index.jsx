import React, { useEffect, useState } from "react";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import { useSettings } from "hooks/useSettings";
import { useSaveSettings } from "hooks/useSaveSettings";
import { useUsers } from "hooks/useUser";
import { useCreateUser } from "hooks/useSaveUser";
import { useToast } from "context/ToastContext";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "staff",
  });
  const { showToast } = useToast();
  const { data, isLoading, isError } = useSettings();
  const saveMutation = useSaveSettings();
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
  } = useUsers(activeTab === "users");

  const createUserMutation = useCreateUser();

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    organizationName: "SDFC - Secured Deposit Finance Corporation",
    organizationEmail: "info@sdfc.com",
    organizationPhone: "+1 (555) 123-4567",
    website: "www.sdfc.com",
    timezone: "EST",
    dateFormat: "MM/DD/YYYY",
    currency: "USD",
    language: "English",
  });

  // Loan Settings
  const [loanSettings, setLoanSettings] = useState({
    defaultInterestRate: 12.5,
    maxLoanAmount: 500000,
    minLoanAmount: 10000,
    defaultTenure: 24,
    maxTenure: 60,
    minTenure: 6,
    processingFeePercentage: 2.5,
    penaltyInterestRate: 18,
    overdueThresholdDays: 30,
  });

  // Email Settings
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "noreply@sdfc.com",
    enableSslTls: true,
    enableEmailNotifications: true,
    enableLoanReminders: true,
    enablePaymentReceipts: true,
    enableApprovalNotifications: true,
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    enableTwoFactor: false,
    sessionTimeout: 30,
    passwordExpiryDays: 90,
    minPasswordLength: 8,
    requireUpperCase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    loginAttempts: 3,
  });

  const tabs = [
    { id: "general", label: "General", icon: "Settings" },
    { id: "loan", label: "Loan Settings", icon: "Wallet" },
    { id: "email", label: "Email", icon: "Mail" },
    { id: "security", label: "Security", icon: "Lock" },
    { id: "users", label: "Users & Permissions", icon: "Users" },
    { id: "backup", label: "Backup & Export", icon: "Download" },
  ];

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      // console.log("RAW SETTINGS FROM BACKEND:", JSON.stringify(data, null, 2));
      setGeneralSettings(data.general);
      setLoanSettings(data.loan);
      setEmailSettings(data.email);
      setSecuritySettings(data.security);
    }
  }, [data]);

  const handleGeneralChange = (field, value) => {
    console.log("General setting changed:", field, value);
    setGeneralSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleLoanChange = (field, value) => {
    setLoanSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleEmailChange = (field, value) => {
    setEmailSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSecurityChange = (field, value) => {
    setSecuritySettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);

    showToast("Saving settings...", "info");

    saveMutation.mutate(
      {
        general: generalSettings,
        loan: loanSettings,
        email: emailSettings,
        security: securitySettings,
      },
      {
        onSuccess: () => {
          setIsSaving(false);
          showToast("Settings saved successfully!", "success");
        },
        onError: () => {
          setIsSaving(false);
          showToast("Failed to save settings", "error");
        },
      },
    );
  };

  const handleResetPassword = () => {
    if (confirm("Send password reset link to your email?")) {
      showToast("Password reset link sent to your email!", "success");
    }
  };

  const handleTestEmailConnection = () => {
    showToast("Test email sent successfully!", "success");
  };

  const handleBackupDatabase = () => {
    if (
      confirm("Create a backup of the database? This may take a few minutes.")
    ) {
      showToast("Database backup completed successfully!", "success");
    }
  };

  const handleExportData = (format) => {
    showToast(`Data exported successfully as ${format}!`, "success");
  };

  const handleAddUser = () => {
    if (
      !newUserForm.name ||
      !newUserForm.email ||
      !newUserForm.username ||
      !newUserForm.password ||
      !newUserForm.confirmPassword
    ) {
      showToast("Please fill in all fields", "error");
      return;
    }

    if (newUserForm.password !== newUserForm.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    createUserMutation.mutate(newUserForm, {
      onSuccess: () => {
        showToast(`User "${newUserForm.name}" added successfully!`, "success");
        setNewUserForm({
          name: "",
          email: "",
          username: "",
          password: "",
          confirmPassword: "",
          role: "staff",
        });
        setShowAddUserForm(false);
      },
      onError: () => {
        showToast("Failed to add user", "error");
      },
    });
  };

  const handleCancelChanges = () => {
    setGeneralSettings({
      organizationName: "SDFC - Secured Deposit Finance Corporation",
      organizationEmail: "info@sdfc.com",
      organizationPhone: "+1 (555) 123-4567",
      website: "www.sdfc.com",
      timezone: "EST",
      dateFormat: "MM/DD/YYYY",
      currency: "INR",
      language: "English",
    });
    console.log("Changes cancelled");
  };

  if (isLoading) {
    return <div>Loading settings...</div>;
  }
  if (isError) {
    return <div>Error loading settings. Please try again later.</div>;
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
          <Icon name="Settings" size={32} className="text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Configure system settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border border-border overflow-hidden sticky top-20">
            <div className="p-4 border-b border-border bg-muted/30">
              <h3 className="font-semibold text-foreground">Settings</h3>
            </div>
            <nav className="divide-y divide-border">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 transition-colors flex items-center gap-3 ${
                    activeTab === tab.id
                      ? "bg-accent/10 text-accent font-medium"
                      : "text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon name={tab.icon} size={18} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-lg border border-border p-4 md:p-6">
            {/* General Settings */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    General Settings
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Configure basic organization information and preferences
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">
                      Organization Name
                    </label>
                    <Input
                      value={generalSettings.organizationName}
                      onChange={(e) =>
                        handleGeneralChange("organizationName", e.target.value)
                      }
                      placeholder="Enter organization name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={generalSettings.organizationEmail}
                        onChange={(e) =>
                          handleGeneralChange(
                            "organizationEmail",
                            e.target.value,
                          )
                        }
                        placeholder="Enter email"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">
                        Phone
                      </label>
                      <Input
                        value={generalSettings.organizationPhone}
                        onChange={(e) =>
                          handleGeneralChange(
                            "organizationPhone",
                            e.target.value,
                          )
                        }
                        placeholder="Enter phone"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">
                        Website
                      </label>
                      <Input
                        value={generalSettings.website}
                        onChange={(e) =>
                          handleGeneralChange("website", e.target.value)
                        }
                        placeholder="Enter website"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">
                        Timezone
                      </label>
                      <Select
                        value={generalSettings.timezone}
                        onChange={(value) =>
                          handleGeneralChange("timezone", value)
                        }
                        options={[
                          { value: "EST", label: "Eastern Standard Time" },
                          { value: "CST", label: "Central Standard Time" },
                          { value: "MST", label: "Mountain Standard Time" },
                          { value: "PST", label: "Pacific Standard Time" },
                          { value: "UTC", label: "Coordinated Universal Time" },
                          { value: "IST", label: "Indian Standard Time" },
                        ]}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">
                        Date Format
                      </label>
                      <Select
                        value={generalSettings.dateFormat}
                        onChange={(value) =>
                          handleGeneralChange("dateFormat", value)
                        }
                        options={[
                          { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
                          { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
                          { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
                        ]}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">
                        Currency
                      </label>
                      <Select
                        value={generalSettings.currency}
                        onChange={(value) =>
                          handleGeneralChange("currency", value)
                        }
                        options={[
                          { value: "USD", label: "USD ($)" },
                          { value: "EUR", label: "EUR (€)" },
                          { value: "GBP", label: "GBP (£)" },
                          { value: "INR", label: "INR (₹)" },
                        ]}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex gap-3">
                  <Button
                    variant="default"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </div>
            )}

            {/* Loan Settings */}
            {activeTab === "loan" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Loan Settings
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Configure default loan parameters and rates
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">
                        Default Interest Rate (%)
                      </label>
                      <Input
                        type="number"
                        value={loanSettings.defaultInterestRate}
                        onChange={(e) =>
                          handleLoanChange(
                            "defaultInterestRate",
                            parseFloat(e.target.value),
                          )
                        }
                        step="0.1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">
                        Penalty Interest Rate (%)
                      </label>
                      <Input
                        type="number"
                        value={loanSettings.penaltyInterestRate}
                        onChange={(e) =>
                          handleLoanChange(
                            "penaltyInterestRate",
                            parseFloat(e.target.value),
                          )
                        }
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">
                        Min Loan Amount
                      </label>
                      <Input
                        type="number"
                        value={loanSettings.minLoanAmount}
                        onChange={(e) =>
                          handleLoanChange(
                            "minLoanAmount",
                            parseFloat(e.target.value),
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">
                        Max Loan Amount
                      </label>
                      <Input
                        type="number"
                        value={loanSettings.maxLoanAmount}
                        onChange={(e) =>
                          handleLoanChange(
                            "maxLoanAmount",
                            parseFloat(e.target.value),
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">
                        Min Tenure (Months)
                      </label>
                      <Input
                        type="number"
                        value={loanSettings.minTenure}
                        onChange={(e) =>
                          handleLoanChange(
                            "minTenure",
                            parseInt(e.target.value),
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">
                        Default Tenure (Months)
                      </label>
                      <Input
                        type="number"
                        value={loanSettings.defaultTenure}
                        onChange={(e) =>
                          handleLoanChange(
                            "defaultTenure",
                            parseInt(e.target.value),
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">
                        Max Tenure (Months)
                      </label>
                      <Input
                        type="number"
                        value={loanSettings.maxTenure}
                        onChange={(e) =>
                          handleLoanChange(
                            "maxTenure",
                            parseInt(e.target.value),
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">
                        Processing Fee (%)
                      </label>
                      <Input
                        type="number"
                        value={loanSettings.processingFeePercentage}
                        onChange={(e) =>
                          handleLoanChange(
                            "processingFeePercentage",
                            parseFloat(e.target.value),
                          )
                        }
                        step="0.1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">
                        Overdue Threshold (Days)
                      </label>
                      <Input
                        type="number"
                        value={loanSettings.overdueThresholdDays}
                        onChange={(e) =>
                          handleLoanChange(
                            "overdueThresholdDays",
                            parseInt(e.target.value),
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex gap-3">
                  <Button
                    variant="default"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </div>
            )}

            {/* Email Settings */}
            {activeTab === "email" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Email Configuration
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Configure SMTP and email notification settings
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">
                        SMTP Server
                      </label>
                      <Input
                        value={emailSettings.smtpServer}
                        onChange={(e) =>
                          handleEmailChange("smtpServer", e.target.value)
                        }
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">
                        SMTP Port
                      </label>
                      <Input
                        value={emailSettings.smtpPort}
                        onChange={(e) =>
                          handleEmailChange("smtpPort", e.target.value)
                        }
                        placeholder="587"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">
                      SMTP Username
                    </label>
                    <Input
                      value={emailSettings.smtpUsername}
                      onChange={(e) =>
                        handleEmailChange("smtpUsername", e.target.value)
                      }
                      placeholder="Enter SMTP username"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                      <input
                        type="checkbox"
                        id="ssl-tls"
                        checked={emailSettings.enableSslTls}
                        onChange={(e) =>
                          handleEmailChange("enableSslTls", e.target.checked)
                        }
                        className="rounded"
                      />
                      <label
                        htmlFor="ssl-tls"
                        className="text-sm font-medium text-foreground cursor-pointer"
                      >
                        Enable SSL/TLS Encryption
                      </label>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                      <input
                        type="checkbox"
                        id="notifications"
                        checked={emailSettings.enableEmailNotifications}
                        onChange={(e) =>
                          handleEmailChange(
                            "enableEmailNotifications",
                            e.target.checked,
                          )
                        }
                        className="rounded"
                      />
                      <label
                        htmlFor="notifications"
                        className="text-sm font-medium text-foreground cursor-pointer"
                      >
                        Enable Email Notifications
                      </label>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                      <input
                        type="checkbox"
                        id="reminders"
                        checked={emailSettings.enableLoanReminders}
                        onChange={(e) =>
                          handleEmailChange(
                            "enableLoanReminders",
                            e.target.checked,
                          )
                        }
                        className="rounded"
                      />
                      <label
                        htmlFor="reminders"
                        className="text-sm font-medium text-foreground cursor-pointer"
                      >
                        Enable Loan Reminders
                      </label>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                      <input
                        type="checkbox"
                        id="receipts"
                        checked={emailSettings.enablePaymentReceipts}
                        onChange={(e) =>
                          handleEmailChange(
                            "enablePaymentReceipts",
                            e.target.checked,
                          )
                        }
                        className="rounded"
                      />
                      <label
                        htmlFor="receipts"
                        className="text-sm font-medium text-foreground cursor-pointer"
                      >
                        Enable Payment Receipts
                      </label>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                      <input
                        type="checkbox"
                        id="approvals"
                        checked={emailSettings.enableApprovalNotifications}
                        onChange={(e) =>
                          handleEmailChange(
                            "enableApprovalNotifications",
                            e.target.checked,
                          )
                        }
                        className="rounded"
                      />
                      <label
                        htmlFor="approvals"
                        className="text-sm font-medium text-foreground cursor-pointer"
                      >
                        Enable Approval Notifications
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex gap-3">
                  <Button
                    variant="default"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button variant="outline" onClick={handleTestEmailConnection}>
                    Test Connection
                  </Button>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Security Settings
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Configure system security and password policies
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">
                        Session Timeout (Minutes)
                      </label>
                      <Input
                        type="number"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) =>
                          handleSecurityChange(
                            "sessionTimeout",
                            parseInt(e.target.value),
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">
                        Password Expiry (Days)
                      </label>
                      <Input
                        type="number"
                        value={securitySettings.passwordExpiryDays}
                        onChange={(e) =>
                          handleSecurityChange(
                            "passwordExpiryDays",
                            parseInt(e.target.value),
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">
                        Minimum Password Length
                      </label>
                      <Input
                        type="number"
                        value={securitySettings.minPasswordLength}
                        onChange={(e) =>
                          handleSecurityChange(
                            "minPasswordLength",
                            parseInt(e.target.value),
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">
                        Max Login Attempts
                      </label>
                      <Input
                        type="number"
                        value={securitySettings.loginAttempts}
                        onChange={(e) =>
                          handleSecurityChange(
                            "loginAttempts",
                            parseInt(e.target.value),
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                      <input
                        type="checkbox"
                        id="two-factor"
                        checked={securitySettings.enableTwoFactor}
                        onChange={(e) =>
                          handleSecurityChange(
                            "enableTwoFactor",
                            e.target.checked,
                          )
                        }
                        className="rounded"
                      />
                      <label
                        htmlFor="two-factor"
                        className="text-sm font-medium text-foreground cursor-pointer"
                      >
                        Enable Two-Factor Authentication
                      </label>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                      <input
                        type="checkbox"
                        id="uppercase"
                        checked={securitySettings.requireUpperCase}
                        onChange={(e) =>
                          handleSecurityChange(
                            "requireUpperCase",
                            e.target.checked,
                          )
                        }
                        className="rounded"
                      />
                      <label
                        htmlFor="uppercase"
                        className="text-sm font-medium text-foreground cursor-pointer"
                      >
                        Require Uppercase Letters
                      </label>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                      <input
                        type="checkbox"
                        id="numbers"
                        checked={securitySettings.requireNumbers}
                        onChange={(e) =>
                          handleSecurityChange(
                            "requireNumbers",
                            e.target.checked,
                          )
                        }
                        className="rounded"
                      />
                      <label
                        htmlFor="numbers"
                        className="text-sm font-medium text-foreground cursor-pointer"
                      >
                        Require Numbers
                      </label>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                      <input
                        type="checkbox"
                        id="special-chars"
                        checked={securitySettings.requireSpecialChars}
                        onChange={(e) =>
                          handleSecurityChange(
                            "requireSpecialChars",
                            e.target.checked,
                          )
                        }
                        className="rounded"
                      />
                      <label
                        htmlFor="special-chars"
                        className="text-sm font-medium text-foreground cursor-pointer"
                      >
                        Require Special Characters
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex gap-3">
                  <Button
                    variant="default"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button variant="outline" onClick={handleResetPassword}>
                    Reset Your Password
                  </Button>
                </div>
              </div>
            )}

            {/* Users & Permissions */}
            {activeTab === "users" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Users & Permissions
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Manage user roles and access permissions
                  </p>
                </div>

                {/* Add User Form */}
                {showAddUserForm && (
                  <div className="bg-accent/10 rounded-lg p-4 border border-accent">
                    <h3 className="font-semibold text-foreground mb-4">
                      Add New User
                    </h3>
                    <div className="space-y-3 mb-4">
                      {/* Full Name */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1 block">
                          Full Name
                        </label>
                        <Input
                          value={newUserForm.name}
                          onChange={(e) =>
                            setNewUserForm((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Enter user name"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1 block">
                          Email
                        </label>
                        <Input
                          type="email"
                          value={newUserForm.email}
                          onChange={(e) =>
                            setNewUserForm((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          placeholder="Enter email address"
                        />
                      </div>

                      {/* Username */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1 block">
                          Username
                        </label>
                        <Input
                          value={newUserForm.username}
                          onChange={(e) =>
                            setNewUserForm((prev) => ({
                              ...prev,
                              username: e.target.value,
                            }))
                          }
                          placeholder="Enter username"
                        />
                      </div>

                      {/* Password */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1 block">
                          Password
                        </label>
                        <Input
                          type="password"
                          value={newUserForm.password}
                          onChange={(e) =>
                            setNewUserForm((prev) => ({
                              ...prev,
                              password: e.target.value,
                            }))
                          }
                          placeholder="Enter password"
                        />
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1 block">
                          Confirm Password
                        </label>
                        <Input
                          type="password"
                          value={newUserForm.confirmPassword}
                          onChange={(e) =>
                            setNewUserForm((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                          placeholder="Confirm password"
                        />
                      </div>

                      {/* Role */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1 block">
                          Role
                        </label>
                        <Select
                          value={newUserForm.role}
                          onChange={(value) =>
                            setNewUserForm((prev) => ({
                              ...prev,
                              role: value,
                            }))
                          }
                          options={[
                            { value: "ADMIN", label: "Administrator" },
                            { value: "BRANCH_MANAGER", label: "Manager" },
                            { value: "STAFF", label: "Staff" },
                          ]}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleAddUser}
                      >
                        Add User
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddUserForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="bg-muted/30 rounded-lg p-6 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">
                      Active Users
                    </h3>
                    <Button
                      variant="default"
                      iconName="Plus"
                      size="sm"
                      onClick={() => setShowAddUserForm(!showAddUserForm)}
                    >
                      Add User
                    </Button>
                  </div>

                  {usersLoading && <p>Loading users…</p>}
                  {usersError && (
                    <p className="text-error">Failed to load users</p>
                  )}

                  {users?.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 border rounded mb-2"
                    >
                      <div>
                        <p className="font-medium">{user.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.role} · {user.branch_name}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button className="btn-secondary">Edit</button>
                        <button className="btn-danger">Disable</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Backup & Export */}
            {activeTab === "backup" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Backup & Export
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Backup your data and export reports
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-warning/10 border border-warning rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Icon
                        name="AlertCircle"
                        size={18}
                        className="text-warning"
                      />
                      Database Backup
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create a complete backup of your database. Last backup: 2
                      days ago
                    </p>
                    <Button
                      variant="warning"
                      iconName="Download"
                      onClick={handleBackupDatabase}
                    >
                      Create Backup Now
                    </Button>
                  </div>

                  <div className="bg-accent/10 border border-accent rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Icon name="Download" size={18} className="text-accent" />
                      Export Data
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Export your data in various formats
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportData("CSV")}
                      >
                        Export as CSV
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportData("Excel")}
                      >
                        Export as Excel
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportData("PDF")}
                      >
                        Export as PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
