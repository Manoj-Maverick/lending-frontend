import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { queryConfig } from "query/queryConfig";
import { usePrefetchOnHover } from "query/usePrefetchOnHover";

const LoansTable = ({ loans, onViewLoan }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const { onMouseEnter, onMouseLeave } = usePrefetchOnHover(
    (loanId) => queryConfig.loans.details(loanId),
    140,
  );

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE:
        "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
      OVERDUE:
        "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
      CLOSED:
        "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
      Pending:
        "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
      FORECLOSED:
        "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
    };
    return colors?.[status] || colors?.["Active"];
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Loan ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Borrower
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Loan Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Outstanding
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                EMI Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Next EMI Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loans?.map((loan) => (
              <tr
                key={loan?.id}
                className="hover:bg-muted/30 transition-colors"
                onMouseEnter={() => onMouseEnter(loan?.loanId)}
                onMouseLeave={onMouseLeave}
                onFocus={() => onMouseEnter(loan?.loanId)}
                onBlur={onMouseLeave}
              >
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-foreground">
                    {loan?.id}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {loan?.branch}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-foreground">
                    {loan?.clientName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {loan?.clientCode}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-semibold text-foreground">
                    ₹{loan?.loanAmount?.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {loan?.interestRate}% | {loan?.tenure + " "}
                    {" " + loan?.tenureUnit.toLowerCase() + "s"}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-foreground">
                  ₹{loan?.outstanding?.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  ₹{loan?.emiAmount?.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {loan?.nextEmiDate?.split("T")[0] ?? "-"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      loan?.status,
                    )}`}
                  >
                    {loan?.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onMouseEnter={() => onMouseEnter(loan?.loanId)}
                    onMouseLeave={onMouseLeave}
                    onFocus={() => onMouseEnter(loan?.loanId)}
                    onBlur={onMouseLeave}
                    onClick={() => onViewLoan(loan)}
                  >
                    <Icon name="Eye" size={14} />
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {loans?.map((loan) => (
          <div
            key={loan?.id}
            className="bg-muted/30 rounded-lg border border-border overflow-hidden"
            onMouseEnter={() => onMouseEnter(loan?.loanId)}
            onMouseLeave={onMouseLeave}
            onFocus={() => onMouseEnter(loan?.loanId)}
            onBlur={onMouseLeave}
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => toggleRow(loan?.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e?.key === "Enter" && toggleRow(loan?.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    {loan?.clientName}
                  </h3>
                  <p className="text-xs text-muted-foreground">{loan?.id}</p>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    loan?.status,
                  )}`}
                >
                  {loan?.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground">
                    Outstanding
                  </span>
                  <p className="text-lg font-bold text-foreground">
                    ₹{loan?.outstanding?.toLocaleString()}
                  </p>
                </div>
                <Icon
                  name={expandedRow === loan?.id ? "ChevronUp" : "ChevronDown"}
                  size={16}
                  className="text-muted-foreground"
                />
              </div>
            </div>
            {expandedRow === loan?.id && (
              <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Loan Amount:</span>
                    <p className="text-foreground font-medium mt-0.5">
                      ₹{loan?.loanAmount?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">EMI Amount:</span>
                    <p className="text-foreground font-medium mt-0.5">
                      ₹{loan?.emiAmount?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Interest Rate:
                    </span>
                    <p className="text-foreground font-medium mt-0.5">
                      {loan?.interestRate}%
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tenure:</span>
                    <p className="text-foreground font-medium mt-0.5">
                      {loan?.tenure} {loan?.tenureUnit.toLowerCase() + "s"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Next EMI:</span>
                    <p className="text-foreground font-medium mt-0.5">
                      {loan?.nextEmiDate}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Branch:</span>
                    <p className="text-foreground font-medium mt-0.5">
                      {loan?.branch}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onMouseEnter={() => onMouseEnter(loan?.loanId)}
                  onMouseLeave={onMouseLeave}
                  onFocus={() => onMouseEnter(loan?.loanId)}
                  onBlur={onMouseLeave}
                  onClick={() => onViewLoan(loan)}
                  className="w-full"
                >
                  <Icon name="Eye" size={14} />
                  View Full Details
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty state */}
      {loans?.length === 0 && (
        <div className="p-8 md:p-12 text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Icon name="FileText" size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">
            No loans found
          </h3>
          <p className="text-sm md:text-base text-muted-foreground">
            No loan records available at this time
          </p>
        </div>
      )}
    </div>
  );
};

export default LoansTable;
