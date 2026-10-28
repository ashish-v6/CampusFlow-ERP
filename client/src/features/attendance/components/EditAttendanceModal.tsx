import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Pencil,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import { AttendanceRecord, AttendanceStatus } from "../types/attendance.types";
import { updateAttendance, mapAttendanceError } from "../services/attendance.service";
import { formatAttendanceDisplayDate } from "../utils/attendanceDate.utils";

interface EditAttendanceModalProps {
  isOpen: boolean;
  attendance: AttendanceRecord | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditAttendanceModal({
  isOpen,
  attendance,
  onClose,
  onSuccess,
}: EditAttendanceModalProps): React.JSX.Element | null {
  const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus>("PRESENT");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (attendance) {
      setSelectedStatus(attendance.status);
      setServerError(null);
    }
  }, [attendance]);

  if (!isOpen || !attendance) return null;

  const user = attendance.student?.user;
  const fullName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Enrolled Student";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    // Check if status is changed
    if (selectedStatus === attendance.status) {
      onClose();
      return;
    }

    setSubmitting(true);
    setServerError(null);

    try {
      await updateAttendance(attendance.id, { status: selectedStatus });
      toast.success("Attendance record updated successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to update attendance record:", err);
      const msg = mapAttendanceError(err);
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Pencil className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground tracking-tight">
                Correct Attendance
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Update status for this recorded attendance session.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          {serverError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-start gap-2.5 text-xs font-medium animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Student Info Card (Read-only) */}
          <div className="p-3.5 rounded-xl bg-muted/20 border border-border/60 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <User className="w-3.5 h-3.5 text-primary" />
              <span>{fullName}</span>
            </div>
            {user?.email && (
              <p className="text-[11px] text-muted-foreground pl-5.5">{user.email}</p>
            )}
          </div>

          {/* Attendance Date (Read-only Calendar Date) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Attendance Date
            </label>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-background border border-border text-sm font-semibold text-foreground">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{formatAttendanceDisplayDate(attendance.date)}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Calendar date is immutable to preserve daily audit records.
            </p>
          </div>

          {/* Status Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/80">
              Attendance Status <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3 pt-0.5">
              <button
                type="button"
                onClick={() => setSelectedStatus("PRESENT")}
                disabled={submitting}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                  selectedStatus === "PRESENT"
                    ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 shadow-xs"
                    : "bg-background border-border text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                }`}
              >
                <CheckCircle2
                  className={`w-4 h-4 ${
                    selectedStatus === "PRESENT" ? "text-emerald-500" : "opacity-60"
                  }`}
                />
                <span>PRESENT</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStatus("ABSENT")}
                disabled={submitting}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                  selectedStatus === "ABSENT"
                    ? "bg-rose-500/15 border-rose-500/50 text-rose-600 dark:text-rose-400 shadow-xs"
                    : "bg-background border-border text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                }`}
              >
                <XCircle
                  className={`w-4 h-4 ${
                    selectedStatus === "ABSENT" ? "text-rose-500" : "opacity-60"
                  }`}
                />
                <span>ABSENT</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 bg-accent/60 hover:bg-accent text-foreground text-xs sm:text-sm font-medium rounded-xl border border-border transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-semibold rounded-xl shadow-sm shadow-primary/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Update Status</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
