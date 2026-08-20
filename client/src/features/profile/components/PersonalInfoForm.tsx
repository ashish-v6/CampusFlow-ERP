import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { changeProfile } from "../services/profile.services";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface PersonalInfoFormProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

interface Names {
  firstName: string;
  lastName: string;
}
interface formError {
  firstName?: string;
  lastName?: string;
}

// PATCH /api/users/me
// UI component for updating authenticated user's basic profile details (firstName, lastName).
// Email and role are displayed as read-only information.
export default function PersonalInfoForm({ user }: PersonalInfoFormProps): React.JSX.Element {
  const name = { firstName: user.firstName, lastName: user.lastName };
  const [names, setNames] = useState<Names>(name);
  const [formError, setFormError] = useState<formError>({});
  const [disabled, setDisabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setNames((oldNames) => {
      return {
        ...oldNames,
        [e.target.name]: e.target.value,
      };
    });
    setFormError((oldErrors) => {
      return {
        ...oldErrors,
        [e.target.name]: "",
      };
    });
    setDisabled(false);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const errors: formError = {};

    if (!names.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!names.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormError(errors);
      return;
    }

    try {
      setLoading(true);
      const result = await changeProfile(names);
      toast.success("Profile Updated");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message ?? "Something went wrong");
      } else {
        toast.error("Something unexpected happend");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (): void => {
    setNames({ firstName: user.firstName, lastName: user.lastName });
    setFormError({});
  };

  useEffect(() => {
    if (names.firstName === name.firstName && names.lastName === name.lastName) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [names, loading]);

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-border">
        <h2 className="text-lg font-bold text-foreground">Personal Information</h2>
        <p className="text-sm text-muted-foreground mt-1">Update your basic profile information.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="p-5 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {/* First Name (Editable) */}
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
              value={names.firstName}
              onChange={handleNameChange}
              placeholder="Enter first name"
              className={`w-full bg-background border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 transition-all placeholder:text-muted-foreground ${
                formError.firstName
                  ? "border-red-500/80 focus:ring-red-500/40 focus:border-red-500"
                  : "border-border focus:ring-primary/50 focus:border-primary"
              }`}
            />
            {formError.firstName && (
              <p className="text-red-400 text-xs mt-1 font-medium">{formError.firstName}</p>
            )}
          </div>

          {/* Last Name (Editable) */}
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
              value={names.lastName}
              onChange={handleNameChange}
              placeholder="Enter last name"
              className={`w-full bg-background border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 transition-all placeholder:text-muted-foreground ${
                formError.lastName
                  ? "border-red-500/80 focus:ring-red-500/40 focus:border-red-500"
                  : "border-border focus:ring-primary/50 focus:border-primary"
              }`}
            />
            {formError.lastName && (
              <p className="text-red-400 text-xs mt-1 font-medium">{formError.lastName}</p>
            )}
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
                defaultValue={user.email}
                disabled
                className="w-full bg-accent/30 border border-border rounded-xl px-4 py-2.5 text-sm text-muted-foreground cursor-not-allowed transition-all"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-emerald-500">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">Email address cannot be changed.</p>
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
              defaultValue={user.role}
              disabled
              className="w-full bg-accent/30 border border-border rounded-xl px-4 py-2.5 text-sm text-muted-foreground cursor-not-allowed transition-all"
            />
            <p className="text-[11px] text-muted-foreground">
              Contact support to change your role.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-border/50">
          <button
            type="submit"
            disabled={disabled || loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-xl shadow-sm shadow-primary/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background cursor-pointer disabled:bg-blue-600/80 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="w-full sm:w-auto px-6 py-2.5 bg-transparent hover:bg-accent text-foreground text-sm font-medium rounded-xl border border-transparent hover:border-border transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background cursor-pointer "
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
