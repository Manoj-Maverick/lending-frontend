import React from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";

const badge = (status) => {
  const map = {
    Paid: "bg-success/10 text-success",
    Pending: "bg-warning/10 text-warning",
    Overdue: "bg-error/10 text-error",
  };
  return map[status] || "bg-muted/10 text-muted-foreground";
};

const CollectionTable = ({
  rows,
  onCollect,
  onRemind,
  onViewLoan,
  isCollectingPayment,
}) => {
  if (!rows.length) {
    return (
      <div className="p-8 text-center text-muted-foreground bg-card border border-border rounded-lg">
        No collections for today
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-x-auto mb-6">
      <table className="w-full min-w-[800px]">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
              Client & Loan
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
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {rows.map((r) => (
            <tr key={r.id} className="hover:bg-muted/40 transition">
              <td className="px-4 py-3">
                <div className="font-medium text-foreground">
                  {r.clientName}
                </div>
                <div className="text-xs text-muted-foreground">{r.loanId}</div>
              </td>

              <td className="px-4 py-3 text-sm">{r.phone}</td>

              <td className="px-4 py-3 font-semibold">
                ₹{r.amount.toLocaleString()}
              </td>

              <td className="px-4 py-3 text-sm text-muted-foreground">
                {r.dueDate}
              </td>

              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${badge(
                    r.status,
                  )}`}
                >
                  {r.status}
                </span>
              </td>

              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  {r.status !== "Paid" && (
                    <Button
                      size="sm"
                      onClick={() => onCollect(r)}
                      disabled={isCollectingPayment === r.id}
                    >
                      {isCollectingPayment === r.id
                        ? "Collecting..."
                        : "Collect"}
                    </Button>
                  )}

                  {r.status === "Overdue" && (
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => onRemind(r)}
                    >
                      Remind
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onViewLoan(r.loanId)}
                  >
                    <Icon name="Eye" size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CollectionTable;
