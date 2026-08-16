import React from "react";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  backUrl?: string;
  backText?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message = "Unable to load data. Please check your connection or try again.",
  onRetry,
  backUrl,
  backText = "Go Back",
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-[50vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mb-4 shadow-sm">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">{title}</h2>
      <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 mb-6 max-w-sm leading-relaxed">
        {message}
      </p>
      <div className="flex items-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs sm:text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        )}
        {backUrl && (
          <button
            type="button"
            onClick={() => navigate(backUrl)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/80 text-foreground text-xs sm:text-sm font-semibold rounded-xl border border-border transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{backText}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
