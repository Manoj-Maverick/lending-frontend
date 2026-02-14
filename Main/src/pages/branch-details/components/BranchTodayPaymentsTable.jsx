import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import AddPaymentModal from "pages/loan-details/components/QuickPaymentModal";

/* ---------- Contacts Popup (Portal) ---------- */
const ContactsPopup = ({ anchorRect, contacts, onClose }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!anchorRect) return null;

  const style = {
    position: "fixed",
    top: Math.min(anchorRect.bottom + 8, window.innerHeight - 260),
    left: Math.min(anchorRect.left, window.innerWidth - 280),
    zIndex: 9999,
  };

  return createPortal(
    <div
      ref={popupRef}
      style={style}
      className="bg-card border border-border rounded-lg shadow-lg p-2 w-64"
    >
      <p className="text-xs font-semibold text-muted-foreground px-2 py-1">
        Contacts
      </p>
      {contacts.map((c, i) => (
        <a
          key={i}
          href={`tel:${c.phone}`}
          onClick={onClose}
          className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-muted/50 transition"
        >
          <div>
            <p className="text-xs font-medium text-foreground">{c.label}</p>
            <p className="text-xs text-muted-foreground">{c.phone}</p>
          </div>
          <Icon name="Phone" size={14} className="text-primary" />
        </a>
      ))}
    </div>,
    document.body,
  );
};

/* ---------- Main Component ---------- */
const BranchTodayPaymentsTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [contactsPopup, setContactsPopup] = useState(null); // { rect, contacts }

  const todayPayments = [
    {
      id: "LN-2024-001",
      clientName: "Sarah Johnson",
      clientCode: "CLI-1024",
      avatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_1456eb2f9-1763294356174.png",
      loanCode: "LN-2024-001",
      dueAmount: 2500,
      status: "pending",
      contacts: [
        { label: "Customer", phone: "+919876543210", primary: true },
        { label: "Guarantor", phone: "+918888777666" },
        { label: "Office", phone: "+917777666555" },
      ],
    },
    {
      id: "LN-2024-002",
      clientName: "Michael Chen",
      clientCode: "CLI-1025",
      avatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_1a75f5670-1763292878816.png",
      loanCode: "LN-2024-002",
      dueAmount: 1800,
      status: "paid",
      contacts: [
        { label: "Customer", phone: "+918888777666", primary: true },
        { label: "Guarantor", phone: "+919999888777" },
      ],
    },
    {
      id: "LN-2024-003",
      clientName: "Emily Rodriguez",
      clientCode: "CLI-1026",
      avatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_13817b13e-1763295856027.png",
      loanCode: "LN-2024-003",
      dueAmount: 3200,
      status: "overdue",
      contacts: [
        { label: "Customer", phone: "+917777666555", primary: true },
        { label: "Guarantor", phone: "+916666555444" },
      ],
    },
  ];

  const openCollectModal = (payment) => {
    const primary =
      payment.contacts.find((c) => c.primary) || payment.contacts[0];

    setSelectedLoan({
      id: payment.loanCode,
      clientName: payment.clientName,
      clientCode: payment.clientCode,
      phone: primary?.phone,
      contacts: payment.contacts,
    });
    setIsModalOpen(true);
  };

  const getStatusBadge = (status) => {
    const map = {
      paid: "bg-emerald-100 text-emerald-700",
      pending: "bg-orange-100 text-orange-700",
      overdue: "bg-red-100 text-red-700",
    };
    return (
      <span
        className={`px-2 py-1 rounded-md text-xs font-medium ${map[status]}`}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <>
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-5">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            Today's Collections
          </h2>
          <p className="text-sm text-muted-foreground">
            {todayPayments.length} payments scheduled today
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Client
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Loan
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
                  Due
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {todayPayments.map((p, index) => {
                const primary =
                  p.contacts.find((c) => c.primary) || p.contacts[0];

                return (
                  <tr
                    key={p.id}
                    className={`border-b border-border hover:bg-muted/20 transition ${
                      index === todayPayments.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    {/* Client */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden">
                          <Image
                            src={p.avatar}
                            alt={p.clientName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {p.clientName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {p.clientCode}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${primary?.phone}`}
                          className="inline-flex items-center gap-2 text-primary hover:underline"
                        >
                          <Icon name="Phone" size={14} />
                          {primary?.phone}
                        </a>

                        {p.contacts.length > 1 && (
                          <button
                            onClick={(e) => {
                              const rect =
                                e.currentTarget.getBoundingClientRect();
                              setContactsPopup({
                                rect,
                                contacts: p.contacts,
                              });
                            }}
                            className="text-muted-foreground hover:text-foreground"
                            title="View all contacts"
                          >
                            <Icon name="Users" size={16} />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Loan */}
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {p.loanCode}
                    </td>

                    {/* Due */}
                    <td className="px-4 py-3 text-right text-sm font-semibold">
                      ₹{p.dueAmount.toLocaleString("en-IN")}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 text-center">
                      {getStatusBadge(p.status)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {/* Quick Call */}
                        <a href={`tel:${primary?.phone}`}>
                          <Button variant="ghost" size="sm" iconName="Phone" />
                        </a>

                        {/* Collect */}
                        {p.status !== "paid" && (
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-primary to-accent text-white"
                            iconName="Wallet"
                            onClick={() => openCollectModal(p)}
                          >
                            Collect
                          </Button>
                        )}

                        {/* View */}
                        <Button variant="ghost" size="sm" iconName="Eye" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contacts Popup (Portal) */}
      {contactsPopup && (
        <ContactsPopup
          anchorRect={contactsPopup.rect}
          contacts={contactsPopup.contacts}
          onClose={() => setContactsPopup(null)}
        />
      )}

      {/* Add Payment Modal */}
      <AddPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        loanData={selectedLoan}
      />
    </>
  );
};

export default BranchTodayPaymentsTable;
