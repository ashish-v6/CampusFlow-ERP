import React, { useState, useEffect, FormEvent } from "react";
import { createPortal } from "react-dom";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { X, Edit3, Calendar, User, Building2, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { AttendanceRecord, AttendanceStatus, UpdateAttendanceDto } from "../types/attendance.types";
import { updateAttendance } from "../services/attendance.service";
import { formatDisplayDate } from "../utils/attendanceBadgeStyles";

interface EditAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  record: AttendanceRecord | null;
}

export default function EditAttendanceModal({
  isOpen,
  onClose,
  onSuccess,
  record,
}: EditAttendanceModalProps): React.JSX.Element | null {
  const [status, setStatus] = useState<AttendanceStatus>("PRESENT");
  const [remarks, setRemarks] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (record) {
      setStatus(record.status);
      setRemarks(record.remarks || "");
      setDate(record.date ? record.date.slice(0, 10) : "");
      setServerError(null);
    }
  }, [record]);

  if (!isOpen || !record) {
    return null;
  }

  const studentFullName =
    `${record.student?.user?.firstName || ""} ${record.student?.user?.lastName || ""}`.trim() ||
    "Student";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setServerError(null);

    const payload: UpdateAttendanceDto = {
      status,
      remarks: remarks.trim() ? remarks.trim() : undefined,
    };

    if (date) {
      payload.date = date;
    }

    try {
      await updateAttendance(record.id, payload);
      toast.success("Attendance record updated successfully!");
      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error("Update attendance error:", err);
      if (err instanceof AxiosError && err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Failed to update attendance record. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="p-6 border-b border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground tracking-tight">
                Edit Attendance Record
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Update status, date, or remarks for this attendance record.
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5" noValidate>
          {serverError && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm font-medium">{serverError}</div>
            </div>
          )}

          {/* Student Info Card */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border/70 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                <span className="font-semibold text-foreground text-sm">{studentFullName}</span>
              </div>
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 shadow-xs">
                {record.student?.studentId || "—"}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>{record.student?.program?.name || "Program"}</span>
              </div>
              <div>•</div>
              <div>{record.student?.user?.email}</div>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
              Attendance Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-foreground"
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Originally recorded for {formatDisplayDate(record.date)}
            </p>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              Attendance Status
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {/* PRESENT */}
              <button
                type="button"
                onClick={() => setStatus("PRESENT")}
                className={`py-3 px-3 rounded-xl border text-sm font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  status === "PRESENT"
                    ? "bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "border-border bg-background hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Present</span>
              </button>

              {/* ABSENT */}
              <button
                type="button"
                onClick={() => setStatus("ABSENT")}
                className={`py-3 px-3 rounded-xl border text-sm font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  status === "ABSENT"
                    ? "bg-red-500/15 border-red-500 text-red-600 dark:text-red-400 shadow-sm"
                    : "border-border bg-background hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <AlertCircle className="w-5 h-5" />
                <span>Absent</span>
              </button>

              {/* LATE */}
              <button
                type="button"
                onClick={() => setStatus("LATE")}
                className={`py-3 px-3 rounded-xl border text-sm font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  status === "LATE"
                    ? "bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 shadow-sm"
                    : "border-border bg-background hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <Clock className="w-5 h-5" />
                <span>Late</span>
              </button>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
              Remarks (Optional)
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Medical leave, Late bus, Excused"
              maxLength={200}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-foreground"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-border flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer flex items-center gap-2 shadow-sm"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
