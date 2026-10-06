/**
 * CampusFlow Academic Program Module — Badge & Visual Utilities
 * 
 * Reuses CampusFlow design tokens and badge colors from Department & Student modules.
 */

import { ProgramStatus } from "../types/program.types";

export interface ProgramStatusStyle {
  badge: string;
  dot: string;
  text: string;
  description: string;
}

export const getProgramStatusStyles = (
  status?: ProgramStatus | string,
): ProgramStatusStyle => {
  const upperStatus = status?.toUpperCase();

  switch (upperStatus) {
    case "ACTIVE":
      return {
        badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        dot: "bg-emerald-500",
        text: "text-emerald-600 dark:text-emerald-400",
        description: "Program is currently active and open for enrollments.",
      };
    case "INACTIVE":
    default:
      return {
        badge: "bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20",
        dot: "bg-amber-500",
        text: "text-amber-600 dark:text-amber-500",
        description: "Program is inactive; no new enrollments allowed.",
      };
  }
};

/**
 * Returns 2-letter uppercase initials from program name.
 */
export const getProgramInitials = (name?: string): string => {
  if (!name || !name.trim()) return "PR";
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
  }
  return name.trim().slice(0, 2).toUpperCase();
};
