/**
 * CampusFlow Faculty Module — Badge & Visual Utilities
 * 
 * Reuses CampusFlow design tokens and badge colors from Student & User modules.
 */

import { FacultyStatus } from "../types/faculty.types";

export interface FacultyStatusStyle {
  badge: string;
  dot: string;
  text: string;
  description: string;
}

export const getFacultyStatusStyles = (status?: FacultyStatus | string): FacultyStatusStyle => {
  const upperStatus = status?.toUpperCase();

  switch (upperStatus) {
    case "ACTIVE":
      return {
        badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        dot: "bg-emerald-500",
        text: "text-emerald-600 dark:text-emerald-400",
        description: "Faculty member is actively serving and assigned.",
      };
    case "INACTIVE":
    default:
      return {
        badge: "bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20",
        dot: "bg-amber-500",
        text: "text-amber-600 dark:text-amber-500",
        description: "Faculty member record is inactive.",
      };
  }
};

/**
 * Returns 2-letter uppercase initials from first and last names.
 */
export const getFacultyInitials = (firstName?: string, lastName?: string): string => {
  const f = firstName ? firstName.trim().charAt(0).toUpperCase() : "";
  const l = lastName ? lastName.trim().charAt(0).toUpperCase() : "";
  return `${f}${l}` || "FC";
};

/**
 * Formats an ISO date string into a user-friendly format (e.g. "Sep 14, 2026").
 * Safeguarded against UTC/timezone shifts by extracting calendar parts directly.
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
 * Returns today's date formatted as YYYY-MM-DD in local time
 * for HTML5 date input max constraints and validation checks.
 * Always evaluated dynamically.
 */
export const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Checks if a given date string (YYYY-MM-DD or ISO) is in the future.
 */
export const isFutureDate = (dateStr: string): boolean => {
  if (!dateStr) return false;
  const rawDate = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  const todayStr = getTodayDateString();
  return rawDate > todayStr;
};
