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

const todayStr = () => new Date().toISOString().split("T")[0];

const addDays = (date, days) => {
  const dateValue = new Date(date);
  dateValue.setDate(dateValue.getDate() + days);
  return dateValue.toISOString().split("T")[0];
};

const isBetween = (date, start, end) => date >= start && date <= end;

const TodaysCollection = () => {
  const navigate = useNavigate();
  const { branches: branchesData } = useUIContext();

  const [range, setRange] = useState("today");
  const [customDate, setCustomDate] = useState(todayStr());
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("all");
  const [isCollecting, setIsCollecting] = useState(null);
  const [openContact, setOpenContact] = useState(null);
  const [openContactsData, setOpenContactsData] = useState(null);

  const branchOptions = [
    { value: "all", label: "All Branches" },
    ...(branchesData?.map((item) => ({
      value: String(item.id),
      label: item.branch_name,
    })) || []),
  ];

  const [rows, setRows] = useState([
    {
      id: "SCH-001",
      clientName: "Vikram Singh",
      clientCode: "LN-005",
      avatar: "https://i.pravatar.cc/150?img=12",
      phone: "91234 56783",
      amount: 14340,
      dueDate: "2026-02-20",
      status: "Overdue",
      branch: "1",
      contacts: [
        { label: "Customer", phone: "+919123456783" },
        { label: "Guarantor", phone: "+919888777666" },
        { label: "Office", phone: "+919777666555" },
      ],
    },
    {
      id: "SCH-002",
      clientName: "Anita Desai",
      clientCode: "LN-006",
      avatar: "https://i.pravatar.cc/150?img=32",
      phone: "91234 56784",
      amount: 18080,
      dueDate: "2026-02-20",
      status: "Pending",
      branch: "2",
      contacts: [
        { label: "Customer", phone: "+919123456784" },
        { label: "Guarantor", phone: "+919888777111" },
      ],
    },
    {
      id: "SCH-003",
      clientName: "Priya Sharma",
      clientCode: "LN-002",
      avatar: "https://i.pravatar.cc/150?img=47",
      phone: "91234 56780",
      amount: 8900,
      dueDate: "2026-02-19",
      status: "Paid",
      branch: "1",
      contacts: [
        { label: "Customer", phone: "+919123456780" },
        { label: "Office", phone: "+919700000000" },
      ],
    },
  ]);

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

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const inRange = isBetween(row.dueDate, startDate, endDate);
      const query = search.toLowerCase().trim();
      const matchesSearch =
        row.clientName.toLowerCase().includes(query) ||
        row.id.toLowerCase().includes(query) ||
        row.phone.replace(/\s/g, "").includes(query.replace(/\s/g, ""));

      const matchesBranch = branch === "all" || row.branch === branch;

      const matchesTab =
        activeTab === "all" ||
        (activeTab === "paid" && row.status === "Paid") ||
        (activeTab === "pending" && row.status === "Pending") ||
        (activeTab === "overdue" && row.status === "Overdue");

      return inRange && matchesSearch && matchesBranch && matchesTab;
    });
  }, [rows, startDate, endDate, search, branch, activeTab]);

  const stats = useMemo(() => {
    const target = filteredRows.reduce((sum, row) => sum + row.amount, 0);
    const collected = filteredRows
      .filter((row) => row.status === "Paid")
      .reduce((sum, row) => sum + row.amount, 0);
    const pending = filteredRows
      .filter((row) => row.status === "Pending")
      .reduce((sum, row) => sum + row.amount, 0);
    const overdue = filteredRows
      .filter((row) => row.status === "Overdue")
      .reduce((sum, row) => sum + row.amount, 0);

    return [
      { title: "Target", value: target, icon: "Target" },
      { title: "Collected", value: collected, icon: "CheckCircle" },
      { title: "Pending", value: pending, icon: "Clock" },
      { title: "Overdue", value: overdue, icon: "AlertTriangle" },
    ];
  }, [filteredRows]);

  const handleCollect = (row) => {
    setIsCollecting(row.id);
    setTimeout(() => {
      setRows((prevRows) =>
        prevRows.map((item) =>
          item.id === row.id ? { ...item, status: "Paid" } : item,
        ),
      );
      setIsCollecting(null);
    }, 700);
  };

  const handleRemind = (row) => {
    alert(`Reminder sent to ${row.clientName}`);
  };

  const handleOpenContacts = (event, row) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setOpenContact({ id: row.id, rect });
    setOpenContactsData(row.contacts);
  };

  const handleReset = () => {
    setSearch("");
    setBranch("all");
    setActiveTab("all");
  };

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
        onCollect={handleCollect}
        onRemind={handleRemind}
        onViewLoan={(loanId) => navigate(`/loan-details/${loanId}`)}
        onOpenContacts={handleOpenContacts}
        isCollecting={isCollecting}
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
