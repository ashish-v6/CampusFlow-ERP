/**
 * CampusFlow Attendance Module — Badge & Visual Utilities
 * 
 * Reuses CampusFlow design tokens and badge colors from Student, Faculty & User modules.
 */

import { AttendanceStatus } from "../types/attendance.types";

export interface AttendanceStatusStyle {
  badge: string;
  dot: string;
  text: string;
  label: string;
}

export const getAttendanceStatusStyles = (
  status?: AttendanceStatus | string,
): AttendanceStatusStyle => {
  const upperStatus = status?.toUpperCase();

  switch (upperStatus) {
    case "PRESENT":
      return {
        badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        dot: "bg-emerald-500",
        text: "text-emerald-600 dark:text-emerald-400",
        label: "Present",
      };
    case "ABSENT":
      return {
        badge: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
        dot: "bg-red-500",
        text: "text-red-600 dark:text-red-400",
        label: "Absent",
      };
    case "LATE":
      return {
        badge: "bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20",
        dot: "bg-amber-500",
        text: "text-amber-600 dark:text-amber-500",
        label: "Late",
      };
    default:
      return {
        badge: "bg-muted text-muted-foreground border-border",
        dot: "bg-muted-foreground",
        text: "text-muted-foreground",
        label: "Unknown",
      };
  }
};

/**
 * Returns formatted 2-letter uppercase initials.
 */
export const getInitials = (firstName?: string, lastName?: string): string => {
  const f = firstName?.trim()?.charAt(0) || "";
  const l = lastName?.trim()?.charAt(0) || "";
  const initials = `${f}${l}`.toUpperCase();
  return initials || "ST";
};

/**
 * Returns today's calendar date as YYYY-MM-DD
 */
export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Formats an ISO date string into a user-friendly format (e.g. "Oct 1, 2026").
 */
export const formatDisplayDate = (dateStr?: string | null): string => {
  if (!dateStr) return "Not provided";
  try {
    const raw = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
    const parts = raw.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        const d = new Date(year, month - 1, day);
        return d.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Not provided";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Not provided";
  }
};

/**
 * Color coding for attendance percentage:
 * - >= 75%: Emerald (Good)
 * - 60% - 74%: Amber (Warning)
 * - < 60%: Red (Critical)
 */
export const getAttendancePercentageColor = (percentage: number) => {
  if (percentage >= 75) {
    return {
      text: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500",
      badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    };
  }
  if (percentage >= 60) {
    return {
      text: "text-amber-600 dark:text-amber-500",
      bg: "bg-amber-500",
      badge: "bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20",
    };
  }
  return {
    text: "text-red-600 dark:text-red-400",
    bg: "bg-red-500",
    badge: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  };
};
