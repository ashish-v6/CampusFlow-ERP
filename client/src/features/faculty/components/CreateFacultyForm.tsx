import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { AlertCircle, Calendar, Briefcase, Phone, User, Hash, Building2 } from "lucide-react";
import { createFaculty, getEligibleFacultyUsers } from "../services/faculty.service";
import { getDepartments } from "../services/department.service";
import { Department, EligibleFacultyUser, FacultyCreateDto } from "../types/faculty.types";
import { validateCreateFaculty } from "../validation/faculty.validation";
import { getTodayDateString } from "../utils/facultyBadgeStyles";

interface CreateFacultyFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateFacultyForm({
  onSuccess,
  onCancel,
}: CreateFacultyFormProps): React.JSX.Element {
  const todayStr = getTodayDateString();

  // Form Data State
  const [formData, setFormData] = useState<FacultyCreateDto>({
    userId: "",
    facultyId: "",
    departmentId: "",
    designation: "",
    joiningDate: todayStr,
    phone: "",
  });

  // Eligible Users & Departments State
  const [eligibleUsers, setEligibleUsers] = useState<EligibleFacultyUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState<boolean>(true);

  // Status & Validation State
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // 1. Fetch eligible faculty users (role = FACULTY, status = ACTIVE, unassigned)
  useEffect(() => {
    let isMounted = true;
    const loadUsers = async () => {
      try {
        const users = await getEligibleFacultyUsers();
        if (isMounted) {
          setEligibleUsers(users);
        }
      } catch (err) {
        console.error("Failed to load eligible faculty users:", err);
      } finally {
        if (isMounted) setLoadingUsers(false);
      }
    };

    loadUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch departments for selector
  useEffect(() => {
    let isMounted = true;
    const loadDepartments = async () => {
      try {
        const deptData = await getDepartments();
        if (isMounted) {
          setDepartments(deptData.filter((d) => d.status === "ACTIVE"));
        }
      } catch (err) {
        console.error("Failed to load departments:", err);
      } finally {
        if (isMounted) setLoadingDepartments(false);
      }
    };

    loadDepartments();
    return () => {
      isMounted = false;
    };
  }, []);

  // Change handler with automatic field error clear
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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
    const validation = validateCreateFaculty(formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    setServerError(null);

    try {
      await createFaculty(formData);
      toast.success("Faculty created successfully!");
      onSuccess();
    } catch (err: unknown) {
      console.error("Create faculty error:", err);
      if (err instanceof AxiosError && err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Failed to create faculty. Please check input details and try again.");
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
              className={`w-full bg-background border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 transition-all cursor-pointer ${
                fieldErrors.userId
                  ? "border-red-500/80 focus:ring-red-500/40"
                  : "border-border focus:ring-primary/50"
              }`}
            >
              <option value="">
                {loadingUsers ? "Loading eligible users..." : "-- Select a Faculty User --"}
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
            Links an existing verified user with FACULTY role to this faculty profile.
          </p>
        </div>

        {/* Faculty ID */}
        <div className="space-y-1.5">
          <label
            htmlFor="facultyId"
            className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
          >
            Institutional Faculty ID <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <Hash className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="facultyId"
              name="facultyId"
              value={formData.facultyId}
              onChange={handleChange}
              placeholder="e.g. FAC20261"
              maxLength={8}
              className={`w-full bg-background border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 transition-all ${
                fieldErrors.facultyId
                  ? "border-red-500/80 focus:ring-red-500/40"
                  : "border-border focus:ring-primary/50"
              }`}
            />
          </div>
          {fieldErrors.facultyId && (
            <p className="text-red-500 text-xs font-medium">{fieldErrors.facultyId}</p>
          )}
          <p className="text-[11px] text-muted-foreground">Must be exactly 8 characters.</p>
        </div>

        {/* Department Selector */}
        <div className="space-y-1.5">
          <label
            htmlFor="departmentId"
            className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
          >
            Department <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <Building2 className="w-4 h-4" />
            </div>
            <select
              id="departmentId"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              disabled={loadingDepartments}
              className={`w-full bg-background border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 transition-all cursor-pointer ${
                fieldErrors.departmentId
                  ? "border-red-500/80 focus:ring-red-500/40"
                  : "border-border focus:ring-primary/50"
              }`}
            >
              <option value="">
                {loadingDepartments ? "Loading departments..." : "-- Select Department --"}
              </option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>
          {fieldErrors.departmentId && (
            <p className="text-red-500 text-xs font-medium">{fieldErrors.departmentId}</p>
          )}
        </div>

        {/* Designation */}
        <div className="space-y-1.5">
          <label
            htmlFor="designation"
            className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
          >
            Designation <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <Briefcase className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="e.g. Assistant Professor"
              maxLength={30}
              className={`w-full bg-background border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 transition-all ${
                fieldErrors.designation
                  ? "border-red-500/80 focus:ring-red-500/40"
                  : "border-border focus:ring-primary/50"
              }`}
            />
          </div>
          {fieldErrors.designation && (
            <p className="text-red-500 text-xs font-medium">{fieldErrors.designation}</p>
          )}
          <p className="text-[11px] text-muted-foreground">Max 30 characters.</p>
        </div>

        {/* Joining Date */}
        <div className="space-y-1.5">
          <label
            htmlFor="joiningDate"
            className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
          >
            Joining Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <Calendar className="w-4 h-4" />
            </div>
            <input
              type="date"
              id="joiningDate"
              name="joiningDate"
              max={todayStr}
              value={formData.joiningDate}
              onChange={handleChange}
              className={`w-full bg-background border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 transition-all [color-scheme:light] dark:[color-scheme:dark] cursor-pointer ${
                fieldErrors.joiningDate
                  ? "border-red-500/80 focus:ring-red-500/40"
                  : "border-border focus:ring-primary/50"
              }`}
            />
          </div>
          {fieldErrors.joiningDate && (
            <p className="text-red-500 text-xs font-medium">{fieldErrors.joiningDate}</p>
          )}
          <p className="text-[11px] text-muted-foreground">Cannot be in the future.</p>
        </div>

        {/* Phone */}
        <div className="sm:col-span-2 space-y-1.5">
          <label
            htmlFor="phone"
            className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
          >
            Phone Number <span className="text-red-500">*</span>
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
              placeholder="e.g. 9876543210"
              maxLength={10}
              className={`w-full bg-background border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 transition-all ${
                fieldErrors.phone
                  ? "border-red-500/80 focus:ring-red-500/40"
                  : "border-border focus:ring-primary/50"
              }`}
            />
          </div>
          {fieldErrors.phone && (
            <p className="text-red-500 text-xs font-medium">{fieldErrors.phone}</p>
          )}
          <p className="text-[11px] text-muted-foreground">Must be exactly 10 digits.</p>
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
          {submitting ? "Creating..." : "Create Faculty"}
        </button>
      </div>
    </form>
  );
}
