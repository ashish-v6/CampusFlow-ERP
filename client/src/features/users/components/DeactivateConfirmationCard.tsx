import React from "react";
import { useNavigate } from "react-router";
import { Check } from "lucide-react";
import { UserDetails } from "../users.types";

interface DeactivateConfirmationCardProps {
  user: UserDetails;
  isConfirmed: boolean;
  setIsConfirmed: (confirmed: boolean) => void;
  onOpenModal: () => void;
}

export default function DeactivateConfirmationCard({
  user,
  isConfirmed,
  setIsConfirmed,
  onOpenModal,
}: DeactivateConfirmationCardProps): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-foreground">Deactivate this user?</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Are you sure you want to deactivate {user.firstName} {user.lastName}'s account?
          </p>
        </div>

        <label className="flex items-start gap-3 p-4 rounded-xl border border-border hover:border-muted-foreground bg-accent/30 cursor-pointer transition-colors group">
          <div className="pt-0.5">
            <div
              className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                isConfirmed
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-background border-input group-hover:border-primary/50"
              }`}
            >
              {isConfirmed && <Check className="w-3.5 h-3.5" />}
            </div>
          </div>
          <span className="text-sm font-medium text-foreground leading-relaxed select-none">
            I understand that this account will become inactive.
          </span>
          <input
            type="checkbox"
            className="sr-only"
            checked={isConfirmed}
            onChange={(e) => setIsConfirmed(e.target.checked)}
          />
        </label>
      </div>

      {/* Action Buttons */}
      <div className="bg-accent/20 border-t border-border p-5 sm:px-8 sm:py-5 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => navigate(`/users/${user.id}`, { replace: true })}
          className="w-full sm:w-auto px-6 py-2.5 bg-transparent hover:bg-accent text-foreground text-sm font-medium rounded-xl border border-transparent hover:border-border transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!isConfirmed}
          onClick={onOpenModal}
          className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-red-600 text-white text-sm font-semibold rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-card cursor-pointer"
        >
          Deactivate User
        </button>
      </div>
    </div>
  );
}
