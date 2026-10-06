import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { CheckCircle2, Phone, MapPin, User as UserIcon } from "lucide-react";
import { changeProfile } from "../services/profile.services";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { User, UpdateProfilePayload } from "../profile.types";
import { formatPhoneWithPrefix } from "../../students/validation/student.validation";

interface PersonalInfoFormProps {
  user: User;
  onUpdate?: (updatedUser: User) => void;
}

interface FormState {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
}

export default function PersonalInfoForm({
  user,
  onUpdate,
}: PersonalInfoFormProps): React.JSX.Element {
  const initialValues: FormState = {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phone: user.phone || "",
    address: user.address || "",
  };

  const [formData, setFormData] = useState<FormState>(initialValues);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [disabled, setDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const isStudent = user.role?.toUpperCase() === "STUDENT";
  const isFaculty = user.role?.toUpperCase() === "FACULTY";

  useEffect(() => {
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
      address: user.address || "",
    });
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  useEffect(() => {
    const isUnchanged =
      formData.firstName === (user.firstName || "") &&
      formData.lastName === (user.lastName || "") &&
      formData.phone === (user.phone || "") &&
      formData.address === (user.address || "");

    setDisabled(isUnchanged);
  }, [formData, user]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const errors: FormErrors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (formData.phone.trim()) {
      const trimmedPhone = formData.phone.trim();
      const digitsOnly = trimmedPhone.replace(/\D/g, "");
      const isValid =
        /^(?:\+91[\s\-]?)?\d{10}$/.test(trimmedPhone) ||
        digitsOnly.length === 10 ||
        (digitsOnly.length === 12 && digitsOnly.startsWith("91"));

      if (!isValid) {
        errors.phone = "Phone number must be 10 digits (e.g. +91 9876543210 or 9876543210)";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setLoading(true);
      const payload: UpdateProfilePayload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
      };

      if (formData.phone.trim()) {
        payload.phone = formatPhoneWithPrefix(formData.phone.trim());
      } else if (formData.phone === "" && user.phone) {
        payload.phone = "";
      }

      if (formData.address.trim()) {
        payload.address = formData.address.trim();
      } else if (formData.address === "" && user.address) {
        payload.address = "";
      }

      const result = await changeProfile(payload);
      toast.success("Profile updated successfully!");
      if (onUpdate && result.user) {
        onUpdate(result.user);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to update profile");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (): void => {
    setFormData(initialValues);
    setFormErrors({});
  };

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-border">
        <h2 className="text-lg font-bold text-foreground">Personal Information</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Update your permitted profile information and contact details.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="p-5 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {/* First Name */}
          <div className="space-y-2">
            <label
              htmlFor="firstName"
              className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              className={`w-full bg-background border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 transition-all placeholder:text-muted-foreground ${
                formErrors.firstName
                  ? "border-red-500/80 focus:ring-red-500/40 focus:border-red-500"
                  : "border-border focus:ring-primary/50 focus:border-primary"
              }`}
            />
            {formErrors.firstName && (
              <p className="text-red-400 text-xs mt-1 font-medium">{formErrors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label
              htmlFor="lastName"
              className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              className={`w-full bg-background border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 transition-all placeholder:text-muted-foreground ${
                formErrors.lastName
                  ? "border-red-500/80 focus:ring-red-500/40 focus:border-red-500"
                  : "border-border focus:ring-primary/50 focus:border-primary"
              }`}
            />
            {formErrors.lastName && (
              <p className="text-red-400 text-xs mt-1 font-medium">{formErrors.lastName}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
            >
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength={15}
                placeholder="+91 9876543210"
                className={`w-full bg-background border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 transition-all placeholder:text-muted-foreground ${
                  formErrors.phone
                    ? "border-red-500/80 focus:ring-red-500/40 focus:border-red-500"
                    : "border-border focus:ring-primary/50 focus:border-primary"
                }`}
              />
              <Phone className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {formErrors.phone && (
              <p className="text-red-400 text-xs mt-1 font-medium">{formErrors.phone}</p>
            )}
          </div>

          {/* Residential Address (Available for all roles) */}
          <div className="space-y-2">
            <label
              htmlFor="address"
              className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
            >
              Residential Address
            </label>
            <div className="relative">
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street, City, Postal Code"
                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground"
              />
              <MapPin className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Email (Read-only) */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
            >
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={user.email}
                disabled
                className="w-full bg-accent/30 border border-border rounded-xl px-4 py-2.5 text-sm text-muted-foreground cursor-not-allowed transition-all"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-emerald-500">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">Email address cannot be modified.</p>
          </div>

          {/* Role (Read-only) */}
          <div className="space-y-2">
            <label
              htmlFor="role"
              className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
            >
              Account Role
            </label>
            <input
              type="text"
              id="role"
              value={user.role}
              disabled
              className="w-full bg-accent/30 border border-border rounded-xl px-4 py-2.5 text-sm text-muted-foreground cursor-not-allowed transition-all capitalize"
            />
            <p className="text-[11px] text-muted-foreground">
              Institutional permissions are tied to your assigned role.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-border/50">
          <button
            type="submit"
            disabled={disabled || loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-xl shadow-sm shadow-primary/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={disabled || loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-transparent hover:bg-accent text-foreground text-sm font-medium rounded-xl border border-transparent hover:border-border transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
