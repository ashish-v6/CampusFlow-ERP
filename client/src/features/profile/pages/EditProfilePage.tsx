import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, AlertCircle, Phone, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { getProfile, changeProfile } from "../services/profile.services";
import { User, UpdateProfilePayload } from "../profile.types";
import LoadingState from "../../../components/LoadingState";
import ErrorState from "../../../components/ErrorState";

export default function EditProfilePage(): React.JSX.Element {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProfile();
      setUser(data.user);
      setFormData({
        firstName: data.user.firstName || "",
        lastName: data.user.lastName || "",
        phone: data.user.phone || "",
        address: data.user.address || "",
      });
    } catch (err: unknown) {
      console.error("Error fetching profile:", err);
      if (err instanceof AxiosError && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to load user profile");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const hasUnsavedChanges =
    user !== null &&
    (formData.firstName !== (user.firstName || "") ||
      formData.lastName !== (user.lastName || "") ||
      formData.phone !== (user.phone || "") ||
      formData.address !== (user.address || ""));

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSaving(true);
      const payload: UpdateProfilePayload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
      };
      if (formData.phone.trim()) {
        payload.phone = formData.phone.trim();
      }
      if (user?.role?.toUpperCase() === "STUDENT" && formData.address.trim()) {
        payload.address = formData.address.trim();
      }

      await changeProfile(payload);
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || "Failed to update profile");
      } else {
        toast.error("Failed to update profile");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <LoadingState
        message="Loading Profile..."
        subtitle="Retrieving profile details for editing."
      />
    );
  }

  if (error || !user) {
    return (
      <ErrorState
        title="Failed to Load Profile"
        message={error || "Profile could not be retrieved."}
        onRetry={fetchUserData}
      />
    );
  }

  const isStudent = user.role?.toUpperCase() === "STUDENT";

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      {/* 1. PAGE HEADER */}
      <div className="space-y-4">
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
        >
          <div className="p-1 rounded-md group-hover:bg-accent transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to Profile
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Edit Profile
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            Update your personal and contact details.
          </p>
        </div>
      </div>

      {/* 2. PROFILE EDIT CARD */}
      <form onSubmit={handleSubmit} noValidate className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 sm:p-8 space-y-8">
          {/* AVATAR DISPLAY (Read-Only) */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-border/50">
            <div className="w-20 h-20 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center text-primary text-2xl font-bold shadow-md shrink-0">
              {user.initials}
            </div>

            <div className="text-center sm:text-left space-y-1">
              <h3 className="text-sm font-semibold text-foreground">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-xs text-muted-foreground max-w-xs">
                Profile avatar initials are updated automatically when your name changes.
              </p>
            </div>
          </div>

          {/* FORM FIELDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-border focus:ring-primary/20 focus:border-primary"
                }`}
              />
              {formErrors.firstName && (
                <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>
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
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-border focus:ring-primary/20 focus:border-primary"
                }`}
              />
              {formErrors.lastName && (
                <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>
              )}
            </div>

            {/* Phone */}
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
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground"
                />
                <Phone className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Address (If Student) */}
            {isStudent && (
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
                    className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground"
                  />
                  <MapPin className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. FORM ACTIONS & UNSAVED CHANGES STATUS */}
        <div className="bg-accent/20 border-t border-border p-5 sm:px-8 sm:py-5 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground w-full sm:w-auto justify-center sm:justify-start">
            {hasUnsavedChanges && (
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500 text-xs font-medium">
                <AlertCircle className="w-4 h-4" />
                <span>You have unsaved changes</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="w-full sm:w-auto px-6 py-2.5 bg-transparent hover:bg-accent text-foreground text-sm font-medium rounded-xl border border-transparent hover:border-border transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!hasUnsavedChanges || saving}
              className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
