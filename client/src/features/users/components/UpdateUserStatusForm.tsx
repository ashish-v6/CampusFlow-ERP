import React from "react";
import { useNavigate } from "react-router";
import { CheckCircle2, AlertTriangle, Info, Check } from "lucide-react";
import { Status } from "../users.types";

interface UpdateUserStatusFormProps {
  selectedStatus: Status;
  setSelectedStatus: (status: Status) => void;
  handleSubmit: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void;
  userId: string;
  loading: boolean;
}

export default function UpdateUserStatusForm({
  selectedStatus,
  setSelectedStatus,
  handleSubmit,
  userId,
  loading,
}: UpdateUserStatusFormProps): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-foreground">Account Status</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Choose the status that best represents the current state of this account.
          </p>
        </div>

        <div className="space-y-3">
          {/* Option: ACTIVE */}
          <label
            className={`relative flex items-start gap-4 p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all ${
              selectedStatus === "ACTIVE"
                ? "border-emerald-500 bg-emerald-500/5 shadow-sm"
                : "border-border hover:border-muted-foreground bg-card"
            }`}
          >
            <div className="pt-0.5">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedStatus === "ACTIVE"
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-muted-foreground bg-transparent"
                }`}
              >
                {selectedStatus === "ACTIVE" && <Check className="w-3 h-3 text-white" />}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-4 h-4 ${
                    selectedStatus === "ACTIVE"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-muted-foreground"
                  }`}
                />
                <span className="font-bold text-foreground text-sm">ACTIVE</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                User can access CampusFlow normally.
              </p>
            </div>
            {/* Hidden actual radio input for accessibility */}
            <input
              type="radio"
              name="status"
              value="ACTIVE"
              checked={selectedStatus === "ACTIVE"}
              onChange={() => setSelectedStatus("ACTIVE")}
              className="sr-only"
            />
          </label>

          {/* Option: SUSPENDED */}
          <label
            className={`relative flex items-start gap-4 p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all ${
              selectedStatus === "SUSPENDED"
                ? "border-slate-500 bg-slate-500/5 shadow-sm"
                : "border-border hover:border-muted-foreground bg-card"
            }`}
          >
            <div className="pt-0.5">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedStatus === "SUSPENDED"
                    ? "border-slate-500 bg-slate-500"
                    : "border-muted-foreground bg-transparent"
                }`}
              >
                {selectedStatus === "SUSPENDED" && <Check className="w-3 h-3 text-white" />}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <AlertTriangle
                  className={`w-4 h-4 ${
                    selectedStatus === "SUSPENDED"
                      ? "text-slate-600 dark:text-slate-400"
                      : "text-muted-foreground"
                  }`}
                />
                <span className="font-bold text-foreground text-sm">SUSPENDED</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                Temporarily restrict this user's access.
              </p>
            </div>
            <input
              type="radio"
              name="status"
              value="SUSPENDED"
              checked={selectedStatus === "SUSPENDED"}
              onChange={() => setSelectedStatus("SUSPENDED")}
              className="sr-only"
            />
          </label>
        </div>

        {/* 4. STATUS EXPLANATION */}
        <div className="bg-accent/30 border border-border/60 rounded-xl p-4 flex items-start gap-3 mt-6 transition-all">
          <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="text-sm text-foreground">
            {selectedStatus === "ACTIVE" && "User can access CampusFlow normally."}
            {selectedStatus === "SUSPENDED" && "Temporarily restrict this user's access."}
          </div>
        </div>
      </div>

      {/* 5. ACTION AREA */}
      <div className="bg-accent/20 border-t border-border p-5 sm:px-8 sm:py-5 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => navigate(`/users/${userId}`)}
          className="w-full sm:w-auto px-6 py-2.5 bg-transparent hover:bg-accent text-foreground text-sm font-medium rounded-xl border border-transparent hover:border-border transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-xl shadow-sm shadow-primary/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card disabled:cursor-not-allowed disabled:bg-blue-600/70 cursor-pointer"
        >
          {loading ? "Updating..." : "Update Status"}
        </button>
      </div>
    </div>
  );
}
