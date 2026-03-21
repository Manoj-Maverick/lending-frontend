import React from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";
import { API_BASE_URL } from "api/client";

const statusBadgeClass = (status) => {
  const map = {
    Paid: "bg-success/10 text-success",
    Pending: "bg-warning/10 text-warning",
    Overdue: "bg-error/10 text-error",
  };
  return map[status] || "bg-muted/10 text-muted-foreground";
};

const toApiAssetUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

const CollectionTable = ({
  rows,
  onCollect,
  onRemind,
  onViewLoan,
  onOpenContacts,
  loading,
  mode = "today",
}) => {
  if (loading) {
    return <div className="p-8 text-center">Loading collections...</div>;
  }

  if (!rows.length) {
    return (
      <div className="p-8 text-center text-muted-foreground bg-card border border-border rounded-lg">
        No collections for selected filters
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px]">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                Borrower & Loan
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                Due Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                Actions
              </th>

              {mode === "overdue" && (
                <>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                    Days Overdue
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                    Penalty
                  </th>
                </>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-muted/40 transition">
                {/* ✅ Borrower + Profile Pic */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Profile Pic */}
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted shrink-0">
                      {row.profile_pic ? (
                        <img
                          src={toApiAssetUrl(row.profile_pic)}
                          alt={row.clientName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                          {row.clientName?.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Name + Loan */}
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {row.clientName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {row.loan_code}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Phone */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm">{row.phone}</span>
                    <button
                      onClick={(e) => onOpenContacts(e, row)}
                      className="p-2 rounded-full bg-primary/10 text-primary shrink-0"
                    >
                      <Icon name="Phone" size={15} />
                    </button>
                  </div>
                </td>

                {/* Amount */}
                <td className="px-4 py-3 font-semibold">
                  Rs {Number(row.amount).toLocaleString()}
                </td>

                {/* Due Date */}
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {row.due_date.split("T")[0]}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusBadgeClass(
                      row.status,
                    )}`}
                  >
                    {row.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {row.status !== "Paid" && (
                      <Button
                        size="sm"
                        variant="default"
                        iconName="CreditCard"
                        onClick={() => onCollect(row)}
                      >
                        Collect
                      </Button>
                    )}

                    {mode === "overdue" && row.status === "Overdue" && (
                      <Button
                        size="sm"
                        variant="warning"
                        iconName="AlertTriangle"
                        onClick={() => onRemind(row)}
                      >
                        Remind
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      iconName="Eye"
                      onClick={() => onViewLoan(row.loanId)}
                    />
                  </div>
                </td>

                {/* Overdue Extra Columns */}
                {mode === "overdue" && (
                  <>
                    <td className="px-4 py-3 font-medium text-error">
                      {row.days_overdue || "-"}
                    </td>
                    <td className="px-4 py-3">
                      Rs {Number(row.penalty || 0).toLocaleString()}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollectionTable;
