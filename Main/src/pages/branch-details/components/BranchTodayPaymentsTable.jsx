import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import AddPaymentModal from "pages/loan-details/components/QuickPaymentModal";
import { useBranchTodayPayments } from "hooks/branchDetails/useBranchTodayPayments";
import { useParams, useNavigate } from "react-router-dom";
import ContactPopover from "pages/todays-collection/components/ContactPopover";
import { motion } from "framer-motion";
import { API_BASE_URL } from "api/client";
import { toApiAssetUrl } from "utils/helper";
import { TableCardSkeleton } from "components/ui/Skeleton";
import { queryConfig } from "query/queryConfig";
import { usePrefetchOnHover } from "query/usePrefetchOnHover";
const BranchTodayPaymentsTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [contactsPopup, setContactsPopup] = useState(null);

  const { branchId } = useParams();
  const navigate = useNavigate();
  const { onMouseEnter, onMouseLeave } = usePrefetchOnHover(
    (loanId) => queryConfig.loans.details(loanId),
    140,
  );

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
      avatar: toApiAssetUrl(p.avatar),
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
    return <TableCardSkeleton rows={5} columns={6} />;

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
              {todayPayments.length == 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10">
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="flex flex-col items-center gap-3 text-muted-foreground"
                    >
                      <motion.div
                        initial={{ rotate: -10 }}
                        animate={{ rotate: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <motion.div
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Icon name="CalendarCheck" size={32} />
                        </motion.div>
                      </motion.div>

                      <p className="text-sm font-medium text-foreground">
                        No payments today 🎉
                      </p>

                      <p className="text-xs text-muted-foreground">
                        You're all caught up for today
                      </p>
                    </motion.div>
                  </td>
                </tr>
              ) : (
                todayPayments.map((p) => {
                  const primary = p.contacts[0];

                  return (
                    <tr
                      key={p.id}
                      className="bg-background border border-border shadow-sm hover:bg-muted/20 transition"
                      onMouseEnter={() => onMouseEnter(p.id)}
                      onMouseLeave={onMouseLeave}
                      onFocus={() => onMouseEnter(p.id)}
                      onBlur={onMouseLeave}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Image
                            src={p.avatar}
                            alt={p.clientName}
                            className="w-9 h-9 rounded-full border border-border"
                          />
                          <div>
                            <p className="text-sm font-medium">
                              {p.clientName}
                            </p>
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
                            <Button
                              variant="ghost"
                              size="sm"
                              iconName="Phone"
                            />
                          </a>

                          {p.status !== "paid" && (
                            <Button
                              size="sm"
                              iconName="Wallet"
                              className="bg-gradient-to-r from-primary to-accent text-white"
                              onMouseEnter={() => onMouseEnter(p.id)}
                              onMouseLeave={onMouseLeave}
                              onFocus={() => onMouseEnter(p.id)}
                              onBlur={onMouseLeave}
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
                            onMouseEnter={() => onMouseEnter(p.id)}
                            onMouseLeave={onMouseLeave}
                            onFocus={() => onMouseEnter(p.id)}
                            onBlur={onMouseLeave}
                            onClick={() => navigate(`/loan-details/${p.id}`)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden p-3 space-y-3">
          {todayPayments.length === 0 ? (
            <div className="flex justify-center items-center py-12 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col items-center gap-3 text-muted-foreground max-w-xs"
              >
                <motion.div
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Icon name="CalendarCheck" size={32} />
                  </motion.div>
                </motion.div>

                <p className="text-sm font-medium text-foreground">
                  No payments today 🎉
                </p>

                <p className="text-xs text-muted-foreground">
                  You're all caught up for today
                </p>
              </motion.div>
            </div>
          ) : (
            todayPayments.map((p) => {
              const primary = p.contacts[0];

              return (
                <div
                  key={p.id}
                  className="bg-background border border-border rounded-xl p-3 shadow-sm"
                  onMouseEnter={() => onMouseEnter(p.id)}
                  onMouseLeave={onMouseLeave}
                  onFocus={() => onMouseEnter(p.id)}
                  onBlur={onMouseLeave}
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
                        onMouseEnter={() => onMouseEnter(p.id)}
                        onMouseLeave={onMouseLeave}
                        onFocus={() => onMouseEnter(p.id)}
                        onBlur={onMouseLeave}
                        onClick={() =>
                          navigate(`/loan-details/${p.id}?pay=true`)
                        }
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
                      onMouseEnter={() => onMouseEnter(p.id)}
                      onMouseLeave={onMouseLeave}
                      onFocus={() => onMouseEnter(p.id)}
                      onBlur={onMouseLeave}
                      onClick={() => navigate(`/loan-details/${p.id}`)}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {contactsPopup && (
        <ContactPopover
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
