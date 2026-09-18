import React, { useState, ChangeEvent, FormEvent } from "react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { AlertCircle, Building2, Hash } from "lucide-react";
import { createDepartment } from "../services/department.service";
import { DepartmentCreateDto } from "../types/department.types";
import { validateCreateDepartment } from "../validation/department.validation";

interface CreateDepartmentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateDepartmentForm({
  onSuccess,
  onCancel,
}: CreateDepartmentFormProps): React.JSX.Element {
  // Form Data State
  const [formData, setFormData] = useState<DepartmentCreateDto>({
    name: "",
    code: "",
  });

  // Status & Validation State
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Change handler with automatic field error clear
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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
    const validation = validateCreateDepartment(formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    setServerError(null);

    try {
      await createDepartment({
        name: formData.name.trim(),
        code: formData.code.trim(),
      });
      toast.success("Department created successfully!");
      onSuccess();
    } catch (err: unknown) {
      console.error("Create department error:", err);
      if (err instanceof AxiosError && err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Failed to create department. Please check details and try again.");
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
        {/* Department Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="name"
            className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
          >
            Department Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <Building2 className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Computer Science and Engineering"
              maxLength={40}
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
          <p className="text-[11px] text-muted-foreground">Max 40 characters.</p>
        </div>

        {/* Department Code */}
        <div className="space-y-1.5">
          <label
            htmlFor="code"
            className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
          >
            Department Code <span className="text-red-500">*</span>
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
              placeholder="e.g. CSE"
              maxLength={12}
              className={`w-full bg-background border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 transition-all font-mono ${
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
            Max 12 characters. Must be unique across all departments.
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
          {submitting ? "Creating..." : "Create Department"}
        </button>
      </div>
    </form>
  );
}
