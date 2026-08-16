import React from "react";
import { AlertTriangle } from "lucide-react";

interface DeactivateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void;
  userName: string;
  buttonState: boolean;
}

export default function DeactivateUserModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  buttonState,
}: DeactivateUserModalProps): React.JSX.Element | null {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-500 mb-4 border border-amber-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Deactivate {userName}?</h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            This will mark the account as{" "}
            <strong className="text-amber-600 dark:text-amber-500">INACTIVE</strong>. The account
            can be reactivated later by an administrator.
          </p>
        </div>
        <div className="p-4 bg-accent/30 border-t border-border flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-foreground bg-transparent hover:bg-accent rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={buttonState}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm disabled:cursor-not-allowed disabled:bg-red-600/80 cursor-pointer"
          >
            Deactivate User
          </button>
        </div>
      </div>
    </div>
  );
}
