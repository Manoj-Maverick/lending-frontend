import React, { useMemo, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import { useUIContext } from "context/UIContext";

// ---------------- Helpers ----------------
const todayStr = () => new Date().toISOString().split("T")[0];
const addDays = (d, n) => {
  const dt = new Date(d);
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().split("T")[0];
};
const isBetween = (d, start, end) => d >= start && d <= end;
const useOutsideClick = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
};

// ---------- Contact Popover (Portal) ----------
const ContactPopover = ({ anchorRect, contacts, onClose }) => {
  const ref = useRef(null);
  useOutsideClick(ref, onClose);

  if (!anchorRect) return null;

  const style = {
    position: "fixed",
    top: anchorRect.bottom + 8,
    left: anchorRect.left,
    zIndex: 9999,
  };

  const popover = (
    <div
      ref={ref}
      style={style}
      className="w-64 bg-card border border-border rounded-lg shadow-lg p-3"
    >
      <p className="text-sm font-semibold mb-2">Contacts</p>

      {contacts.map((c, i) => (
        <div
          key={i}
          className="flex items-center justify-between py-2 border-b border-border last:border-b-0"
        >
          <div>
            <p className="text-xs text-muted-foreground">{c.label}</p>
            <p className="text-sm font-medium">{c.phone}</p>
          </div>
          <a
            href={`tel:${c.phone}`}
            className="p-2 rounded-md hover:bg-muted transition"
            title="Call"
          >
            <Icon name="Phone" size={16} />
          </a>
        </div>
      ))}
    </div>
  );

  return createPortal(popover, document.body);
};

