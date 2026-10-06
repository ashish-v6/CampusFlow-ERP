import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  X,
  CalendarCheck,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { bulkMarkAttendance } from "../services/attendance.service";
import { getDepartments } from "../../departments/services/department.service";
import { Department } from "../../departments/types/department.types";
import { AttendanceStatus } from "../types/attendance.types";
import { getTodayDateString, getInitials } from "../utils/attendanceBadgeStyles";
import api from "../../../api/axios";

interface StudentForMarking {
  id: string;
  studentId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  program: {
    id: string;
    name: string;
    code: string;
    departmentId: string;
  };
}

interface AttendanceMarkingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialDate?: string;
  initialDepartmentId?: string;
}

interface StudentMarkingState {
  status: AttendanceStatus;
  remarks: string;
}

export default function AttendanceMarkingModal({
  isOpen,
  onClose,
  onSuccess,
  initialDate,
  initialDepartmentId,
}: AttendanceMarkingModalProps): React.JSX.Element | null {
  const todayStr = getTodayDateString();

  const [date, setDate] = useState<string>(initialDate || todayStr);
  const [selectedDept, setSelectedDept] = useState<string>(initialDepartmentId || "");
  const [departments, setDepartments] = useState<Department[]>([]);

  // Students list
  const [students, setStudents] = useState<StudentForMarking[]>([]);
  const [loadingStudents, setLoadingStudents] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>("");

  // Marking state mapping: studentId -> { status, remarks }
  const [marks, setMarks] = useState<Record<string, StudentMarkingState>>({});

  // Submission state
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // 1. Load departments
  useEffect(() => {
    if (!isOpen) return;
    getDepartments({ limit: 100 })
      .then((res) => {
        setDepartments(res.departments.filter((d) => d.status === "ACTIVE"));
      })
      .catch((err) => console.error("Failed to load departments:", err));
  }, [isOpen]);

  // 2. Fetch active students to populate the marking table
  useEffect(() => {
    if (!isOpen) return;
    setLoadingStudents(true);
    setServerError(null);

    api
      .get<{ students: StudentForMarking[] }>("/api/students", {
        params: {
          limit: 100,
          status: "ACTIVE",
          departmentId: selectedDept || undefined,
        },
      })
      .then((res) => {
        const studentList: StudentForMarking[] = res.data.students || [];
        const filtered = selectedDept
          ? studentList.filter(
              (s) =>
                s.program?.departmentId === selectedDept ||
                (s.program as { departmentId?: string; department?: { id?: string } })?.department
                  ?.id === selectedDept,
            )
          : studentList;

        setStudents(filtered);

        // Initialize all students to PRESENT by default
        const initialMarks: Record<string, StudentMarkingState> = {};
        filtered.forEach((s) => {
          initialMarks[s.id] = { status: "PRESENT", remarks: "" };
        });
        setMarks(initialMarks);
      })
      .catch((err) => {
        console.error("Failed to load students for attendance marking:", err);
        setServerError("Failed to load students list. Please check connection.");
      })
      .finally(() => {
        setLoadingStudents(false);
      });
  }, [isOpen, selectedDept]);

  // Set individual status
  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
    if (serverError) setServerError(null);
  };

  // Set individual remarks
  const handleRemarksChange = (studentId: string, remarks: string) => {
    setMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  // Mark all present
  const handleMarkAllPresent = () => {
    setMarks((prev) => {
      const updated: Record<string, StudentMarkingState> = {};
      Object.keys(prev).forEach((id) => {
        updated[id] = { ...prev[id], status: "PRESENT" };
      });
      return updated;
    });
  };

  // Mark all absent
  const handleMarkAllAbsent = () => {
    setMarks((prev) => {
      const updated: Record<string, StudentMarkingState> = {};
      Object.keys(prev).forEach((id) => {
        updated[id] = { ...prev[id], status: "ABSENT" };
      });
      return updated;
    });
  };

  // Filtered students according to in-modal search input
  const visibleStudents = useMemo(() => {
    if (!searchFilter.trim()) return students;
    const term = searchFilter.toLowerCase().trim();
    return students.filter(
      (s) =>
        s.studentId.toLowerCase().includes(term) ||
        `${s.user.firstName} ${s.user.lastName}`.toLowerCase().includes(term) ||
        s.program?.name?.toLowerCase().includes(term),
    );
  }, [students, searchFilter]);

  // Counts summary
  const presentCount = Object.values(marks).filter((m) => m.status === "PRESENT").length;
  const absentCount = Object.values(marks).filter((m) => m.status === "ABSENT").length;
  const lateCount = Object.values(marks).filter((m) => m.status === "LATE").length;

  // Submit bulk attendance
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (students.length === 0) {
      toast.error("No students available to mark attendance");
      return;
    }

    if (!date) {
      setServerError("Please select an attendance date");
      return;
    }

    setSubmitting(true);
    setServerError(null);

    const payloadRecords = students.map((s) => ({
      studentId: s.id,
      status: marks[s.id]?.status || "PRESENT",
      remarks: marks[s.id]?.remarks || undefined,
    }));

    try {
      const response = await bulkMarkAttendance({
        date,
        records: payloadRecords,
      });

      toast.success(`Successfully marked attendance for ${response.count} students!`);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error("Bulk attendance submission error:", err);
      if (err instanceof AxiosError && err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Failed to save attendance. Please check input and try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-border/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground tracking-tight">
                Mark Attendance
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Mark student presence and submit records in a single batch.
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

        {/* Modal Controls Bar */}
        <div className="p-4 sm:px-6 bg-muted/20 border-b border-border space-y-3 shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
            {/* Date Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Date *
              </label>
              <input
                type="date"
                max={todayStr}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>

            {/* Department Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Department
              </label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground cursor-pointer"
              >
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Search Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Filter Students
              </label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter by name or ID..."
                  className="w-full pl-8 pr-3 py-1.5 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                />
              </div>
            </div>

            {/* Reset Button */}
            <div>
              <button
                type="button"
                onClick={() => {
                  setDate(todayStr);
                  setSelectedDept("");
                  setSearchFilter("");
                }}
                disabled={date === todayStr && selectedDept === "" && searchFilter === ""}
                className="w-full px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground bg-accent/50 hover:bg-accent border border-border rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Quick Mark Actions & Summary Stats Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleMarkAllPresent}
                className="px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg transition-colors cursor-pointer"
              >
                Mark All Present
              </button>
              <button
                type="button"
                onClick={handleMarkAllAbsent}
                className="px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors cursor-pointer"
              >
                Mark All Absent
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-muted-foreground">
                Total: <strong className="text-foreground">{students.length}</strong>
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                Present: {presentCount}
              </span>
              <span className="text-red-600 dark:text-red-400 font-medium">
                Absent: {absentCount}
              </span>
              {lateCount > 0 && (
                <span className="text-amber-600 dark:text-amber-500 font-medium">
                  Late: {lateCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="m-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-start gap-3 animate-in fade-in shrink-0">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm font-medium">{serverError}</div>
          </div>
        )}

        {/* Modal Body: Student List Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-[300px]">
          {loadingStudents ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-muted-foreground font-medium">
                Loading students for attendance marking...
              </p>
            </div>
          ) : visibleStudents.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm font-medium text-foreground">No students found</p>
              <p className="text-xs text-muted-foreground mt-1">
                {searchFilter
                  ? "Try adjusting your search filter."
                  : "No active students found in the selected department."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {visibleStudents.map((student) => {
                const currentMark = marks[student.id] || { status: "PRESENT", remarks: "" };
                const initials = getInitials(student.user.firstName, student.user.lastName);

                return (
                  <div
                    key={student.id}
                    className="p-3.5 sm:p-4 rounded-xl border border-border bg-card/50 hover:bg-muted/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    {/* Student Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                        {initials}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground">
                          {student.user.firstName} {student.user.lastName}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-mono font-medium">{student.studentId}</span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-primary/70" />
                            {student.program?.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Marking Controls: Present / Absent / Late Pill Toggle */}
                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      <div className="inline-flex rounded-lg border border-border p-1 bg-background/60">
                        {/* PRESENT */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, "PRESENT")}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                            currentMark.status === "PRESENT"
                              ? "bg-emerald-500 text-white shadow-xs"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Present
                        </button>

                        {/* ABSENT */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, "ABSENT")}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                            currentMark.status === "ABSENT"
                              ? "bg-red-500 text-white shadow-xs"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Absent
                        </button>

                        {/* LATE */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, "LATE")}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                            currentMark.status === "LATE"
                              ? "bg-amber-500 text-white shadow-xs"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          Late
                        </button>
                      </div>

                      {/* Optional Remarks input */}
                      <input
                        type="text"
                        placeholder="Remarks..."
                        value={currentMark.remarks}
                        onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                        className="px-2.5 py-1 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-foreground w-28 sm:w-36"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-border flex items-center justify-between gap-3 shrink-0 bg-card">
          <div className="text-xs text-muted-foreground">
            Marking for <strong className="text-foreground">{date}</strong> &bull;{" "}
            {students.length} students
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2.5 bg-accent/60 hover:bg-accent text-foreground text-sm font-medium rounded-xl border border-border transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || students.length === 0}
              className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-xl shadow-sm shadow-primary/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
            >
              {submitting ? "Saving Attendance..." : "Save Attendance"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
