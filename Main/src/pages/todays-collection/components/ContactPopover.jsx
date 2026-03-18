import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "../../../components/AppIcon";

const useOutsideClick = (ref, onClose) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      onClose();
    };

    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, onClose]);
};

const ContactPopover = ({ anchorRect, contacts, onClose }) => {
  const ref = useRef(null);
  useOutsideClick(ref, onClose);

  const isMobile = window.innerWidth < 640;

  /* =========================
     TIMER LOGIC
  ========================= */
  const DURATION = 5; // seconds
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [onClose]);

  // Pause on hover (desktop)
  const pauseTimer = () => clearInterval(timerRef.current);

  const resumeTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (!anchorRect) return null;

  /* =========================
     DESKTOP POSITION FIX
  ========================= */
  const popoverWidth = 260;
  const padding = 12;

  const safeLeft = Math.max(
    padding,
    Math.min(anchorRect.left, window.innerWidth - popoverWidth - padding),
  );

  return createPortal(
    <>
      {/* BACKDROP (mobile) */}
      {isMobile && (
        <div className="fixed inset-0 bg-black/30 z-[9998]" onClick={onClose} />
      )}

      {/* MAIN */}
      <div
        ref={ref}
        onMouseEnter={!isMobile ? pauseTimer : undefined}
        onMouseLeave={!isMobile ? resumeTimer : undefined}
        style={
          isMobile
            ? {
                position: "fixed",
                bottom: 0,
                left: 0,
                width: "100%",
                zIndex: 9999,
              }
            : {
                position: "fixed",
                top: anchorRect.bottom + 8,
                left: safeLeft,
                zIndex: 9999,
              }
        }
        className={`
          bg-card border border-border shadow-lg
          ${
            isMobile
              ? "rounded-t-2xl p-5 animate-slide-up"
              : "rounded-lg p-4 w-64"
          }
        `}
      >
        {/* 🔥 TIMER BAR */}
        <div className="w-full h-1 bg-muted mb-3 rounded overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-1000"
            style={{ width: `${(timeLeft / DURATION) * 100}%` }}
          />
        </div>

        {/* 🔥 Header */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold">Contacts</p>
          <span className="text-xs text-muted-foreground">{timeLeft}s</span>
        </div>

        {/* Drag handle (mobile) */}
        {isMobile && (
          <div className="w-10 h-1.5 bg-muted mx-auto rounded-full mb-4" />
        )}

        {/* Contacts */}
        {(contacts || []).map((contact, index) => (
          <div
            key={`${contact.phone}-${index}`}
            className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
          >
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{contact.label}</p>
              <p className="text-base font-medium truncate">{contact.phone}</p>
            </div>

            <a
              href={`tel:${contact.phone}`}
              className="p-3 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0"
            >
              <Icon name="Phone" size={18} />
            </a>
          </div>
        ))}
      </div>
    </>,
    document.body,
  );
};

export default ContactPopover;
