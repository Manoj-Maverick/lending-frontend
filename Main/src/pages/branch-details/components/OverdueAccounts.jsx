import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const OverdueAccounts = ({ accounts, onViewClient }) => {
  const getDaysOverdueColor = (days) => {
    if (days > 30) return "text-error";
    if (days > 15) return "text-warning";
    return "text-muted-foreground";
  };

  return (
    <div className="bg-card rounded-lg shadow-elevation-sm p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground">
          Overdue Accounts
        </h2>
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-error/10 text-error text-xs md:text-sm font-medium">
          <Icon name="AlertCircle" size={16} />
          {accounts?.length} Accounts
        </span>
      </div>
      <div className="space-y-3 md:space-y-4">
        {accounts?.length > 0 ? (
          accounts?.map((account) => (
            <div
              key={account?.id}
              className="bg-background rounded-lg p-4 md:p-5 border border-border hover:shadow-elevation-md transition-smooth"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <h3 className="text-sm md:text-base font-medium text-foreground line-clamp-1">
                      {account?.clientName}
                    </h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      Loan: {account?.loanCode}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Overdue Amount
                      </p>
                      <p className="text-sm md:text-base font-semibold text-error">
                        ₹{account?.overdueAmount?.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Days Overdue
                      </p>
                      <p
                        className={`text-sm md:text-base font-semibold ${getDaysOverdueColor(account?.daysOverdue)}`}
                      >
                        {account?.daysOverdue} days
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Last Payment
                      </p>
                      <p className="text-sm md:text-base text-foreground">
                        {new Date(account.lastPaymentDate)?.toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Contact
                      </p>
                      <p className="text-sm md:text-base text-foreground whitespace-nowrap">
                        {account?.phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 lg:flex-col lg:items-stretch">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="User"
                    iconPosition="left"
                    onClick={() => onViewClient(account?.clientId)}
                    className="flex-1 lg:flex-none"
                  >
                    View Client
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    iconName="Phone"
                    iconPosition="left"
                    className="flex-1 lg:flex-none"
                  >
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 md:py-12">
            <Icon
              name="CheckCircle"
              size={48}
              className="mx-auto mb-4 text-success opacity-50"
            />
            <p className="text-sm md:text-base text-muted-foreground">
              No overdue accounts
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverdueAccounts;
