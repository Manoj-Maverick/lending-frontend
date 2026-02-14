import React from "react";
import Icon from "../../../components/AppIcon";
import { useGetWeeklyLoanSummary } from "hooks/branch.deatils.page.hooks/useGetWeeklyLoanSummary";

const DailyCollectionsWeekly = ({ branchId }) => {
  const { data: branchData, isLoading } = useGetWeeklyLoanSummary(branchId);

  const data = branchData?.map((item) => ({
    day: item.weekday,
    count: Number(item.active_loans),
    amount: Number(item.total_weekly_amount),
  }));
  if (isLoading) return <div>Loading</div>;
  return (
    <div className="mb-8 bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base md:text-lg font-semibold text-foreground">
            Daily Collections – Weekly Schedule
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Quick view of this week’s performance
          </p>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon name="Calendar" size={20} />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
        {data.map((item) => {
          const count = Math.floor(item.count);
          const amount = Math.floor(item.amount);
          const isZero = amount === 0;

          return (
            <div
              key={item.day}
              className="group relative overflow-hidden rounded-2xl border border-border bg-background p-4 text-center transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              {/* Subtle gradient glow */}
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent" />

              {/* Day */}
              <div className="relative text-xs font-medium text-muted-foreground tracking-wide">
                {item.day} • {count}
              </div>

              {/* Amount */}
              <div
                className={`relative mt-2 text-xl font-semibold ${
                  isZero ? "text-muted-foreground" : "text-foreground"
                }`}
              >
                ₹{amount.toLocaleString("en-IN")}
              </div>

              {/* Status pill */}
              <div className="relative mt-2 flex justify-center">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border ${
                    isZero
                      ? "border-muted text-muted-foreground"
                      : "border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {isZero ? "No collections" : "Collected"}
                </span>
              </div>

              {/* Bottom accent bar */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 ${
                  isZero ? "bg-muted" : "bg-emerald-500"
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyCollectionsWeekly;
