import React from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";

const statusBadgeClass = (status) => {
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
  onOpenContacts,
  isCollecting,
}) => {
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
        <table className="w-full">
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
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-muted/40 transition">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={row.avatar}
                      alt={row.clientName}
                      className="w-10 h-10 rounded-full object-cover border shrink-0"
                    />

                    <div className="min-w-0">
                      <p className="font-medium text-foreground leading-tight truncate">
                        {row.clientName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {row.clientCode}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{row.phone}</span>
                    <button
                      onClick={(event) => onOpenContacts(event, row)}
                      className="p-2 rounded-md hover:bg-muted transition"
                      title="Show contacts"
                    >
                      <Icon name="Phone" size={16} />
                    </button>
                  </div>
                </td>

                <td className="px-4 py-3 font-semibold">
                  Rs {row.amount.toLocaleString()}
                </td>

                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {row.dueDate}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusBadgeClass(
                      row.status,
                    )}`}
                  >
                    {row.status}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {row.status !== "Paid" && (
                      <Button
                        size="sm"
                        variant="default"
                        iconName="CreditCard"
                        onClick={() => onCollect(row)}
                        disabled={isCollecting === row.id}
                      >
                        {isCollecting === row.id ? "Collecting..." : "Collect"}
                      </Button>
                    )}
                    {row.status === "Overdue" && (
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
                      onClick={() => onViewLoan(row.clientCode)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollectionTable;
