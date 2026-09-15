import React from "react";
import { createPortal } from "react-dom";
import { X, Edit3 } from "lucide-react";
import UpdateFacultyForm from "./UpdateFacultyForm";
import { Faculty } from "../types/faculty.types";

interface UpdateFacultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  faculty: Faculty;
}

/**
 * Modal dialog wrapping UpdateFacultyForm.
 * Uses createPortal to attach directly to document.body and applies full-screen glass backdrop blur.
 */
export default function UpdateFacultyModal({
  isOpen,
  onClose,
  onSuccess,
  faculty,
}: UpdateFacultyModalProps): React.JSX.Element | null {
  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto">
        {/* Modal Header */}
        <div className="p-6 border-b border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground tracking-tight">Edit Faculty Details</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Update departmental affiliation, designation, and employment records.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          <UpdateFacultyForm
            faculty={faculty}
            onSuccess={() => {
              onSuccess();
              onClose();
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
