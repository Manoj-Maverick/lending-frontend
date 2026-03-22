import React from "react";

const cx = (...classes) => classes.filter(Boolean).join(" ");

export const Skeleton = ({ className = "" }) => (
  <div
    className={cx(
      "relative overflow-hidden rounded-md border border-border/40 bg-slate-200/90 before:absolute before:inset-y-0 before:left-[-60%] before:w-[60%] before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/95 before:to-transparent dark:border-white/5 dark:bg-slate-800/80 dark:before:via-slate-100/20",
      className,
    )}
    aria-hidden="true"
  />
);

export const PageHeaderSkeleton = ({ showAction = true }) => (
  <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-8 w-64 md:h-10 md:w-80" />
      </div>
      <Skeleton className="h-4 w-56 md:w-80" />
    </div>
    {showAction && <Skeleton className="h-11 w-full rounded-xl sm:w-40" />}
  </div>
);

export const StatCardSkeleton = () => (
  <div className="rounded-lg border border-border bg-card p-4 md:p-6">
    <div className="mb-4 flex items-center justify-between">
      <Skeleton className="h-10 w-10 rounded-lg md:h-12 md:w-12" />
      <Skeleton className="h-4 w-12" />
    </div>
    <Skeleton className="mb-2 h-8 w-24 md:h-10 md:w-28" />
    <Skeleton className="h-4 w-32 md:w-36" />
  </div>
);

export const TableCardSkeleton = ({
  rows = 5,
  columns = 5,
  showHeaderAction = false,
  showAvatar = true,
  className = "",
}) => (
  <div
    className={cx(
      "overflow-hidden rounded-lg border border-border bg-card",
      className,
    )}
  >
    <div className="border-b border-border p-4 md:p-5 lg:p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        {showHeaderAction && <Skeleton className="h-9 w-24 rounded-lg" />}
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px]">
        <thead className="bg-muted/30">
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index} className="px-4 py-3">
                <Skeleton className="h-4 w-16" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border last:border-b-0">
              {Array.from({ length: columns }).map((_, columnIndex) => (
                <td key={columnIndex} className="px-4 py-4">
                  {showAvatar && columnIndex === 0 ? (
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  ) : (
                    <Skeleton className="h-4 w-full max-w-[120px]" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const CardGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="rounded-xl border border-border bg-card p-5 shadow-sm"
      >
        <div className="mb-4 flex items-start gap-3">
          <Skeleton className="h-11 w-11 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <Skeleton className="mb-2 h-8 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    ))}
  </div>
);

export const ChartCardSkeleton = ({ className = "" }) => (
  <div
    className={cx(
      "rounded-lg border border-border bg-card p-4 md:p-5 lg:p-6",
      className,
    )}
  >
    <div className="mb-6 flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-4 w-52" />
      </div>
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
    <div className="flex h-64 items-end gap-3 md:h-72 lg:h-80">
      {Array.from({ length: 7 }).map((_, index) => (
        <Skeleton
          key={index}
          className={cx(
            "w-full rounded-t-xl",
            [
              "h-28",
              "h-40",
              "h-32",
              "h-48",
              "h-36",
              "h-56",
              "h-44",
            ][index],
          )}
        />
      ))}
    </div>
  </div>
);
