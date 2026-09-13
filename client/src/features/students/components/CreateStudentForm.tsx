import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { AlertCircle, Calendar, GraduationCap, Phone, MapPin, User, Hash } from "lucide-react";
import { createStudent, getEligibleUsers, EligibleStudentUser } from "../services/student.service";
import { getPrograms } from "../services/program.service";
import { Gender, Program, StudentCreateDto } from "../types/student.types";
import { validateCreateStudent } from "../validation/student.validation";
import { getTodayDateString } from "../utils/studentBadgeStyles";

interface CreateStudentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateStudentForm({
  onSuccess,
  onCancel,
}: CreateStudentFormProps): React.JSX.Element {
  const todayStr = getTodayDateString();

  // Form Data State
  const [formData, setFormData] = useState<StudentCreateDto>({
    userId: "",
    studentId: "",
    admissionDate: todayStr,
    programId: "",
    dateOfBirth: "",
    gender: undefined,
    phone: "",
    address: "",
  });

  // Eligible Users & Programs State
  const [eligibleUsers, setEligibleUsers] = useState<EligibleStudentUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState<boolean>(true);

  // Status & Validation State
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // 1. Fetch eligible student users (role = STUDENT, status = ACTIVE, unassigned)
  useEffect(() => {
    let isMounted = true;
    const loadUsers = async () => {
      try {
        const users = await getEligibleUsers();
        if (isMounted) {
          setEligibleUsers(users);
        }
      } catch (err) {
        console.error("Failed to load eligible users:", err);
      } finally {
        if (isMounted) setLoadingUsers(false);
      }
    };

    loadUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch programs for selector
  useEffect(() => {
    let isMounted = true;
    const loadPrograms = async () => {
      try {
        const progData = await getPrograms();
        if (isMounted) {
          // Only ACTIVE programs should normally be selectable
          setPrograms(progData.filter((p) => p.status === "ACTIVE"));
        }
      } catch (err) {
        console.error("Failed to load programs:", err);
      } finally {
        if (isMounted) setLoadingPrograms(false);
      }
    };

    loadPrograms();
    return () => {
      isMounted = false;
    };
  }, []);

  // Change handler with automatic field error clear
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverError) {
      setServerError(null);
    }
  };

  // Submission handler with client validation & server error mapping
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. Run client-side validation
    const validation = validateCreateStudent(formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    setServerError(null);

    try {
      await createStudent(formData);
      toast.success("Student created successfully!");
      onSuccess();
    } catch (err: unknown) {
      console.error("Create student error:", err);
      if (err instanceof AxiosError && err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError("Failed to create student. Please check input details and try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Server Error Alert */}
      {serverError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-start gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm font-medium">{serverError}</div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* User Selector */}
        <div className="sm:col-span-2 space-y-1.5">
          <label
            htmlFor="userId"
            className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
          >
            Linked User Account <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <User className="w-4 h-4" />
            </div>
            <select
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              disabled={loadingUsers}
              className={`w-full bg-background border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 transition-all cursor-pointer ${fieldErrors.userId
                ? "border-red-500/80 focus:ring-red-500/40"
                : "border-border focus:ring-primary/50"
                }`}
            >
              <option value="">
                {loadingUsers ? "Loading eligible users..." : "-- Select a Student User --"}
              </option>
              {eligibleUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName} — {u.email}
                </option>
              ))}
            </select>
          </div>
          {fieldErrors.userId && (
            <p className="text-red-500 text-xs font-medium">{fieldErrors.userId}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Links an existing verified user with STUDENT role to this student profile.
          </p>
        </div>

        {/* Student ID */}
        <div className="space-y-1.5">
          <label
            htmlFor="studentId"
            className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
          >
            Institutional Student ID <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <Hash className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="e.g. 2026CS001"
              maxLength={16}
              className={`w-full bg-background border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 transition-all ${fieldErrors.studentId
                ? "border-red-500/80 focus:ring-red-500/40"
                : "border-border focus:ring-primary/50"
                }`}
            />
          </div>
          {fieldErrors.studentId && (
            <p className="text-red-500 text-xs font-medium">{fieldErrors.studentId}</p>
          )}
          <p className="text-[11px] text-muted-foreground">Between 8 and 16 characters.</p>
        </div>

        {/* Admission Date */}
        <div className="space-y-1.5">
          <label
            htmlFor="admissionDate"
            className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
          >
            Admission Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <Calendar className="w-4 h-4" />
            </div>
            <input
              type="date"
              id="admissionDate"
              name="admissionDate"
              max={todayStr}
              value={formData.admissionDate}
              onChange={handleChange}
              className={`w-full bg-background border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 transition-all [color-scheme:light] dark:[color-scheme:dark] cursor-pointer ${fieldErrors.admissionDate
                ? "border-red-500/80 focus:ring-red-500/40"
                : "border-border focus:ring-primary/50"
                }`}
            />
          </div>
          {fieldErrors.admissionDate && (
            <p className="text-red-500 text-xs font-medium">{fieldErrors.admissionDate}</p>
          )}
        </div>

        {/* Program Selector */}
        <div className="sm:col-span-2 space-y-1.5">
          <label
            htmlFor="programId"
            className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
          >
            Academic Program <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <GraduationCap className="w-4 h-4" />
            </div>
            <select
              id="programId"
              name="programId"
              value={formData.programId}
              onChange={handleChange}
              disabled={loadingPrograms}
              className={`w-full bg-background border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 transition-all cursor-pointer ${fieldErrors.programId
                ? "border-red-500/80 focus:ring-red-500/40"
                : "border-border focus:ring-primary/50"
                }`}
            >
              <option value="">
                {loadingPrograms ? "Loading programs..." : "-- Select Program --"}
              </option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.code})
                </option>
              ))}
            </select>
          </div>
          {fieldErrors.programId && (
            <p className="text-red-500 text-xs font-medium">{fieldErrors.programId}</p>
          )}
        </div>

        {/* Date of Birth (Optional) */}
        <div className="space-y-1.5">
          <label
            htmlFor="dateOfBirth"
            className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
          >
            Date of Birth
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <Calendar className="w-4 h-4" />
            </div>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              max={formData.admissionDate && formData.admissionDate < todayStr ? formData.admissionDate : todayStr}
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`w-full bg-background border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 transition-all [color-scheme:light] dark:[color-scheme:dark] cursor-pointer ${fieldErrors.dateOfBirth
                ? "border-red-500/80 focus:ring-red-500/40"
                : "border-border focus:ring-primary/50"
                }`}
            />
          </div>
          {fieldErrors.dateOfBirth && (
            <p className="text-red-500 text-xs font-medium">{fieldErrors.dateOfBirth}</p>
          )}
        </div>

        {/* Gender (Optional) */}
        <div className="space-y-1.5">
          <label
            htmlFor="gender"
            className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
          >
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender || ""}
            onChange={handleChange}
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
          >
            <option value="">-- Select Gender --</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
          {fieldErrors.gender && (
            <p className="text-red-500 text-xs font-medium">{fieldErrors.gender}</p>
          )}
        </div>

        {/* Phone (Optional, 10 digits) */}
        <div className="space-y-1.5">
          <label
            htmlFor="phone"
            className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
          >
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              maxLength={10}
              className={`w-full bg-background border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 transition-all ${fieldErrors.phone
                ? "border-red-500/80 focus:ring-red-500/40"
                : "border-border focus:ring-primary/50"
                }`}
            />
          </div>
          {fieldErrors.phone && (
            <p className="text-red-500 text-xs font-medium">{fieldErrors.phone}</p>
          )}
        </div>

        {/* Address (Optional, 8-40 chars) */}
        <div className="space-y-1.5">
          <label
            htmlFor="address"
            className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
          >
            Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <MapPin className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. 12 Campus Lane, Block B"
              maxLength={40}
              className={`w-full bg-background border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 transition-all ${fieldErrors.address
                ? "border-red-500/80 focus:ring-red-500/40"
                : "border-border focus:ring-primary/50"
                }`}
            />
          </div>
          {fieldErrors.address && (
            <p className="text-red-500 text-xs font-medium">{fieldErrors.address}</p>
          )}
          <p className="text-[11px] text-muted-foreground">8 to 40 characters if provided.</p>
        </div>
      </div>

      {/* Modal Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-5 py-2.5 bg-accent/60 hover:bg-accent text-foreground text-sm font-medium rounded-xl border border-border transition-all cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-xl shadow-sm shadow-primary/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
        >
          {submitting ? "Creating..." : "Create Student"}
        </button>
      </div>
    </form>
  );
}
