import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "utils/cn";

import Icon from "../../components/AppIcon";

import { useUIContext } from "context/UIContext";

import CollectionDateScope from "./components/CollectionDateScope";
import CollectionFilters from "./components/CollectionFilters";
import CollectionStats from "./components/CollectionStats";
import CollectionTabs from "./components/CollectionTabs";
import CollectionTable from "./components/CollectionTable";
import ContactPopover from "./components/ContactPopover";

import { useCollections } from "hooks/collections/useCollections";
import { useOverdueCollections } from "hooks/collections/useOverDueCollections";
import { useOverdueCount } from "hooks/collections/useOverDueCount";

import { addIndianDays, getIndianDate } from "utils/date";

const todayStr = () => getIndianDate();

const Collections = () => {
  const navigate = useNavigate();
  const { branches: branchesData } = useUIContext();

  const [mode, setMode] = useState("today");
  const [range, setRange] = useState("today");
  const [customDate, setCustomDate] = useState(todayStr());
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("all");

  const [openContact, setOpenContact] = useState(null);
  const [openContactsData, setOpenContactsData] = useState(null);

  const branchOptions = useMemo(
    () => [
      { value: "all", label: "All Branches" },
      ...(branchesData?.map((item) => ({
        value: String(item.id),
        label: item.branch_name,
      })) || []),
    ],
    [branchesData],
  );

  // ────────────────────────────────────────────────
  // DATE RANGE LOGIC
  // ────────────────────────────────────────────────
  const { startDate, endDate } = useMemo(() => {
    const today = todayStr();

    if (range === "custom" && customDate) {
      return { startDate: customDate, endDate: customDate };
    }

    if (mode === "today") {
      return { startDate: today, endDate: today };
    }

    if (mode === "upcoming") {
      if (range === "tomorrow") {
        const t = addIndianDays(today, 1);
        return { startDate: t, endDate: t };
      }
      if (range === "next7") {
        return {
          startDate: addIndianDays(today, 1),
          endDate: addIndianDays(today, 7),
        };
      }
      // fallback
      return {
        startDate: addIndianDays(today, 1),
        endDate: addIndianDays(today, 7),
      };
    }

    // OVERDUE mode
    if (range === "last7") {
      return {
        startDate: addIndianDays(today, -7),
        endDate: addIndianDays(today, -1),
      };
    }
    if (range === "last30") {
      return {
        startDate: addIndianDays(today, -30),
        endDate: addIndianDays(today, -1),
      };
    }
    if (range === "last90") {
      return {
        startDate: addIndianDays(today, -90),
        endDate: addIndianDays(today, -1),
      };
    }

    // default overdue range
    return {
      startDate: addIndianDays(today, -30),
      endDate: addIndianDays(today, -1),
    };
  }, [mode, range, customDate]);

  const params = {
    start_date: startDate,
    end_date: endDate,
    branch_id: branch === "all" ? null : branch,
  };

  // ────────────────────────────────────────────────
  // DATA FETCHING
  // ────────────────────────────────────────────────
  const { data: normalRows = [], isLoading: loadingNormal } =
    useCollections(params);

  const { data: overdueRows = [], isLoading: loadingOverdue } =
    useOverdueCollections(params);
  console.log(overdueRows);

  const { data: overdueData } = useOverdueCount({
    branch_id: params.branch_id,
  });

  const overdueCount = overdueData?.count || 0;

  const rows = mode === "overdue" ? overdueRows : normalRows;
  const isLoading = mode === "overdue" ? loadingOverdue : loadingNormal;

  // ────────────────────────────────────────────────
  // FILTERING
  // ────────────────────────────────────────────────
  const filteredRows = useMemo(() => {
    const query = search.toLowerCase().trim();

    return rows.filter((row) => {
      const matchesSearch =
        (row.clientName || "").toLowerCase().includes(query) ||
        (row.clientCode || "").toLowerCase().includes(query) ||
        (row.phone || "").replace(/\s/g, "").includes(query.replace(/\s/g, ""));

      const matchesTab =
        activeTab === "all" ||
        (activeTab === "paid" && row.status === "Paid") ||
        (activeTab === "pending" && row.status === "Pending") ||
        (activeTab === "overdue" && row.status === "Overdue");

      return matchesSearch && matchesTab;
    });
  }, [rows, search, activeTab]);

  // ────────────────────────────────────────────────
  // STATS
  // ────────────────────────────────────────────────
  const stats = useMemo(() => {
    const target = filteredRows.reduce(
      (sum, r) => sum + Number(r.amount || 0),
      0,
    );

    const collected = filteredRows
      .filter((r) => r.status === "Paid")
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);

    const pending = filteredRows
      .filter((r) => r.status === "Pending")
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);

    const overdueSum = filteredRows
      .filter((r) => r.status === "Overdue")
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);

    const base = [
      { title: "Target", value: target, icon: "Target" },
      { title: "Collected", value: collected, icon: "CheckCircle" },
      { title: "Pending", value: pending, icon: "Clock" },
    ];

    if (mode === "overdue") {
      base.push({
        title: "Overdue",
        value: overdueSum,
        icon: "AlertTriangle",
      });
    }

    return base;
  }, [filteredRows, mode]);

  // ────────────────────────────────────────────────
  // UI HELPERS
  // ────────────────────────────────────────────────
  const dateScopeItems =
    mode === "today"
      ? [{ id: "today", label: "Today" }]
      : mode === "upcoming"
        ? [
            { id: "tomorrow", label: "Tomorrow" },
            { id: "next7", label: "Next 7 Days" },
          ]
        : [
            { id: "last7", label: "Last 7 Days" },
            { id: "last30", label: "Last 30 Days" },
            { id: "last90", label: "Last 90 Days" },
          ];

  const visibleTabs =
    mode === "today"
      ? ["all", "paid", "pending"]
      : mode === "upcoming"
        ? ["all", "pending"]
        : ["all", "overdue"];

  const pageTitle =
    mode === "today"
      ? "Today's Collections"
      : mode === "upcoming"
        ? "Upcoming Collections"
        : "Overdue Collections";

  const pageSubtitle =
    mode === "today"
      ? "Due today – focus on collections"
      : mode === "upcoming"
        ? "Upcoming EMIs – plan ahead"
        : "Past due – urgent follow-ups required";

  const headerIcon =
    mode === "today"
      ? "Calendar"
      : mode === "upcoming"
        ? "Clock"
        : "AlertTriangle";

  const headerColor =
    mode === "today"
      ? "text-primary"
      : mode === "upcoming"
        ? "text-blue-500"
        : "text-red-600 dark:text-red-500";

  // ────────────────────────────────────────────────
  // HANDLERS
  // ────────────────────────────────────────────────
  const handleCollect = (row) => navigate(`/loan-details/${row.loanId}`);
  const handleRemind = (row) => alert(`Reminder sent to ${row.clientName}`);
  const handleViewLoan = (loanId) => navigate(`/loan-details/${loanId}`);

  const handleOpenContacts = (event, row) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setOpenContact({ id: row.id, rect });
    setOpenContactsData([{ label: "Customer", phone: row.phone }]);
  };

  const handleReset = () => {
    setSearch("");
    setBranch("all");
    setActiveTab("all");
  };

  // Reset range & tab when mode changes
  useEffect(() => {
    if (mode === "today") {
      setRange("today");
      setActiveTab("all");
    } else if (mode === "upcoming") {
      setRange("next7");
      setActiveTab("all");
    } else {
      setRange("last7");
      setActiveTab("overdue");
    }
  }, [mode]);

  // ────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────
  return (
    <>
      {/* HEADER + MODE SWITCH */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
        <div>
          <h1
            className={cn(
              "text-3xl font-bold flex items-center gap-3",
              headerColor,
            )}
          >
            <Icon name={headerIcon} size={32} />
            {pageTitle}
          </h1>
          <p className="text-muted-foreground mt-1.5">{pageSubtitle}</p>
        </div>

        {/* Segmented Control */}
        <div className="mb-0 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex justify-center sm:justify-end mt-2 sm:mt-0">
            <div className="relative inline-flex items-center bg-muted/60 border border-border rounded-full p-1 shadow-sm">
              {[
                { key: "today", label: "Today" },
                { key: "upcoming", label: "Upcoming" },
                { key: "overdue", label: "Overdue" },
              ].map((item) => {
                const isActive = mode === item.key;

                return (
                  <button
                    key={item.key}
                    onClick={() => setMode(item.key)}
                    className={cn(
                      "relative z-10 px-3 sm:px-5 py-1.5 sm:py-2 text-sm font-medium rounded-full transition-colors",
                      "flex items-center justify-center",
                    )}
                  >
                    {/* 🔥 SLIDER MOVED INSIDE BUTTON */}
                    {isActive && (
                      <motion.div
                        layoutId="switch-pill"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 35,
                        }}
                        className={cn(
                          "absolute inset-0 rounded-full shadow-md",
                          item.key === "today" && "bg-primary",
                          item.key === "upcoming" && "bg-blue-600",
                          item.key === "overdue" && "bg-red-600",
                        )}
                      />
                    )}

                    {/* TEXT */}
                    <span
                      className={cn(
                        "relative z-10 flex items-center",
                        isActive
                          ? "text-white"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {item.label}

                      {item.key === "overdue" && overdueCount > 0 && (
                        <span
                          className={cn(
                            "ml-1.5 sm:ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-semibold",
                            isActive
                              ? "bg-white/30 text-white"
                              : "bg-red-500/90 text-white",
                          )}
                        >
                          {overdueCount}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <CollectionStats stats={stats} />

      <div className="bg-card border rounded-lg p-5 mb-6 space-y-5 shadow-sm">
        <CollectionDateScope
          scope={range}
          customDate={customDate}
          onScopeChange={setRange}
          onCustomDateChange={(v) => {
            setCustomDate(v);
            setRange("custom");
          }}
          items={dateScopeItems}
        />

        <CollectionFilters
          search={search}
          onSearchChange={setSearch}
          branchOptions={branchOptions}
          branch={branch}
          onBranchChange={setBranch}
          onReset={handleReset}
        />
      </div>

      <CollectionTabs
        activeTab={activeTab}
        onChange={setActiveTab}
        visibleTabs={visibleTabs}
      />

      <CollectionTable
        rows={filteredRows}
        loading={isLoading}
        onCollect={handleCollect}
        onRemind={handleRemind}
        onViewLoan={handleViewLoan}
        onOpenContacts={handleOpenContacts}
        mode={mode}
      />

      <AnimatePresence>
        {openContact && (
          <ContactPopover
            key={openContact.id}
            anchorRect={openContact.rect}
            contacts={openContactsData}
            onClose={() => {
              setOpenContact(null);
              setOpenContactsData(null);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Collections;
