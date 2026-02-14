import React from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";

const TodayPaymentsTable = () => {
  const todayPayments = [
    {
      id: "PAY-001",
      clientName: "Sarah Johnson",
      clientCode: "CLI-1024",
      avatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_1456eb2f9-1763294356174.png",
      avatarAlt:
        "Professional headshot of Caucasian woman with blonde hair in business attire",
      loanCode: "LN-2024-001",
      dueAmount: 250,
      status: "pending",
      branch: "Main Branch",
    },
    {
      id: "PAY-002",
      clientName: "Michael Chen",
      clientCode: "CLI-1025",
      avatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_1a75f5670-1763292878816.png",
      avatarAlt:
        "Professional headshot of Asian man with short black hair in formal suit",
      loanCode: "LN-2024-002",
      dueAmount: 180,
      status: "paid",
      branch: "North Branch",
    },
    {
      id: "PAY-003",
      clientName: "Emily Rodriguez",
      clientCode: "CLI-1026",
      avatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_13817b13e-1763295856027.png",
      avatarAlt:
        "Professional headshot of Hispanic woman with long brown hair in blue blouse",
      loanCode: "LN-2024-003",
      dueAmount: 320,
      status: "pending",
      branch: "South Branch",
    },
    {
      id: "PAY-004",
      clientName: "David Thompson",
      clientCode: "CLI-1027",
      avatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_12c942d4c-1763294979358.png",
      avatarAlt:
        "Professional headshot of African American man with short hair in gray suit",
      loanCode: "LN-2024-004",
      dueAmount: 275,
      status: "overdue",
      branch: "East Branch",
    },
    {
      id: "PAY-005",
      clientName: "Lisa Anderson",
      clientCode: "CLI-1028",
      avatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_1c2d3f8ee-1763296078446.png",
      avatarAlt:
        "Professional headshot of Caucasian woman with red hair in professional attire",
      loanCode: "LN-2024-005",
      dueAmount: 195,
      status: "paid",
      branch: "West Branch",
    },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: {
        label: "Paid",
        className:
          "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400",
        icon: "CheckCircle2",
      },
      pending: {
        label: "Pending",
        className:
          "bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400",
        icon: "Clock",
      },
      overdue: {
        label: "Overdue",
        className:
          "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400",
        icon: "AlertCircle",
      },
    };

    const config = statusConfig?.[status] || statusConfig?.pending;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${config?.className}`}
      >
        <Icon name={config?.icon} size={12} />
        {config?.label}
      </span>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden mb-5">
      <div className="p-4 md:p-5 lg:p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base md:text-lg lg:text-xl font-semibold text-foreground">
              Today's Payments
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              {todayPayments?.length} payments due today
            </p>
          </div>
          <Button variant="outline" size="sm" iconName="Download">
            Export
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-4 py-3 text-left text-xs md:text-sm font-medium text-muted-foreground">
                Client
              </th>
              <th className="px-4 py-3 text-left text-xs md:text-sm font-medium text-muted-foreground">
                Loan Code
              </th>
              <th className="px-4 py-3 text-left text-xs md:text-sm font-medium text-muted-foreground">
                Branch
              </th>
              <th className="px-4 py-3 text-right text-xs md:text-sm font-medium text-muted-foreground">
                Due Amount
              </th>
              <th className="px-4 py-3 text-center text-xs md:text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-center text-xs md:text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {todayPayments?.map((payment, index) => (
              <tr
                key={payment?.id}
                className={`border-b border-border hover:bg-muted/20 transition-colors ${
                  index === todayPayments?.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="px-4 py-3 md:py-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={payment?.avatar}
                        alt={payment?.avatarAlt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs md:text-sm font-medium text-foreground truncate">
                        {payment?.clientName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {payment?.clientCode}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 md:py-4 text-xs md:text-sm text-foreground">
                  {payment?.loanCode}
                </td>
                <td className="px-4 py-3 md:py-4 text-xs md:text-sm text-muted-foreground">
                  {payment?.branch}
                </td>
                <td className="px-4 py-3 md:py-4 text-right text-xs md:text-sm font-medium text-foreground whitespace-nowrap">
                  ${payment?.dueAmount?.toLocaleString()}
                </td>
                <td className="px-4 py-3 md:py-4 text-center">
                  {getStatusBadge(payment?.status)}
                </td>
                <td className="px-4 py-3 md:py-4">
                  <div className="flex items-center justify-center gap-1 md:gap-2">
                    {payment?.status !== "paid" && (
                      <Button variant="ghost" size="sm" iconName="DollarSign">
                        Pay
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" iconName="Eye">
                      View
                    </Button>
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

export default TodayPaymentsTable;
