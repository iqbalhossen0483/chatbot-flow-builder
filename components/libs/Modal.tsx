import { X } from "lucide-react";
import React from "react";
import Button from "./Button";

type Props = {
  children: React.ReactNode;
  footer: React.ReactNode;
  open: boolean;
  onClose: () => void;
  title: string;
};

const Modal = ({ children, open, onClose, title, footer }: Props) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* ── Modal Panel ── */}
      <div className="w-full max-w-md rounded-xl bg-white shadow-2xl ">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 pt-2 pb-1">
          <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
          <Button onClick={onClose} variant="text">
            <X size={18} />
          </Button>
        </div>

        {children}

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-neutral-100 px-6 py-4">
          {footer}
        </div>
      </div>
    </div>
  );
};

export default Modal;
