import React, { useMemo, useState } from "react";
import Breadcrumb from "./Breadcrumb";
import BranchSelector from "./BranchSelector";
import UserProfileMenu from "./UserProfileMenu";
import Icon from "../AppIcon";
import BranchDisplay from "./BranchDisplay";
import Button from "components/ui/Button";
import { usePendingLoanRequests, useReviewLoanRequest } from "hooks/loans/useLoanApprovals";
import { useUIContext } from "context/UIContext";
import { useNavigate } from "react-router-dom";
export default function Header({
  user,
  selectedBranch,
  branches,
  handleBranchChange,
  handleThemeToggle,
  currentTheme,
  isMobileOpen,
  setIsMobileOpen,
}) {
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { showToast } = useUIContext();
  const canReviewLoans =
    user?.role === "ADMIN" || user?.role === "BRANCH_MANAGER";
  const { data: notificationsResponse } = usePendingLoanRequests(canReviewLoans);
  const reviewLoanMutation = useReviewLoanRequest();
  const notifications = notificationsResponse?.data || [];
  const notificationCount = notificationsResponse?.summary?.count || 0;
  const notificationLabel = useMemo(
    () =>
      notificationCount > 9 ? "9+" : String(notificationCount || ""),
    [notificationCount],
  );

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm overflow-x-clip">
      <div className="flex items-center h-16 md:h-20 px-4 md:px-6 lg:px-8">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            className="mobile-menu-button lg:hidden"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle mobile menu"
          >
            <Icon name={isMobileOpen ? "X" : "Menu"} size={20} />
          </button>
          <div className="hidden sm:block min-w-0">
            <Breadcrumb />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="ml-auto flex items-center gap-2 md:gap-4 min-w-0">
          <div className="hidden md:block ">
            {user?.role == "ADMIN" ? (
              <BranchSelector
                selectedBranch={selectedBranch}
                onBranchChange={handleBranchChange}
                branches={branches}
              />
            ) : user?.branchId != null ? (
              <BranchDisplay
                branch={
                  user?.branchId
                    ? branches?.find((b) => b.id == user.branchId)
                    : null
                }
              />
            ) : (
              ""
            )}
          </div>
          {canReviewLoans && (
            <div className="relative">
              <button
                type="button"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Notifications"
                title="Notifications"
                onClick={() => setIsNotificationOpen((prev) => !prev)}
              >
                <Icon name="Bell" size={18} />
                {notificationCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                    {notificationLabel}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 top-12 z-[110] w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-border bg-card shadow-elevation-lg">
                  <div className="border-b border-border px-4 py-3">
                    <h3 className="text-sm font-semibold text-foreground">
                      Loan Requests
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Review pending branch requests from staff.
                    </p>
                  </div>
                  <div className="max-h-[420px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="border-b border-border px-4 py-3 last:border-b-0"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground">
                                {notification.customer_name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {notification.loan_code} • {notification.branch_name}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                Requested by{" "}
                                {notification.requested_by_name ||
                                  notification.requested_by_username ||
                                  "Staff"}{" "}
                                • Rs{" "}
                                {Number(
                                  notification.principal_amount || 0,
                                ).toLocaleString("en-IN")}
                              </p>
                            </div>
                            <span className="rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-semibold text-amber-600">
                              Pending
                            </span>
                          </div>
                          <div className="mt-3 grid grid-cols-3 gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setIsNotificationOpen(false);
                                navigate(`/loan-details/${notification.id}`);
                              }}
                            >
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="success"
                              disabled={reviewLoanMutation.isPending}
                              onClick={async () => {
                                try {
                                  await reviewLoanMutation.mutateAsync({
                                    loanId: notification.id,
                                    action: "APPROVE",
                                  });
                                  showToast?.("Loan request approved", "success");
                                } catch (error) {
                                  showToast?.(
                                    error?.message || "Failed to approve request",
                                    "error",
                                  );
                                }
                              }}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={reviewLoanMutation.isPending}
                              onClick={async () => {
                                const rejectionReason =
                                  window.prompt(
                                    `Why are you rejecting ${notification.loan_code}?`,
                                    "Insufficient review details",
                                  ) || "";

                                try {
                                  await reviewLoanMutation.mutateAsync({
                                    loanId: notification.id,
                                    action: "REJECT",
                                    rejectionReason,
                                  });
                                  showToast?.("Loan request rejected", "success");
                                } catch (error) {
                                  showToast?.(
                                    error?.message || "Failed to reject request",
                                    "error",
                                  );
                                }
                              }}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                        No pending requests right now.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          <UserProfileMenu
            onThemeToggle={handleThemeToggle}
            currentTheme={currentTheme}
          />
        </div>
      </div>
    </header>
  );
}