// ---------------- Page ----------------
const TodaysCollection = () => {
  const navigate = useNavigate();
  const { branches: branchesData } = useUIContext();

  // UI state
  const [range, setRange] = useState("today"); // today | tomorrow | next7 | custom
  const [customDate, setCustomDate] = useState(todayStr());
  const [activeTab, setActiveTab] = useState("all"); // all | paid | pending | overdue
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("all");
  const [isCollecting, setIsCollecting] = useState(null);
  const [openContact, setOpenContact] = useState(null); // { id, rect }
  const [openContactsData, setOpenContactsData] = useState(null);

  // Branch options
  const branchOptions = [
    { value: "all", label: "All Branches" },
    ...(branchesData?.map((b) => ({
      value: b.id,
      label: b.branch_name,
    })) || []),
  ];

  // Mock data (replace with API later)
  const [rows, setRows] = useState([
    {
      id: "SCH-001",
      clientName: "Vikram Singh",
      clientCode: "LN-005",
      avatar: "https://i.pravatar.cc/150?img=12",
      phone: "91234 56783",
      amount: 14340,
      dueDate: "2024-04-10",
      status: "Overdue",
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
      dueDate: "2024-04-08",
      status: "Overdue",
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
      status: "Pending",
      contacts: [
        { label: "Customer", phone: "+919123456780" },
        { label: "Office", phone: "+919700000000" },
      ],
    },
  ]);

  // Date range
  const { startDate, endDate } = useMemo(() => {
    if (range === "today")
      return { startDate: todayStr(), endDate: todayStr() };
    if (range === "tomorrow") {
      const t = addDays(todayStr(), 1);
      return { startDate: t, endDate: t };
    }
    if (range === "next7")
      return { startDate: todayStr(), endDate: addDays(todayStr(), 7) };
    return { startDate: customDate, endDate: customDate };
  }, [range, customDate]);

  // Filter by date + search + branch + tab
  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const inRange = isBetween(r.dueDate, startDate, endDate);
      const q = search.toLowerCase();
      const matchesSearch =
        r.clientName.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.phone.replace(/\s/g, "").includes(q.replace(/\s/g, ""));

      const matchesBranch = branch === "all" || r.branch === branch;

      const matchesTab =
        activeTab === "all" ||
        (activeTab === "paid" && r.status === "Paid") ||
        (activeTab === "pending" && r.status === "Pending") ||
        (activeTab === "overdue" && r.status === "Overdue");

      return inRange && matchesSearch && matchesBranch && matchesTab;
    });
  }, [rows, startDate, endDate, search, branch, activeTab]);

  // KPIs
  const stats = useMemo(() => {
    const target = filtered.reduce((s, r) => s + r.amount, 0);
    const collected = filtered
      .filter((r) => r.status === "Paid")
      .reduce((s, r) => s + r.amount, 0);
    const pending = filtered
      .filter((r) => r.status === "Pending")
      .reduce((s, r) => s + r.amount, 0);
    const overdue = filtered
      .filter((r) => r.status === "Overdue")
      .reduce((s, r) => s + r.amount, 0);

    return { target, collected, pending, overdue };
  }, [filtered]);

  // Actions
  const collect = (row) => {
    setIsCollecting(row.id);
    setTimeout(() => {
      setRows((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, status: "Paid" } : r)),
      );
      setIsCollecting(null);
    }, 700);
  };

  const remind = (row) => {
    alert(`Reminder sent to ${row.clientName}`);
  };

  const viewLoan = (loanId) => {
    navigate(`/loan-details/${loanId}`);
  };

  const badgeClass = (status) => {
    if (status === "Paid") return "bg-success/10 text-success";
    if (status === "Pending") return "bg-warning/10 text-warning";
    if (status === "Overdue") return "bg-error/10 text-error";
    return "bg-muted/10 text-muted-foreground";
  };

  const getStatusBadge = (status) => {
    const map = {
      Paid: "bg-success/10 text-success",
      Pending: "bg-warning/10 text-warning",
      Overdue: "bg-error/10 text-error",
    };
    return map[status] || "bg-muted/10 text-muted-foreground";
  };

  const handleOpenContacts = (e, row) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setOpenContact({ id: row.id, rect });
    setOpenContactsData(row.contacts);
  };

  const closeContacts = () => {
    setOpenContact(null);
    setOpenContactsData(null);
  };

  // ---------------- UI ----------------
  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
            <Icon name="Calendar" size={32} className="text-primary" />
            Today’s Collection
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { title: "Target", value: stats.target, icon: "Target" },
          { title: "Collected", value: stats.collected, icon: "CheckCircle" },
          { title: "Pending", value: stats.pending, icon: "Clock" },
          { title: "Overdue", value: stats.overdue, icon: "AlertTriangle" },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                <Icon name={s.icon} size={20} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.title}</p>
                <p className="text-xl font-bold">₹{s.value.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Range + Filters */}
      <div className="bg-card border border-border rounded-lg p-4 mb-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={range === "today" ? "default" : "outline"}
            onClick={() => setRange("today")}
          >
            Today
          </Button>
          <Button
            variant={range === "tomorrow" ? "default" : "outline"}
            onClick={() => setRange("tomorrow")}
          >
            Tomorrow
          </Button>
          <Button
            variant={range === "next7" ? "default" : "outline"}
            onClick={() => setRange("next7")}
          >
            Next 7 Days
          </Button>
          <input
            type="date"
            value={customDate}
            onChange={(e) => {
              setCustomDate(e.target.value);
              setRange("custom");
            }}
            className="border border-border rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="relative">
              <Icon
                name="Search"
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <Input
                type="text"
                placeholder="Search name, loan, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select
            value={branch}
            onChange={(v) => setBranch(v)}
            options={branchOptions}
          />
          <Button
            variant="default"
            onClick={() => {
              setSearch("");
              setBranch("all");
              setActiveTab("all");
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card border border-border rounded-lg mb-4 overflow-hidden">
        <div className="flex">
          {[
            { id: "all", label: "All" },
            { id: "paid", label: "Paid" },
            { id: "pending", label: "Pending" },
            { id: "overdue", label: "Overdue" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === t.id
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
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
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-muted/40 transition">
                  {/* Client */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={r.avatar}
                        alt={r.clientName}
                        className="w-10 h-10 rounded-full object-cover border shrink-0"
                      />

                      <div className="min-w-0">
                        <p className="font-medium text-foreground leading-tight truncate">
                          {r.clientName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {r.clientCode}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{r.phone}</span>
                      <button
                        onClick={(e) => handleOpenContacts(e, r)}
                        className="p-2 rounded-md hover:bg-muted transition"
                        title="Show contacts"
                      >
                        <Icon name="Phone" size={16} />
                      </button>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-3 font-semibold">
                    ₹{r.amount.toLocaleString()}
                  </td>

                  {/* Due Date */}
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {r.dueDate}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                        r.status,
                      )}`}
                    >
                      {r.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {r.status !== "Paid" && (
                        <Button
                          size="sm"
                          variant="default"
                          iconName="CreditCard"
                        >
                          Collect
                        </Button>
                      )}
                      {r.status === "Overdue" && (
                        <Button
                          size="sm"
                          variant="warning"
                          iconName="AlertTriangle"
                        >
                          Remind
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        iconName="Eye"
                        onClick={() =>
                          navigate(`/loan-details/${r.clientCode}`)
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Portal Popover */}
      {openContact && (
        <ContactPopover
          anchorRect={openContact.rect}
          contacts={openContactsData}
          onClose={closeContacts}
        />
      )}
    </>
  );
};

export default TodaysCollection;
