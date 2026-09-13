import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { AlertCircle, Calendar, GraduationCap, Phone, MapPin, CheckCircle2, AlertTriangle } from "lucide-react";
import { updateStudent } from "../services/student.service";
import { getPrograms } from "../services/program.service";
import { Gender, Program, Student, StudentStatus, StudentUpdateDto } from "../types/student.types";
import { validateUpdateStudent } from "../validation/student.validation";
import { getTodayDateString } from "../utils/studentBadgeStyles";

interface UpdateStudentFormProps {
  student: Student;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UpdateStudentForm({
  student,
  onSuccess,
  onCancel,
}: UpdateStudentFormProps): React.JSX.Element {
  const todayStr = getTodayDateString();
  const maxDob = student.admissionDate
    ? student.admissionDate.split("T")[0] < todayStr
      ? student.admissionDate.split("T")[0]
      : todayStr
    : todayStr;

  // Editable fields initialized from current student record
  const [formData, setFormData] = useState<StudentUpdateDto>({
    programId: student.program?.id || student.programId || "",
    dateOfBirth: student.dateOfBirth
      ? new Date(student.dateOfBirth).toISOString().split("T")[0]
      : "",
    gender: (student.gender as Gender) || undefined,
    phone: student.phone || "",
    address: student.address || "",
    status: student.status,
  });

  const [programs, setPrograms] = useState<Program[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState<boolean>(true);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Load programs
  useEffect(() => {
    let isMounted = true;
    getPrograms()
      .then((data) => {
        if (isMounted) {
          // Include active programs or the current student's program even if inactive
          setPrograms(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load programs:", err);
      })
      .finally(() => {
        if (isMounted) setLoadingPrograms(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = validateUpdateStudent(formData, student.admissionDate);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    setServerError(null);

    try {
      await updateStudent(student.id, formData);
      toast.success("Student updated successfully!");
      onSuccess();
    } catch (err: unknown) {
      console.error("Update student error:", err);
      if (err instanceof AxiosError && err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError("Failed to update student. Please check input and try again.");
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
          <span className="text-muted-foreground">Student: </span>
          <span className="font-semibold text-foreground">
            {student.user?.firstName} {student.user?.lastName}
          </span>{" "}
          <span className="text-muted-foreground font-mono">({student.studentId})</span>
        </div>
        <div>
          <span className="text-muted-foreground">Email: </span>
          <span className="font-semibold text-foreground">{student.user?.email}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Status Selection */}
        <div className="sm:col-span-2 space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/80">
            Enrollment Status
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* ACTIVE */}
            <label
              className={`relative flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                formData.status === "ACTIVE"
                  ? "border-emerald-500 bg-emerald-500/5 shadow-xs"
                  : "border-border hover:border-muted-foreground bg-card"
              }`}
            >
              <input
                type="radio"
                name="status"
                value="ACTIVE"
                checked={formData.status === "ACTIVE"}
                onChange={() => setFormData((prev) => ({ ...prev, status: "ACTIVE" }))}
                className="sr-only"
              />
              <CheckCircle2
                className={`w-4 h-4 ${
                  formData.status === "ACTIVE"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-muted-foreground"
                }`}
              />
              <div>
                <div className="text-xs font-bold text-foreground">ACTIVE</div>
                <div className="text-[11px] text-muted-foreground">Actively enrolled</div>
              </div>
            </label>

            {/* INACTIVE */}
            <label
              className={`relative flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                formData.status === "INACTIVE"
                  ? "border-amber-500 bg-amber-500/5 shadow-xs"
                  : "border-border hover:border-muted-foreground bg-card"
              }`}
            >
              <input
                type="radio"
                name="status"
                value="INACTIVE"
                checked={formData.status === "INACTIVE"}
                onChange={() => setFormData((prev) => ({ ...prev, status: "INACTIVE" }))}
                className="sr-only"
              />
              <AlertTriangle
                className={`w-4 h-4 ${
                  formData.status === "INACTIVE"
                    ? "text-amber-600 dark:text-amber-500"
                    : "text-muted-foreground"
                }`}
              />
              <div>
                <div className="text-xs font-bold text-foreground">INACTIVE</div>
                <div className="text-[11px] text-muted-foreground">Suspended or inactive</div>
              </div>
            </label>
          </div>
        </div>

        {/* Academic Program */}
        <div className="sm:col-span-2 space-y-1.5">
          <label
            htmlFor="programId"
            className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
          >
            Academic Program
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
              className={`w-full bg-background border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 transition-all cursor-pointer ${
                fieldErrors.programId
                  ? "border-red-500/80 focus:ring-red-500/40"
                  : "border-border focus:ring-primary/50"
              }`}
            >
              <option value="">-- Select Program --</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.code}) {p.status === "INACTIVE" ? "— Inactive" : ""}
                </option>
              ))}
            </select>
          </div>
          {fieldErrors.programId && (
            <p className="text-red-500 text-xs font-medium">{fieldErrors.programId}</p>
          )}
        </div>

        {/* Date of Birth */}
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
              max={maxDob}
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`w-full bg-background border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 transition-all [color-scheme:light] dark:[color-scheme:dark] cursor-pointer ${
                fieldErrors.dateOfBirth
                  ? "border-red-500/80 focus:ring-red-500/40"
                  : "border-border focus:ring-primary/50"
              }`}
            />
          </div>
          {fieldErrors.dateOfBirth && (
            <p className="text-red-500 text-xs font-medium">{fieldErrors.dateOfBirth}</p>
          )}
        </div>

        {/* Gender */}
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
        </div>

        {/* Phone */}
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
        </div>

        {/* Address */}
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
              className={`w-full bg-background border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 transition-all ${
                fieldErrors.address
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
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
