import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import AddPaymentModal from "pages/loan-details/components/QuickPaymentModal";
import { useBranchTodayPayments } from "hooks/branchDetails/useBranchTodayPayments";
import { useParams, useNavigate } from "react-router-dom";

const ContactsPopup = ({ anchorRect, contacts, onClose }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) onClose();
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

const BranchTodayPaymentsTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [contactsPopup, setContactsPopup] = useState(null);

  const { branchId } = useParams();
  const navigate = useNavigate();

  const {
    data: rawPayments = [],
    isLoading,
    isError,
  } = useBranchTodayPayments(branchId);

  const todayPayments =
    rawPayments?.data?.map((p) => ({
      id: p.loan_id,
      schedule_id: p.schedule_id,
      clientName: p.client_name,
      clientCode: p.client_code,
      avatar: p.avatar || "https://i.pravatar.cc/150?img=10",
      loanCode: p.loan_code,
      dueAmount: Number(p.due_amount),
      status: (p.status || "pending").toLowerCase(),
      contacts: [{ label: "Customer", phone: p.phone, primary: true }],
    })) || [];

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
      paid: "bg-emerald-500/10 text-emerald-600",
      pending: "bg-amber-500/10 text-amber-600",
      overdue: "bg-red-500/10 text-red-600",
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${map[status]}`}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  if (isLoading)
    return (
      <div className="p-6 text-center text-muted-foreground">
        Loading today's collections...
      </div>
    );

  if (isError)
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load today's collections
      </div>
    );

  return (
    <>
      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-5">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            Today's Collections
          </h2>
          <p className="text-sm text-muted-foreground">
            {todayPayments.length} payments scheduled today
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto px-2 pb-2">
          <table className="w-full min-w-[760px] border-separate border-spacing-y-2">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Borrower
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Loan
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">
                  Due
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {todayPayments.map((p) => {
                const primary = p.contacts[0];

                return (
                  <tr
                    key={p.id}
                    className="bg-background border border-border shadow-sm hover:bg-muted/20 transition"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Image
                          src={p.avatar}
                          alt={p.clientName}
                          className="w-9 h-9 rounded-full border border-border"
                        />
                        <div>
                          <p className="text-sm font-medium">{p.clientName}</p>
                          <p className="text-xs text-muted-foreground">
                            {p.clientCode}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <a
                        href={`tel:${primary.phone}`}
                        className="flex items-center gap-2 text-primary"
                      >
                        <Icon name="Phone" size={14} />
                        {primary.phone}
                      </a>
                    </td>

                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {p.loanCode}
                    </td>

                    <td className="px-4 py-3 text-right font-semibold">
                      ₹ {p.dueAmount.toLocaleString("en-IN")}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {getStatusBadge(p.status)}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-center">
                        <a href={`tel:${primary.phone}`}>
                          <Button variant="ghost" size="sm" iconName="Phone" />
                        </a>

                        {p.status !== "paid" && (
                          <Button
                            size="sm"
                            iconName="Wallet"
                            className="bg-gradient-to-r from-primary to-accent text-white"
                            onClick={() =>
                              navigate(`/loan-details/${p.id}?pay=true`)
                            }
                          >
                            Collect
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          iconName="Eye"
                          onClick={() => navigate(`/loan-details/${p.id}`)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden p-3 space-y-3">
          {todayPayments.map((p) => {
            const primary = p.contacts[0];

            return (
              <div
                key={p.id}
                className="bg-background border border-border rounded-xl p-3 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <Image
                    src={p.avatar}
                    alt={p.clientName}
                    className="w-10 h-10 rounded-full border border-border"
                  />

                  <div className="flex-1">
                    <p className="font-semibold text-foreground">
                      {p.clientName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {p.clientCode}
                    </p>
                  </div>

                  {getStatusBadge(p.status)}
                </div>

                <div className="mt-2 text-sm text-muted-foreground">
                  {p.loanCode}
                </div>
                <div className="text-sm font-semibold">
                  ₹ {p.dueAmount.toLocaleString("en-IN")}
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <a
                    href={`tel:${primary.phone}`}
                    className="flex items-center gap-1 text-primary"
                  >
                    <Icon name="Phone" size={14} />
                    {primary.phone}
                  </a>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  <a href={`tel:${primary.phone}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Phone"
                      fullWidth
                    />
                  </a>

                  {p.status !== "paid" ? (
                    <Button
                      size="sm"
                      iconName="Wallet"
                      className="bg-gradient-to-r from-primary to-accent text-white"
                      fullWidth
                      onClick={() => navigate(`/loan-details/${p.id}?pay=true`)}
                    >
                      Collect
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" disabled fullWidth>
                      Paid
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Eye"
                    fullWidth
                    onClick={() => navigate(`/loan-details/${p.id}`)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {contactsPopup && (
        <ContactsPopup
          anchorRect={contactsPopup.rect}
          contacts={contactsPopup.contacts}
          onClose={() => setContactsPopup(null)}
        />
      )}

      <AddPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        loanData={selectedLoan}
      />
    </>
  );
};

export default BranchTodayPaymentsTable;
