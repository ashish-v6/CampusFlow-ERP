import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Users,
  Calendar,
  CheckCircle2,
  XCircle,
  Search,
  CheckSquare,
  Square,
  Loader2,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { getStudents } from "../../students/services/student.service";
import { Student } from "../../students/types/student.types";
import { AttendanceStatus, BulkAttendanceItem } from "../types/attendance.types";
import { markBulkAttendance, mapAttendanceError } from "../services/attendance.service";
import { validateBulkAttendanceForm } from "../validation/attendance.validation";
import { getTodayInputDate } from "../utils/attendanceDate.utils";

interface BulkMarkAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BulkMarkAttendanceModal({
  isOpen,
  onClose,
  onSuccess,
}: BulkMarkAttendanceModalProps): React.JSX.Element | null {
  const [selectedDateYmd, setSelectedDateYmd] = useState<string>(getTodayInputDate());
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState<boolean>(true);
  const [studentSearch, setStudentSearch] = useState<string>("");

  // Map of studentId -> AttendanceStatus for selected students
  const [selectedRecords, setSelectedRecords] = useState<Map<string, AttendanceStatus>>(
    new Map(),
  );

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Fetch active students on modal open
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const fetchActiveStudents = async () => {
      setLoadingStudents(true);
      setServerError(null);
      try {
        // Fetch students with status ACTIVE
        const res = await getStudents({
          status: "ACTIVE",
          limit: 10,
        });
        if (isMounted) {
          const activeOnly = (res.students || []).filter((s) => s.status === "ACTIVE");
          setStudents(activeOnly);

          // By default, pre-select all active students with PRESENT
          const initialMap = new Map<string, AttendanceStatus>();
          activeOnly.forEach((s) => initialMap.set(s.id, "PRESENT"));
          setSelectedRecords(initialMap);
        }
      } catch (err) {
        console.error("Failed to load active students for bulk marking:", err);
        if (isMounted) {
          setServerError("Unable to load students. Please try again.");
        }
      } finally {
        if (isMounted) setLoadingStudents(false);
      }
    };

    fetchActiveStudents();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Toggle student selection
  const handleToggleStudent = (studentId: string) => {
    setSelectedRecords((prev) => {
      const next = new Map(prev);
      if (next.has(studentId)) {
        next.delete(studentId);
      } else {
        next.set(studentId, "PRESENT");
      }
      return next;
    });
    if (fieldErrors.records) {
      setFieldErrors((prev) => ({ ...prev, records: "" }));
    }
  };

  // Change individual student status
  const handleSetStudentStatus = (
    studentId: string,
    status: AttendanceStatus,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setSelectedRecords((prev) => {
      const next = new Map(prev);
      next.set(studentId, status);
      return next;
    });
  };

  // Bulk actions
  const handleSelectAll = () => {
    const next = new Map<string, AttendanceStatus>();
    filteredStudents.forEach((s) => {
      next.set(s.id, selectedRecords.get(s.id) || "PRESENT");
    });
    setSelectedRecords(next);
  };

  const handleDeselectAll = () => {
    setSelectedRecords(new Map());
  };

  const handleMarkAllStatus = (status: AttendanceStatus) => {
    setSelectedRecords((prev) => {
      const next = new Map(prev);
      for (const studentId of next.keys()) {
        next.set(studentId, status);
      }
      return next;
    });
  };

  // Filter students based on search input
  const filteredStudents = students.filter((s) => {
    if (!studentSearch.trim()) return true;
    const q = studentSearch.toLowerCase().trim();
    const fullName = `${s.user?.firstName || ""} ${s.user?.lastName || ""}`.toLowerCase();
    const studentId = (s.studentId || "").toLowerCase();
    const email = (s.user?.email || "").toLowerCase();
    return fullName.includes(q) || studentId.includes(q) || email.includes(q);
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    // Build payload array from selectedRecords
    const recordsPayload: BulkAttendanceItem[] = [];
    selectedRecords.forEach((status, studentId) => {
      recordsPayload.push({ studentId, status });
    });

    // Client-side validation
    const inactiveIds = new Set(
      students.filter((s) => s.status !== "ACTIVE").map((s) => s.id),
    );
    const validation = validateBulkAttendanceForm(
      selectedDateYmd,
      recordsPayload,
      inactiveIds,
    );

    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    setServerError(null);

    try {
      const res = await markBulkAttendance({
        date: validation.formattedDate!, // Strictly DD-MM-YYYY
        records: recordsPayload,
      });

      toast.success(
        res.message || `Successfully marked attendance for ${recordsPayload.length} students!`,
      );
      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error("Bulk attendance submission error:", err);
      const friendlyMessage = mapAttendanceError(err);
      setServerError(friendlyMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCount = selectedRecords.size;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-border/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground tracking-tight">
                Bulk Mark Attendance
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Record attendance for multiple students simultaneously for a single calendar date.
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden" noValidate>
          {/* Top Controls: Date and Global Error */}
          <div className="p-5 sm:p-6 space-y-4 border-b border-border/60 shrink-0 bg-muted/10">
            {serverError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-start gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-sm font-medium">{serverError}</div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              {/* Date Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="bulkAttendanceDate"
                  className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
                >
                  Attendance Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    id="bulkAttendanceDate"
                    value={selectedDateYmd}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setSelectedDateYmd(e.target.value);
                      if (fieldErrors.date) setFieldErrors((prev) => ({ ...prev, date: "" }));
                      if (serverError) setServerError(null);
                    }}
                    disabled={submitting}
                    className={`w-full bg-background border rounded-xl pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 transition-all [color-scheme:light] dark:[color-scheme:dark] cursor-pointer ${
                      fieldErrors.date
                        ? "border-red-500/80 focus:ring-red-500/40"
                        : "border-border focus:ring-primary/50"
                    }`}
                  />
                </div>
                {fieldErrors.date && (
                  <p className="text-red-500 text-xs font-medium">{fieldErrors.date}</p>
                )}
              </div>

              {/* Quick Batch Status Toggles */}
              <div className="space-y-1.5">
                <span className="block text-xs font-semibold uppercase tracking-wider text-foreground/80">
                  Batch Status Setter
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleMarkAllStatus("PRESENT")}
                    disabled={selectedCount === 0 || submitting}
                    className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Set All Present</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMarkAllStatus("ABSENT")}
                    disabled={selectedCount === 0 || submitting}
                    className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Set All Absent</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Selection & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Filter students in list by name, ID, or email..."
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-xs font-semibold text-primary hover:underline px-2 py-1 cursor-pointer flex items-center gap-1"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Select All</span>
                </button>
                <span className="text-muted-foreground/40">&bull;</span>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground px-2 py-1 cursor-pointer flex items-center gap-1"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Clear Selection</span>
                </button>
              </div>
            </div>

            {fieldErrors.records && (
              <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{fieldErrors.records}</span>
              </p>
            )}
          </div>

          {/* Student List View */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/50 p-2 sm:p-4">
            {loadingStudents ? (
              <div className="py-16 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span>Loading eligible active students...</span>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="py-16 text-center text-sm text-muted-foreground">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="font-semibold text-foreground">No students found</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {studentSearch ? "No students matched your search criteria." : "No active students available."}
                </p>
              </div>
            ) : (
              filteredStudents.map((student) => {
                const isSelected = selectedRecords.has(student.id);
                const currentStatus = selectedRecords.get(student.id) || "PRESENT";

                return (
                  <div
                    key={student.id}
                    onClick={() => handleToggleStudent(student.id)}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                      isSelected ? "bg-accent/40 border border-primary/20" : "hover:bg-muted/40"
                    }`}
                  >
                    {/* Checkbox & Student Details */}
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // handled by parent onClick
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary/40 cursor-pointer"
                      />
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                        {student.user?.firstName?.charAt(0) || "S"}
                        {student.user?.lastName?.charAt(0) || "T"}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-foreground truncate">
                          {student.user?.firstName} {student.user?.lastName}
                        </div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 truncate">
                          <span className="font-mono text-foreground/80">{student.studentId}</span>
                          <span>&bull;</span>
                          <span className="truncate">{student.user?.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Toggle for this Student */}
                    {isSelected ? (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => handleSetStudentStatus(student.id, "PRESENT", e)}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                            currentStatus === "PRESENT"
                              ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40"
                              : "bg-background text-muted-foreground border-border hover:bg-muted/40"
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>PRESENT</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleSetStudentStatus(student.id, "ABSENT", e)}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                            currentStatus === "ABSENT"
                              ? "bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/40"
                              : "bg-background text-muted-foreground border-border hover:bg-muted/40"
                          }`}
                        >
                          <XCircle className="w-3 h-3" />
                          <span>ABSENT</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-muted-foreground/60 italic shrink-0">
                        Not marked
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-5 border-t border-border flex items-center justify-between gap-3 shrink-0 bg-muted/10">
            <div className="text-xs font-medium text-muted-foreground">
              <span className="font-bold text-foreground">{selectedCount}</span> of{" "}
              <span>{students.length}</span> students selected
            </div>

            <div className="flex items-center gap-2">
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
                disabled={submitting || selectedCount === 0}
                className="px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-semibold rounded-xl shadow-sm shadow-primary/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Mark Selected ({selectedCount})</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
