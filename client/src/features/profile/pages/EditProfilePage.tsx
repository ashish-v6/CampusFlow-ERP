import React from "react";
import { Link } from "react-router";
import { ArrowLeft, AlertCircle } from "lucide-react";

// PATCH /api/users/me
// Dedicated page allowing authenticated users to update basic profile information (firstName, lastName).
export default function EditProfilePage(): React.JSX.Element {
  // Dummy data
  const user = {
    firstName: "Ashu",
    lastName: "Patel",
    initials: "AP"
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      
      {/* 1. PAGE HEADER */}
      <div className="space-y-4">
        <Link 
          to="/profile" 
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
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
            Update your personal information.
          </p>
        </div>
      </div>

      {/* 2. PROFILE EDIT CARD */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
        
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* AVATAR DISPLAY (Read-Only) */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-border/50">
            <div className="w-20 h-20 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center text-primary text-2xl font-bold shadow-md">
              {user.initials}
            </div>
            
            <div className="text-center sm:text-left space-y-1">
              <h3 className="text-sm font-semibold text-foreground">{user.firstName} {user.lastName}</h3>
              <p className="text-xs text-muted-foreground max-w-xs">
                Profile avatar is generated automatically from your name initials.
              </p>
            </div>
          </div>

          {/* FORM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* First Name */}
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-xs font-semibold uppercase tracking-wider text-foreground/80">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                defaultValue={user.firstName}
                className="w-full bg-input/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary hover:border-border/80 transition-all placeholder:text-muted-foreground shadow-sm"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-xs font-semibold uppercase tracking-wider text-foreground/80">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                defaultValue={user.lastName}
                className="w-full bg-input/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary hover:border-border/80 transition-all placeholder:text-muted-foreground shadow-sm"
              />
            </div>

          </div>
        </div>

        {/* 3. FORM ACTIONS & 4. UNSAVED CHANGES VISUAL */}
        <div className="bg-accent/20 border-t border-border p-5 sm:px-8 sm:py-5 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 w-full sm:w-auto justify-center sm:justify-start">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-medium">You have unsaved changes</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              className="w-full sm:w-auto px-6 py-2.5 bg-transparent hover:bg-accent text-foreground text-sm font-medium rounded-xl border border-transparent hover:border-border transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card"
            >
              Cancel
            </button>
            <button
              type="button"
              className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-xl shadow-sm shadow-primary/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card"
            >
              Save Changes
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
