/**
 * CampusFlow Department Module — Badge & Visual Utilities
 * 
 * Reuses CampusFlow design tokens and badge colors from User, Student & Faculty modules.
 */

import { DepartmentStatus } from "../types/department.types";

export interface DepartmentStatusStyle {
  badge: string;
  dot: string;
  text: string;
  description: string;
}

export const getDepartmentStatusStyles = (
  status?: DepartmentStatus | string,
): DepartmentStatusStyle => {
  const upperStatus = status?.toUpperCase();

  switch (upperStatus) {
    case "ACTIVE":
      return {
        badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        dot: "bg-emerald-500",
        text: "text-emerald-600 dark:text-emerald-400",
        description: "Department is active and operating.",
      };
    case "INACTIVE":
    default:
      return {
        badge: "bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20",
        dot: "bg-amber-500",
        text: "text-amber-600 dark:text-amber-500",
        description: "Department is inactive; associated programs are deactivated.",
      };
  }
};

/**
 * Returns 2-letter uppercase initials from department name.
 */
export const getDepartmentInitials = (name?: string): string => {
  if (!name || !name.trim()) return "DP";
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
  }
  return name.trim().slice(0, 2).toUpperCase();
};

/**
 * Formats an ISO date string into a user-friendly format (e.g. "Sep 17, 2026").
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
