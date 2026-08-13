import React from "react";
import { CheckCircle2 } from "lucide-react";

interface PersonalInfoFormProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export default function PersonalInfoForm({ user }: PersonalInfoFormProps): React.JSX.Element {
  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-border">
        <h2 className="text-lg font-bold text-foreground">Personal Information</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Update your basic profile information.
        </p>
      </div>
      
      <div className="p-5 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          
          {/* First Name (Editable) */}
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-xs font-semibold uppercase tracking-wider text-foreground/80">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              defaultValue={user.firstName}
              className="w-full bg-input/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground"
            />
          </div>

          {/* Last Name (Editable) */}
          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-xs font-semibold uppercase tracking-wider text-foreground/80">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              defaultValue={user.lastName}
              className="w-full bg-input/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground"
            />
          </div>

          {/* Email (Read-only) */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-foreground/80">
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
            <label htmlFor="role" className="block text-xs font-semibold uppercase tracking-wider text-foreground/80">
              Account Role
            </label>
            <input
              type="text"
              id="role"
              defaultValue={user.role}
              disabled
              className="w-full bg-accent/30 border border-border rounded-xl px-4 py-2.5 text-sm text-muted-foreground cursor-not-allowed transition-all"
            />
            <p className="text-[11px] text-muted-foreground">Contact support to change your role.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-border/50">
          <button
            type="button"
            className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-xl shadow-sm shadow-primary/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            Save Changes
          </button>
          <button
            type="button"
            className="w-full sm:w-auto px-6 py-2.5 bg-transparent hover:bg-accent text-foreground text-sm font-medium rounded-xl border border-transparent hover:border-border transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
