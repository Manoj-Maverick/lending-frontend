import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Icon from "../../../components/AppIcon";

const useOutsideClick = (ref, onClose) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      onClose();
    };

    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, onClose]);
};

const ContactPopover = ({ anchorRect, contacts, onClose }) => {
  const ref = useRef(null);
  useOutsideClick(ref, onClose);

  if (!anchorRect) {
    return null;
  }

  return createPortal(
    <div
      ref={ref}
      style={{
        position: "fixed",
        top: anchorRect.bottom + 8,
        left: anchorRect.left,
        zIndex: 9999,
      }}
      className="w-64 bg-card border border-border rounded-lg shadow-lg p-3"
    >
      <p className="text-sm font-semibold mb-2">Contacts</p>
      {(contacts || []).map((contact, index) => (
        <div
          key={`${contact.phone}-${index}`}
          className="flex items-center justify-between py-2 border-b border-border last:border-b-0"
        >
          <div>
            <p className="text-xs text-muted-foreground">{contact.label}</p>
            <p className="text-sm font-medium">{contact.phone}</p>
          </div>
          <a
            href={`tel:${contact.phone}`}
            className="p-2 rounded-md hover:bg-muted transition"
            title="Call"
          >
            <Icon name="Phone" size={16} />
          </a>
        </div>
      ))}
    </div>,
    document.body,
  );
};

export default ContactPopover;
