import React from "react";
import { Loader2 } from "lucide-react";

export interface LoadingStateProps {
  /** Main message title (e.g., "Loading Profile...") */
  message?: string;
  /** Secondary supporting description */
  subtitle?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading...",
  subtitle = "Please wait while we retrieve the requested data.",
}) => {
  return (
    <div className="w-full min-h-[50vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        <Loader2 className="w-5 h-5 text-primary absolute animate-pulse" />
      </div>
      <h3 className="text-base font-bold text-foreground tracking-tight">{message}</h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">{subtitle}</p>
    </div>
  );
};

export default LoadingState;
