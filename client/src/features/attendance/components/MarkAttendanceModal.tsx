import React from "react";
import { createPortal } from "react-dom";
import { X, CalendarCheck } from "lucide-react";
import MarkAttendanceForm from "./MarkAttendanceForm";
import { AttendanceRecord } from "../types/attendance.types";

interface MarkAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  existingAttendances?: AttendanceRecord[];
}

/**
 * Modal dialog wrapping MarkAttendanceForm.
 * Uses createPortal to attach to document.body, avoiding stacking context conflicts,
 * and renders a glass backdrop blur matching CreateStudentModal.
 */
export default function MarkAttendanceModal({
  isOpen,
  onClose,
  onSuccess,
  existingAttendances = [],
}: MarkAttendanceModalProps): React.JSX.Element | null {
  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto">
        {/* Modal Header */}
        <div className="p-6 border-b border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground tracking-tight">
                Mark Student Attendance
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Record daily attendance status for an active student.
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
          <MarkAttendanceForm
            onSuccess={() => {
              onSuccess();
              onClose();
            }}
            onCancel={onClose}
            existingAttendances={existingAttendances}
          />
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
