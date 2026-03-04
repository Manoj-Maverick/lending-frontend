import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import { useUIContext } from "context/UIContext";

import CollectionDateScope from "./components/CollectionDateScope";
import CollectionFilters from "./components/CollectionFilters";
import CollectionStats from "./components/CollectionStats";
import CollectionTabs from "./components/CollectionTabs";
import CollectionTable from "./components/CollectionTable";
import ContactPopover from "./components/ContactPopover";

import { useCollections } from "hooks/todayCollections.page.hooks/useGetTodayCollections";

const getIndianDate = (date = new Date()) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

const todayStr = () => getIndianDate();

const addDays = (date, days) => {
  const base = new Date(date);
  base.setDate(base.getDate() + days);
  return getIndianDate(base);
};

const TodaysCollection = () => {
  const navigate = useNavigate();
  const { branches: branchesData } = useUIContext();

  const [range, setRange] = useState("today");
  const [customDate, setCustomDate] = useState(todayStr());
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("all");

  const [openContact, setOpenContact] = useState(null);
  const [openContactsData, setOpenContactsData] = useState(null);

  const branchOptions = [
    { value: "all", label: "All Branches" },
    ...(branchesData?.map((item) => ({
      value: String(item.id),
      label: item.branch_name,
    })) || []),
  ];

  /*
  --------------------------------------------------
  Date range calculation
  --------------------------------------------------
  */

  const { startDate, endDate } = useMemo(() => {
    if (range === "today") {
      return { startDate: todayStr(), endDate: todayStr() };
    }

    if (range === "tomorrow") {
      const tomorrow = addDays(todayStr(), 1);
      return { startDate: tomorrow, endDate: tomorrow };
    }

    if (range === "next7") {
      return { startDate: todayStr(), endDate: addDays(todayStr(), 7) };
    }

    return { startDate: customDate, endDate: customDate };
  }, [range, customDate]);

  /*
  --------------------------------------------------
  Fetch collections from backend
  --------------------------------------------------
  */

  const { data: rows = [], isLoading } = useCollections({
    start_date: startDate,
    end_date: endDate,
    branch_id: branch === "all" ? null : branch,
  });

  console.log("Fetched collections:", rows, "with params:", {
    start_date: startDate,
    end_date: endDate,
    branch_id: branch === "all" ? null : branch,
  });

  /*
  --------------------------------------------------
  Local filtering (search + tabs)
  --------------------------------------------------
  */

  const filteredRows = useMemo(() => {
    const query = search.toLowerCase().trim();

    return rows.filter((row) => {
      const matchesSearch =
        row.clientName?.toLowerCase().includes(query) ||
        row.clientCode?.toLowerCase().includes(query) ||
        row.phone?.replace(/\s/g, "").includes(query.replace(/\s/g, ""));

      const matchesTab =
        activeTab === "all" ||
        (activeTab === "paid" && row.status === "Paid") ||
        (activeTab === "pending" && row.status === "Pending") ||
        (activeTab === "overdue" && row.status === "Overdue");

      return matchesSearch && matchesTab;
    });
  }, [rows, search, activeTab]);

  /*
  --------------------------------------------------
  Stats calculation
  --------------------------------------------------
  */

  const stats = useMemo(() => {
    const target = filteredRows.reduce(
      (sum, row) => sum + Number(row.amount),
      0,
    );

    const collected = filteredRows
      .filter((row) => row.status === "Paid")
      .reduce((sum, row) => sum + Number(row.amount), 0);

    const pending = filteredRows
      .filter((row) => row.status === "Pending")
      .reduce((sum, row) => sum + Number(row.amount), 0);

    const overdue = filteredRows
      .filter((row) => row.status === "Overdue")
      .reduce((sum, row) => sum + Number(row.amount), 0);

    return [
      { title: "Target", value: target, icon: "Target" },
      { title: "Collected", value: collected, icon: "CheckCircle" },
      { title: "Pending", value: pending, icon: "Clock" },
      { title: "Overdue", value: overdue, icon: "AlertTriangle" },
    ];
  }, [filteredRows]);

  /*
  --------------------------------------------------
  Handlers
  --------------------------------------------------
  */

  const handleCollect = (row) => {
    navigate(`/loan-details/${row.loanId}`);
  };

  const handleRemind = (row) => {
    alert(`Reminder sent to ${row.clientName}`);
  };

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

  /*
  --------------------------------------------------
  UI
  --------------------------------------------------
  */

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
            <Icon name="Calendar" size={32} className="text-primary" />
            Today's Collection
          </h1>

          <p className="text-muted-foreground mt-2">
            Plan and track loan collections
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" iconName="Download">
            Export
          </Button>

          <Button variant="outline" iconName="Printer">
            Print
          </Button>
        </div>
      </div>

      <CollectionStats stats={stats} />

      <div className="bg-card border border-border rounded-lg p-4 mb-6 space-y-4">
        <CollectionDateScope
          scope={range}
          customDate={customDate}
          onScopeChange={setRange}
          onCustomDateChange={(value) => {
            setCustomDate(value);
            setRange("custom");
          }}
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

      <CollectionTabs activeTab={activeTab} onChange={setActiveTab} />

      <CollectionTable
        rows={filteredRows}
        loading={isLoading}
        onCollect={handleCollect}
        onRemind={handleRemind}
        onViewLoan={(loanId) => navigate(`/loan-details/${loanId}`)}
        onOpenContacts={handleOpenContacts}
      />

      {openContact && (
        <ContactPopover
          anchorRect={openContact.rect}
          contacts={openContactsData}
          onClose={() => {
            setOpenContact(null);
            setOpenContactsData(null);
          }}
        />
      )}
    </>
  );
};

export default TodaysCollection;
