import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Eye,
  Calendar,
  Clock,
  User,
  GraduationCap,
  Loader2,
  AlertCircle,
  Pencil,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { AttendanceRecord } from "../types/attendance.types";
import { getAttendanceById, mapAttendanceError } from "../services/attendance.service";
import {
  formatAttendanceDisplayDate,
  formatDisplayDateTime,
} from "../utils/attendanceDate.utils";
import { getAttendanceStatusStyles } from "../utils/attendanceBadgeStyles";

interface ViewAttendanceModalProps {
  isOpen: boolean;
  attendanceId: string | null;
  onClose: () => void;
  onEdit?: (record: AttendanceRecord) => void;
  canEdit?: boolean;
}

export default function ViewAttendanceModal({
  isOpen,
  attendanceId,
  onClose,
  onEdit,
  canEdit = false,
}: ViewAttendanceModalProps): React.JSX.Element | null {
  const [record, setRecord] = useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !attendanceId) return;

    let isMounted = true;
    const fetchRecord = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAttendanceById(attendanceId);
        if (isMounted) setRecord(data);
      } catch (err) {
        console.error("Failed to fetch attendance record by ID:", err);
        const msg = mapAttendanceError(err);
        if (isMounted) setError(msg);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRecord();
    return () => {
      isMounted = false;
    };
  }, [isOpen, attendanceId]);

  if (!isOpen) return null;

  const user = record?.student?.user;
  const fullName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Enrolled Student";
  const statusStyle = record ? getAttendanceStatusStyles(record.status) : null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground tracking-tight">
                Attendance Details
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Session verification and audit information.
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

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-muted-foreground gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs">Loading record details...</span>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-start gap-2.5 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          ) : record ? (
            <div className="space-y-4">
              {/* Student Overview */}
              <div className="p-4 rounded-xl bg-muted/20 border border-border/60 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
                  {user?.firstName?.charAt(0) || "S"}
                  {user?.lastName?.charAt(0) || "T"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm text-foreground truncate">
                    {fullName}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                    {user?.email && <span className="truncate">{user.email}</span>}
                  </div>
                </div>
              </div>

              {/* Grid: Date & Status */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span>Calendar Date</span>
                  </span>
                  <div className="text-sm font-bold text-foreground">
                    {formatAttendanceDisplayDate(record.date)}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </span>
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyle?.badge}`}
                    >
                      {record.status === "PRESENT" ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      <span>{record.status}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="p-3.5 rounded-xl border border-border/60 bg-muted/10 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 opacity-60" />
                    <span>Recorded On:</span>
                  </span>
                  <span className="font-medium text-foreground">
                    {formatDisplayDateTime(record.createdAt)}
                  </span>
                </div>
                {record.updatedAt && record.updatedAt !== record.createdAt && (
                  <div className="flex items-center justify-between border-t border-border/40 pt-2">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 opacity-60" />
                      <span>Last Corrected:</span>
                    </span>
                    <span className="font-medium text-foreground">
                      {formatDisplayDateTime(record.updatedAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              {canEdit && record && onEdit && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEdit(record);
                  }}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-accent hover:bg-accent/80 text-foreground border border-border transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Pencil className="w-3.5 h-3.5 text-primary" />
                  <span>Correct Status</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
