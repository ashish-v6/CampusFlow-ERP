import React, { useState, useEffect, FormEvent, ChangeEvent, useRef } from "react";
import toast from "react-hot-toast";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  XCircle,
  Search,
  User,
  GraduationCap,
  Loader2,
  X,
} from "lucide-react";
import { getStudents } from "../../students/services/student.service";
import { Student } from "../../students/types/student.types";
import { AttendanceRecord, AttendanceStatus } from "../types/attendance.types";
import { createAttendance, mapAttendanceError } from "../services/attendance.service";
import { validateMarkAttendanceForm } from "../validation/attendance.validation";
import { getTodayInputDate } from "../utils/attendanceDate.utils";

interface MarkAttendanceFormProps {
  onSuccess: (newRecord?: AttendanceRecord) => void;
  onCancel?: () => void;
  existingAttendances?: AttendanceRecord[];
}

export default function MarkAttendanceForm({
  onSuccess,
  onCancel,
  existingAttendances = [],
}: MarkAttendanceFormProps): React.JSX.Element {
  // Form State
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedDateYmd, setSelectedDateYmd] = useState<string>(getTodayInputDate());
  const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus>("PRESENT");

  // Student Search / Selection State
  const [studentSearchQuery, setStudentSearchQuery] = useState<string>("");
  const [debouncedStudentSearch, setDebouncedStudentSearch] = useState<string>("");
  const [studentOptions, setStudentOptions] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState<boolean>(true);
  const [studentLoadError, setStudentLoadError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Form Submission & Validation State
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Debounce student search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedStudentSearch(studentSearchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [studentSearchQuery]);

  // 2. Fetch active students from the backend Student API
  useEffect(() => {
    let isMounted = true;
    const fetchActiveStudents = async () => {
      setLoadingStudents(true);
      setStudentLoadError(null);

      try {
        const response = await getStudents({
          status: "ACTIVE",
          limit: 10,
          search: debouncedStudentSearch.trim() || undefined,
        });

        if (isMounted) {
          // Strictly filter out any inactive student as safety guard
          const activeOnly = (response.students || []).filter(
            (s) => s.status === "ACTIVE",
          );
          setStudentOptions(activeOnly);
        }
      } catch (err) {
        console.error("Failed to load active students for attendance:", err);
        if (isMounted) {
          setStudentLoadError(
            "Unable to load students. Please check your connection and retry.",
          );
        }
      } finally {
        if (isMounted) setLoadingStudents(false);
      }
    };

    fetchActiveStudents();
    return () => {
      isMounted = false;
    };
  }, [debouncedStudentSearch]);

  // 3. Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle student selection
  const handleSelectStudent = (student: Student) => {
    if (student.status !== "ACTIVE") {
      setFieldErrors((prev) => ({
        ...prev,
        studentId: "Cannot select an inactive student",
      }));
      return;
    }

    setSelectedStudent(student);
    setIsDropdownOpen(false);
    setStudentSearchQuery("");

    // Clear student error
    if (fieldErrors.studentId) {
      setFieldErrors((prev) => ({ ...prev, studentId: "" }));
    }
    if (serverError) {
      setServerError(null);
    }
  };

  // Clear selected student
  const handleClearSelectedStudent = () => {
    setSelectedStudent(null);
    setStudentSearchQuery("");
  };

  // Handle Date Change
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedDateYmd(value);

    if (fieldErrors.date) {
      setFieldErrors((prev) => ({ ...prev, date: "" }));
    }
    if (serverError) {
      setServerError(null);
    }
  };

  // Handle Status Change
  const handleStatusChange = (status: AttendanceStatus) => {
    setSelectedStatus(status);
    if (fieldErrors.status) {
      setFieldErrors((prev) => ({ ...prev, status: "" }));
    }
    if (serverError) {
      setServerError(null);
    }
  };

  // Form Submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Prevent double submission if already in flight
    if (submitting) return;

    // 1. Client-side validation
    const validation = validateMarkAttendanceForm(
      {
        studentId: selectedStudent?.id || "",
        studentStatus: selectedStudent?.status,
        date: selectedDateYmd,
        status: selectedStatus,
      },
      existingAttendances,
    );

    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    setServerError(null);

    try {
      const response = await createAttendance({
        studentId: selectedStudent!.id,
        date: validation.formattedDate!, // Strictly DD-MM-YYYY
        status: selectedStatus,
      });

      toast.success("Attendance marked successfully!");

      // Reset form fields
      setSelectedStudent(null);
      setSelectedDateYmd(getTodayInputDate());
      setSelectedStatus("PRESENT");
      setFieldErrors({});

      onSuccess(response.result);
    } catch (err: unknown) {
      console.error("Mark attendance submission error:", err);
      const friendlyMessage = mapAttendanceError(err);
      setServerError(friendlyMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Backend / Global Error Banner */}
      {serverError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-start gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm font-medium">{serverError}</div>
        </div>
      )}

      {/* 1. STUDENT SELECTOR */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/80">
          Student <span className="text-red-500">*</span>
        </label>

        {/* Selected Student Display Badge */}
        {selectedStudent ? (
          <div className="flex items-center justify-between p-3.5 bg-accent/40 border border-primary/30 rounded-xl">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                {selectedStudent.user?.firstName?.charAt(0) || "S"}
                {selectedStudent.user?.lastName?.charAt(0) || "T"}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm text-foreground truncate">
                  {selectedStudent.user?.firstName} {selectedStudent.user?.lastName}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-foreground/80">
                    {selectedStudent.studentId}
                  </span>
                  <span>&bull;</span>
                  <span className="truncate">{selectedStudent.user?.email}</span>
                  {selectedStudent.program?.code && (
                    <>
                      <span>&bull;</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                        {selectedStudent.program.code}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClearSelectedStudent}
              disabled={submitting}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
              title="Change student"
              aria-label="Change student"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Searchable Student Dropdown */
          <div className="relative" ref={dropdownRef}>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={studentSearchQuery}
                onChange={(e) => {
                  setStudentSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="Search active students by name, ID, or email..."
                className={`w-full bg-background border rounded-xl pl-10 pr-10 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 transition-all ${
                  fieldErrors.studentId
                    ? "border-red-500/80 focus:ring-red-500/40"
                    : "border-border focus:ring-primary/50"
                }`}
              />
              {loadingStudents && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                </div>
              )}
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute z-50 left-0 right-0 mt-1.5 bg-card border border-border rounded-xl shadow-xl max-h-60 overflow-y-auto divide-y divide-border/50 animate-in fade-in zoom-in-95 duration-150">
                {studentLoadError ? (
                  <div className="p-4 text-xs text-red-500 text-center flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{studentLoadError}</span>
                  </div>
                ) : loadingStudents && studentOptions.length === 0 ? (
                  <div className="p-4 text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span>Loading active students...</span>
                  </div>
                ) : studentOptions.length === 0 ? (
                  <div className="p-5 text-center text-xs text-muted-foreground">
                    <User className="w-6 h-6 mx-auto mb-1 text-muted-foreground/60" />
                    <p className="font-medium text-foreground">No active students found</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {studentSearchQuery
                        ? "Try searching with a different name or student ID."
                        : "No students are currently active in the directory."}
                    </p>
                  </div>
                ) : (
                  studentOptions.map((student) => (
                    <button
                      key={student.id}
                      type="button"
                      onClick={() => handleSelectStudent(student)}
                      className="w-full text-left p-3 hover:bg-muted/40 transition-colors flex items-center justify-between gap-3 group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                          {student.user?.firstName?.charAt(0) || "S"}
                          {student.user?.lastName?.charAt(0) || "T"}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors truncate">
                            {student.user?.firstName} {student.user?.lastName}
                          </div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 truncate">
                            <span className="font-mono text-foreground/70">
                              {student.studentId}
                            </span>
                            <span>&bull;</span>
                            <span className="truncate">{student.user?.email}</span>
                          </div>
                        </div>
                      </div>
                      {student.program?.code && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border shrink-0">
                          {student.program.code}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {fieldErrors.studentId && (
          <p className="text-red-500 text-xs font-medium flex items-center gap-1 mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{fieldErrors.studentId}</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* 2. ATTENDANCE DATE */}
        <div className="space-y-1.5">
          <label
            htmlFor="attendanceDate"
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
              id="attendanceDate"
              name="attendanceDate"
              value={selectedDateYmd}
              onChange={handleDateChange}
              disabled={submitting}
              className={`w-full bg-background border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 transition-all [color-scheme:light] dark:[color-scheme:dark] cursor-pointer ${
                fieldErrors.date
                  ? "border-red-500/80 focus:ring-red-500/40"
                  : "border-border focus:ring-primary/50"
              }`}
            />
          </div>
          {fieldErrors.date && (
            <p className="text-red-500 text-xs font-medium flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{fieldErrors.date}</span>
            </p>
          )}
          <p className="text-[11px] text-muted-foreground">
            Calendar date recorded for this attendance session.
          </p>
        </div>

        {/* 3. ATTENDANCE STATUS */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/80">
            Status <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3 pt-0.5">
            {/* PRESENT Option */}
            <button
              type="button"
              onClick={() => handleStatusChange("PRESENT")}
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

            {/* ABSENT Option */}
            <button
              type="button"
              onClick={() => handleStatusChange("ABSENT")}
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
          {fieldErrors.status && (
            <p className="text-red-500 text-xs font-medium flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{fieldErrors.status}</span>
            </p>
          )}
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="px-5 py-2.5 bg-accent/60 hover:bg-accent text-foreground text-sm font-medium rounded-xl border border-border transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-xl shadow-sm shadow-primary/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Recording...</span>
            </>
          ) : (
            <span>Record Attendance</span>
          )}
        </button>
      </div>
    </form>
  );
}
