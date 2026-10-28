/**
 * CampusFlow Attendance Module — Date Utility Functions
 *
 * Dedicated timezone-safe date conversion and validation helpers.
 * Ensures the calendar date selected by the user is preserved identically
 * across the browser, frontend state, API payload ("DD-MM-YYYY"), and backend.
 */

/**
 * Returns today's date formatted as YYYY-MM-DD in local time
 * for HTML5 date input values.
 */
export const getTodayInputDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Converts a YYYY-MM-DD input string directly to DD-MM-YYYY without
 * constructing a local Date object, preventing any timezone shift.
 */
export const convertYmdToDdMmYyyy = (ymdStr: string): string => {
  if (!ymdStr) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymdStr.trim());
  if (!match) return "";
  const [, year, month, day] = match;
  return `${day}-${month}-${year}`;
};

/**
 * Converts a DD-MM-YYYY string to YYYY-MM-DD for populating HTML5 date inputs.
 */
export const convertDdMmYyyyToYmd = (ddMmYyyyStr: string): string => {
  if (!ddMmYyyyStr) return "";
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(ddMmYyyyStr.trim());
  if (!match) return "";
  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
};

export interface DateValidationResult {
  isValid: boolean;
  error?: string;
  formattedDate?: string; // DD-MM-YYYY
}

/**
 * Validates that an input date string represents a real, possible calendar date.
 * Accepts either "YYYY-MM-DD" (from date inputs) or "DD-MM-YYYY".
 * Rejects impossible dates (such as 2026-02-30 or 2026-04-31) and malformed strings.
 */
export const validateCalendarDate = (dateStr: string): DateValidationResult => {
  if (!dateStr || !dateStr.trim()) {
    return {
      isValid: false,
      error: "Attendance date is required",
    };
  }

  const trimmed = dateStr.trim();
  let day = 0;
  let month = 0;
  let year = 0;

  const ymdMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  const dmyMatch = /^(\d{2})-(\d{2})-(\d{4})$/.exec(trimmed);

  if (ymdMatch) {
    year = Number(ymdMatch[1]);
    month = Number(ymdMatch[2]);
    day = Number(ymdMatch[3]);
  } else if (dmyMatch) {
    day = Number(dmyMatch[1]);
    month = Number(dmyMatch[2]);
    year = Number(dmyMatch[3]);
  } else {
    return {
      isValid: false,
      error: "Please enter a valid date in DD-MM-YYYY or YYYY-MM-DD format",
    };
  }

  if (year < 1900 || year > 2100) {
    return {
      isValid: false,
      error: "Year must be between 1900 and 2100",
    };
  }

  if (month < 1 || month > 12) {
    return {
      isValid: false,
      error: "Month must be between 01 and 12",
    };
  }

  if (day < 1 || day > 31) {
    return {
      isValid: false,
      error: "Day must be between 01 and 31",
    };
  }

  // Validate calendar validity (e.g. leap years, 30-day months) using UTC
  const testDate = new Date(Date.UTC(year, month - 1, day));
  if (
    testDate.getUTCFullYear() !== year ||
    testDate.getUTCMonth() !== month - 1 ||
    testDate.getUTCDate() !== day
  ) {
    return {
      isValid: false,
      error: "Invalid calendar date (day does not exist in this month)",
    };
  }

  const formattedDate = `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${String(year).padStart(4, "0")}`;

  return {
    isValid: true,
    formattedDate,
  };
};

/**
 * Formats a date from the backend (which can be ISO string or DD-MM-YYYY)
 * into a user-friendly display string (e.g. "27 Oct 2026").
 * Uses UTC/string components to guarantee no timezone day-shift occurs.
 */
export const formatAttendanceDisplayDate = (dateStr?: string | null): string => {
  if (!dateStr) return "Not provided";

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Check if DD-MM-YYYY
  const dmyMatch = /^(\d{2})-(\d{2})-(\d{4})/.exec(dateStr);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const monthIndex = parseInt(dmyMatch[2], 10) - 1;
    const year = dmyMatch[3];
    return `${day} ${monthNames[monthIndex] || ""} ${year}`;
  }

  // Check if ISO string: e.g. 2026-10-27T00:00:00.000Z or YYYY-MM-DD
  const ymdMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr);
  if (ymdMatch) {
    const year = ymdMatch[1];
    const monthIndex = parseInt(ymdMatch[2], 10) - 1;
    const day = parseInt(ymdMatch[3], 10);
    return `${day} ${monthNames[monthIndex] || ""} ${year}`;
  }

  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Not provided";
    return `${d.getUTCDate()} ${monthNames[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  } catch {
    return "Not provided";
  }
};

/**
 * Formats a record's createdAt timestamp for display.
 */
export const formatDisplayDateTime = (dateTimeStr?: string | null): string => {
  if (!dateTimeStr) return "—";
  try {
    const d = new Date(dateTimeStr);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
};
