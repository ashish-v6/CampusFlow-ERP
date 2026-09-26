import React, { useState } from "react";
import { UserPlus, AlertCircle, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { createUser } from "../service/users.service";
import { CreateUserPayload } from "../users.types";

interface CreateUserFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "ADMIN" | "FACULTY" | "STUDENT";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  phone: string;
  address: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: string;
  status?: string;
  phone?: string;
  address?: string;
}

export default function CreateUserForm({
  onSuccess,
  onCancel,
}: CreateUserFormProps): React.JSX.Element {
  const [formData, setFormData] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "STUDENT",
    status: "ACTIVE",
    phone: "",
    address: "",
  });

  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = (): boolean => {
    const errors: FormErrors = {};

    // First Name: required, 2-50 chars
    const trimmedFirst = formData.firstName.trim();
    if (!trimmedFirst) {
      errors.firstName = "First name is required";
    } else if (trimmedFirst.length < 2) {
      errors.firstName = "First name must be at least 2 characters";
    } else if (trimmedFirst.length > 50) {
      errors.firstName = "First name cannot exceed 50 characters";
    }

    // Last Name: required, 2-50 chars
    const trimmedLast = formData.lastName.trim();
    if (!trimmedLast) {
      errors.lastName = "Last name is required";
    } else if (trimmedLast.length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
    } else if (trimmedLast.length > 50) {
      errors.lastName = "Last name cannot exceed 50 characters";
    }

    // Email: required, valid format
    const trimmedEmail = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      errors.email = "Email address is required";
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address";
    }

    // Password: min 8, uppercase, lowercase, number, special char
    const pwd = formData.password;
    if (!pwd) {
      errors.password = "Password is required";
    } else if (pwd.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    } else if (!/[A-Z]/.test(pwd)) {
      errors.password = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(pwd)) {
      errors.password = "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(pwd)) {
      errors.password = "Password must contain at least one number";
    } else if (!/[^A-Za-z0-9]/.test(pwd)) {
      errors.password = "Password must contain at least one special character";
    }

    // Phone: optional, 10 digits
    if (formData.phone && formData.phone.trim()) {
      if (!/^\d{10}$/.test(formData.phone.trim())) {
        errors.phone = "Phone number must be exactly 10 digits";
      }
    }

    // Address: optional, max 255 chars
    if (formData.address && formData.address.trim().length > 255) {
      errors.address = "Address cannot exceed 255 characters";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof FormErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (serverError) setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setLoading(true);
    try {
      const payload: CreateUserPayload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
        status: formData.status,
        ...(formData.phone.trim() ? { phone: formData.phone.trim() } : {}),
        ...(formData.address.trim() ? { address: formData.address.trim() } : {}),
      };

      await createUser(payload);
      toast.success("User account created successfully!");
      onSuccess();
    } catch (err: unknown) {
      console.error("Create user error:", err);
      if (err instanceof AxiosError && err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError("Failed to create user. Please check your connection and inputs.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left" noValidate>
      {serverError && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-start gap-2.5 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="font-medium leading-relaxed">{serverError}</div>
        </div>
      )}

      {/* Name Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="e.g. John"
            className={`w-full px-3 py-2 text-sm bg-background border rounded-xl focus:outline-none focus:ring-2 transition-all placeholder:text-muted-foreground text-foreground ${
              fieldErrors.firstName
                ? "border-red-500/80 focus:ring-red-500/40"
                : "border-border focus:ring-primary/50"
            }`}
          />
          {fieldErrors.firstName && (
            <p className="text-[11px] text-red-500 font-medium">{fieldErrors.firstName}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="e.g. Doe"
            className={`w-full px-3 py-2 text-sm bg-background border rounded-xl focus:outline-none focus:ring-2 transition-all placeholder:text-muted-foreground text-foreground ${
              fieldErrors.lastName
                ? "border-red-500/80 focus:ring-red-500/40"
                : "border-border focus:ring-primary/50"
            }`}
          />
          {fieldErrors.lastName && (
            <p className="text-[11px] text-red-500 font-medium">{fieldErrors.lastName}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="e.g. john.doe@campusflow.edu"
          className={`w-full px-3 py-2 text-sm bg-background border rounded-xl focus:outline-none focus:ring-2 transition-all placeholder:text-muted-foreground text-foreground ${
            fieldErrors.email
              ? "border-red-500/80 focus:ring-red-500/40"
              : "border-border focus:ring-primary/50"
          }`}
        />
        {fieldErrors.email && (
          <p className="text-[11px] text-red-500 font-medium">{fieldErrors.email}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Min 8 chars, uppercase, lowercase, number, symbol"
            className={`w-full pl-3 pr-10 py-2 text-sm bg-background border rounded-xl focus:outline-none focus:ring-2 transition-all placeholder:text-muted-foreground text-foreground ${
              fieldErrors.password
                ? "border-red-500/80 focus:ring-red-500/40"
                : "border-border focus:ring-primary/50"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {fieldErrors.password && (
          <p className="text-[11px] text-red-500 font-medium">{fieldErrors.password}</p>
        )}
      </div>

      {/* Role and Status Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground cursor-pointer"
          >
            <option value="STUDENT">Student</option>
            <option value="FACULTY">Faculty</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Initial Status <span className="text-red-500">*</span>
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground cursor-pointer"
          >
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Phone */}
      <div className="space-y-1">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Phone Number <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="10-digit mobile number"
          className={`w-full px-3 py-2 text-sm bg-background border rounded-xl focus:outline-none focus:ring-2 transition-all placeholder:text-muted-foreground text-foreground ${
            fieldErrors.phone
              ? "border-red-500/80 focus:ring-red-500/40"
              : "border-border focus:ring-primary/50"
          }`}
        />
        {fieldErrors.phone && (
          <p className="text-[11px] text-red-500 font-medium">{fieldErrors.phone}</p>
        )}
      </div>

      {/* Address */}
      <div className="space-y-1">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Residential Address <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={2}
          placeholder="Street, City, Postal Code"
          className={`w-full px-3 py-2 text-sm bg-background border rounded-xl focus:outline-none focus:ring-2 transition-all placeholder:text-muted-foreground text-foreground resize-none ${
            fieldErrors.address
              ? "border-red-500/80 focus:ring-red-500/40"
              : "border-border focus:ring-primary/50"
          }`}
        />
        {fieldErrors.address && (
          <p className="text-[11px] text-red-500 font-medium">{fieldErrors.address}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/80">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground bg-accent/50 hover:bg-accent border border-transparent rounded-xl transition-all cursor-pointer disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-xl shadow-sm shadow-primary/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer disabled:opacity-50"
        >
          <UserPlus className="w-3.5 h-3.5" />
          {loading ? "Creating..." : "Create User"}
        </button>
      </div>
    </form>
  );
}
