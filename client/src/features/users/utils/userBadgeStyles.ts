export const getRoleBadgeStyles = (role: string): string => {
  const upperRole = role?.toUpperCase();
  switch (upperRole) {
    case "ADMIN":
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
    case "FACULTY":
      return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
    case "STUDENT":
    default:
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
  }
};

export interface StatusBadgeStyle {
  badge: string;
  dot: string;
  pingDot?: string;
  text?: string;
  description?: string;
}

export const getStatusBadgeStyles = (status: string): StatusBadgeStyle => {
  const upperStatus = status?.toUpperCase();
  switch (upperStatus) {
    case "ACTIVE":
      return {
        badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        dot: "bg-emerald-500",
        pingDot: "bg-emerald-400",
        text: "text-emerald-600 dark:text-emerald-400",
        description: "This account is currently active and can access CampusFlow.",
      };
    case "INACTIVE":
      return {
        badge: "bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20",
        dot: "bg-amber-500",
        pingDot: "bg-amber-400",
        text: "text-amber-600 dark:text-amber-500",
        description: "This account is currently inactive.",
      };
    case "SUSPENDED":
    default:
      return {
        badge: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
        dot: "bg-slate-500",
        pingDot: "bg-slate-400",
        text: "text-slate-600 dark:text-slate-400",
        description: "This account is currently suspended and has restricted access.",
      };
  }
};
