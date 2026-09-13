/**
 * CampusFlow Student Module — Badge & Visual Utilities
 * 
 * Reuses CampusFlow design tokens and badge colors from the User Management module.
 */

import { StudentStatus } from "../types/student.types";

export interface StudentStatusStyle {
  badge: string;
  dot: string;
  text: string;
  description: string;
}

export const getStudentStatusStyles = (status: StudentStatus | string): StudentStatusStyle => {
  const upperStatus = status?.toUpperCase();

  switch (upperStatus) {
    case "ACTIVE":
      return {
        badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        dot: "bg-emerald-500",
        text: "text-emerald-600 dark:text-emerald-400",
        description: "Student is actively enrolled and eligible for academic participation.",
      };
    case "INACTIVE":
    default:
      return {
        badge: "bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20",
        dot: "bg-amber-500",
        text: "text-amber-600 dark:text-amber-500",
        description: "Student record is inactive or suspended.",
      };
  }
};

/**
 * Returns 2-letter uppercase initials from first and last names.
 */
export const getStudentInitials = (firstName?: string, lastName?: string): string => {
  const f = firstName ? firstName.trim().charAt(0).toUpperCase() : "";
  const l = lastName ? lastName.trim().charAt(0).toUpperCase() : "";
  return `${f}${l}` || "ST";
};

/**
 * Formats an ISO date string into a user-friendly format (e.g., "Aug 15, 2026").
 * Returns "Not provided" for null or undefined dates.
 */
export const formatDisplayDate = (dateStr?: string | null): string => {
  if (!dateStr) return "Not provided";
  try {
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
 */
export const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
