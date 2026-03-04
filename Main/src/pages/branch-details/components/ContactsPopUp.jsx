import React, { useState, useRef, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import { createPortal } from "react-dom";
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
export default ContactsPopup;
