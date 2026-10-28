/**
 * CampusFlow Attendance Module — Badge & Visual Utilities
 *
 * Provides status badges and styling tokens consistent with CampusFlow UI.
 */

import { AttendanceStatus } from "../types/attendance.types";

export interface AttendanceStatusStyle {
  badge: string;
  dot: string;
  label: string;
}

export const getAttendanceStatusStyles = (
  status: AttendanceStatus | string,
): AttendanceStatusStyle => {
  const upperStatus = status?.toUpperCase();

  switch (upperStatus) {
    case "PRESENT":
      return {
        badge:
          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        dot: "bg-emerald-500",
        label: "Present",
      };
    case "ABSENT":
      return {
        badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
        dot: "bg-rose-500",
        label: "Absent",
      };
    default:
      return {
        badge: "bg-muted text-muted-foreground border-border",
        dot: "bg-muted-foreground",
        label: status || "Unknown",
      };
  }
};

/**
 * Generates uppercase 2-letter initials from first and last names.
 */
export const getStudentInitials = (
  firstName?: string,
  lastName?: string,
): string => {
  const f = firstName ? firstName.trim().charAt(0).toUpperCase() : "";
  const l = lastName ? lastName.trim().charAt(0).toUpperCase() : "";
  return `${f}${l}` || "ST";
};
