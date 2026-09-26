import React, { useState, ChangeEvent, FormEvent } from "react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { AlertCircle, BookOpen, Hash, Building2, CheckCircle2 } from "lucide-react";
import { createProgram } from "../services/program.service";
import { CreateProgramDto, ProgramStatus } from "../types/program.types";
import { Department } from "../../departments/types/department.types";
import { validateCreateProgram } from "../validation/program.validation";

interface CreateProgramFormProps {
  departments: Department[];
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateProgramForm({
  departments,
  onSuccess,
  onCancel,
}: CreateProgramFormProps): React.JSX.Element {
  // Form Data State
  const [formData, setFormData] = useState<CreateProgramDto>({
    name: "",
    code: "",
    departmentId: departments.length > 0 ? departments[0].id : "",
    status: "ACTIVE",
  });

  // Status & Validation State
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Change handler with automatic field error clearing
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const finalValue = name === "code" ? value.toUpperCase() : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverError) {
      setServerError(null);
    }
  };

  // Submission handler with strict client validation
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = validateCreateProgram(formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    setServerError(null);

    try {
      await createProgram({
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        departmentId: formData.departmentId,
        status: formData.status as ProgramStatus,
      });
      toast.success("Academic Program created successfully!");
      onSuccess();
    } catch (err: unknown) {
      console.error("Create program error:", err);
      if (err instanceof AxiosError && err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Failed to create academic program. Please verify details and try again.");
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

      <div className="space-y-5">
        {/* Program Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="name"
            className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
          >
            Program Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <BookOpen className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Bachelor of Computer Science"
              maxLength={100}
              className={`w-full bg-background border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 transition-all ${
                fieldErrors.name
                  ? "border-red-500/80 focus:ring-red-500/40"
                  : "border-border focus:ring-primary/50"
              }`}
            />
          </div>
          {fieldErrors.name && (
            <p className="text-red-500 text-xs font-medium">{fieldErrors.name}</p>
          )}
          <p className="text-[11px] text-muted-foreground">Between 2 and 100 characters.</p>
        </div>

        {/* Program Code */}
        <div className="space-y-1.5">
          <label
            htmlFor="code"
            className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
          >
            Program Code <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <Hash className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g. CS-BS"
              maxLength={20}
              className={`w-full bg-background border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 transition-all font-mono uppercase ${
                fieldErrors.code
                  ? "border-red-500/80 focus:ring-red-500/40"
                  : "border-border focus:ring-primary/50"
              }`}
            />
          </div>
          {fieldErrors.code && (
            <p className="text-red-500 text-xs font-medium">{fieldErrors.code}</p>
          )}
          <p className="text-[11px] text-muted-foreground">
            2 to 20 uppercase alphanumeric chars (e.g. CS-BS, IT-BE). Must be globally unique.
          </p>
        </div>

        {/* Department Select */}
        <div className="space-y-1.5">
          <label
            htmlFor="departmentId"
            className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
          >
            Academic Department <span className="text-red-500">*</span>
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
              className={`w-full bg-background border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 transition-all cursor-pointer ${
                fieldErrors.departmentId
                  ? "border-red-500/80 focus:ring-red-500/40"
                  : "border-border focus:ring-primary/50"
              }`}
            >
              <option value="" disabled className="bg-card text-foreground">
                Select Department...
              </option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id} className="bg-card text-foreground">
                  {dept.name} ({dept.code}) - {dept.status}
                </option>
              ))}
            </select>
          </div>
          {fieldErrors.departmentId && (
            <p className="text-red-500 text-xs font-medium">{fieldErrors.departmentId}</p>
          )}
          <p className="text-[11px] text-muted-foreground">
            Department that hosts and manages this academic program.
          </p>
        </div>

        {/* Status Select */}
        <div className="space-y-1.5">
          <label
            htmlFor="status"
            className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
          >
            Initial Status <span className="text-red-500">*</span>
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
              <option value="ACTIVE" className="bg-card text-foreground">ACTIVE</option>
              <option value="INACTIVE" className="bg-card text-foreground">INACTIVE</option>
            </select>
          </div>
          <p className="text-[11px] text-muted-foreground">
            ACTIVE programs are available for new student admissions.
          </p>
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
          {submitting ? "Creating..." : "Create Program"}
        </button>
      </div>
    </form>
  );
}
