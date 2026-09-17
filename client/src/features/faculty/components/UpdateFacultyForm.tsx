import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { AlertCircle, Calendar, Briefcase, Phone, Building2, CheckCircle2 } from "lucide-react";
import { updateFaculty } from "../services/faculty.service";
import { getDepartments } from "../services/department.service";
import { Department, Faculty, FacultyStatus, FacultyUpdateDto } from "../types/faculty.types";
import { validateUpdateFaculty } from "../validation/faculty.validation";
import { getTodayDateString } from "../utils/facultyBadgeStyles";

interface UpdateFacultyFormProps {
  faculty: Faculty;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UpdateFacultyForm({
  faculty,
  onSuccess,
  onCancel,
}: UpdateFacultyFormProps): React.JSX.Element {
  const todayStr = getTodayDateString();

  // Editable fields initialized from current faculty record
  const [formData, setFormData] = useState<FacultyUpdateDto>({
    departmentId: faculty.department?.id || faculty.departmentId || "",
    designation: faculty.designation || "",
    joiningDate: faculty.joiningDate
      ? faculty.joiningDate.includes("T")
        ? faculty.joiningDate.split("T")[0]
        : faculty.joiningDate
      : todayStr,
    phone: faculty.phone || "",
    status: faculty.status,
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState<boolean>(true);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Load departments
  useEffect(() => {
    let isMounted = true;
    getDepartments()
      .then((data) => {
        if (isMounted) {
          setDepartments(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load departments:", err);
      })
      .finally(() => {
        if (isMounted) setLoadingDepartments(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = validateUpdateFaculty(formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    setServerError(null);

    try {
      await updateFaculty(faculty.id, formData);
      toast.success("Faculty updated successfully!");
      onSuccess();
    } catch (err: unknown) {
      console.error("Update faculty error:", err);
      if (err instanceof AxiosError && err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Failed to update faculty. Please check input and try again.");
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

      {/* Read-Only Summary Banner */}
      <div className="p-4 rounded-xl bg-accent/30 border border-border flex flex-col sm:flex-row justify-between gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Faculty: </span>
          <span className="font-semibold text-foreground">
            {faculty.user?.firstName} {faculty.user?.lastName}
          </span>{" "}
          <span className="text-muted-foreground font-mono">({faculty.facultyId})</span>
        </div>
        <div>
          <span className="text-muted-foreground">Email: </span>
          <span className="font-semibold text-foreground">{faculty.user?.email}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Status Selection */}
        <div className="space-y-1.5">
          <label
            htmlFor="status"
            className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
          >
            Employment Status <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
          {fieldErrors.status && (
            <p className="text-red-500 text-xs font-medium">{fieldErrors.status}</p>
          )}
        </div>

        {/* Department Selection */}
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
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} ({dept.code})
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
              placeholder="e.g. Associate Professor"
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
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
