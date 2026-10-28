/**
 * CampusFlow Attendance Module — Client-Side Validation
 *
 * Provides immediate feedback before making API requests.
 * Enforces strict constraints for student selection, date parsing, status,
 * date ranges, and duplicate attendance detection.
 */

import { AttendanceRecord, AttendanceStatus, BulkAttendanceItem } from "../types/attendance.types";
import { convertYmdToDdMmYyyy, validateCalendarDate } from "../utils/attendanceDate.utils";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export interface AttendanceFormValidationInput {
  studentId: string;
  studentStatus?: string;
  date: string; // YYYY-MM-DD from input or DD-MM-YYYY
  status: string; // PRESENT or ABSENT
}

export interface AttendanceValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  formattedDate?: string; // DD-MM-YYYY
}

/**
 * Validates the individual Mark Attendance form submission.
 */
export const validateMarkAttendanceForm = (
  input: AttendanceFormValidationInput,
  existingRecords?: AttendanceRecord[],
): AttendanceValidationResult => {
  const errors: Record<string, string> = {};

  // 1. Student Selection Validation
  const trimmedStudentId = input.studentId ? input.studentId.trim() : "";

  if (!trimmedStudentId) {
    errors.studentId = "Please select a student";
  } else if (!UUID_REGEX.test(trimmedStudentId)) {
    errors.studentId = "Invalid student ID";
  } else if (
    input.studentStatus &&
    input.studentStatus.toUpperCase() !== "ACTIVE"
  ) {
    errors.studentId = "Cannot mark attendance for an inactive student";
  }

  // 2. Date Validation
  let validatedDateFormatted = "";
  if (!input.date || !input.date.trim()) {
    errors.date = "Attendance date is required";
  } else {
    const dateValidation = validateCalendarDate(input.date);
    if (!dateValidation.isValid) {
      errors.date = dateValidation.error || "Please enter a valid calendar date";
    } else {
      validatedDateFormatted = dateValidation.formattedDate || "";
    }
  }

  // 3. Status Validation
  const trimmedStatus = input.status ? input.status.trim().toUpperCase() : "";
  if (!trimmedStatus) {
    errors.status = "Attendance status is required";
  } else if (trimmedStatus !== "PRESENT" && trimmedStatus !== "ABSENT") {
    errors.status = "Attendance status must be either PRESENT or ABSENT";
  }

  // 4. Client-side Duplicate Detection against current records in view
  if (
    !errors.studentId &&
    !errors.date &&
    validatedDateFormatted &&
    existingRecords &&
    existingRecords.length > 0
  ) {
    const isDuplicate = existingRecords.some((record) => {
      if (record.studentId !== trimmedStudentId) return false;

      let recordDdmmyyyy = "";
      if (record.date) {
        if (/^\d{2}-\d{2}-\d{4}$/.test(record.date.trim())) {
          recordDdmmyyyy = record.date.trim();
        } else if (/^\d{4}-\d{2}-\d{2}/.test(record.date.trim())) {
          recordDdmmyyyy = convertYmdToDdMmYyyy(record.date.trim().split("T")[0]);
        }
      }

      return recordDdmmyyyy === validatedDateFormatted;
    });

    if (isDuplicate) {
      errors.date = "Attendance has already been marked for this student on this date.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    formattedDate: validatedDateFormatted,
  };
};

export interface BulkValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  formattedDate?: string;
}

/**
 * Validates the Bulk Mark Attendance form before submission.
 */
export const validateBulkAttendanceForm = (
  dateInput: string,
  records: BulkAttendanceItem[],
  inactiveStudentIds?: Set<string>,
): BulkValidationResult => {
  const errors: Record<string, string> = {};

  // 1. Validate Date
  let formattedDate = "";
  if (!dateInput || !dateInput.trim()) {
    errors.date = "Attendance date is required";
  } else {
    const dateValidation = validateCalendarDate(dateInput);
    if (!dateValidation.isValid) {
      errors.date = dateValidation.error || "Please enter a valid calendar date";
    } else {
      formattedDate = dateValidation.formattedDate || "";
    }
  }

  // 2. Validate Selected Records
  if (!records || records.length === 0) {
    errors.records = "Please select at least one student to mark attendance";
  } else {
    const seenIds = new Set<string>();

    for (let i = 0; i < records.length; i++) {
      const record = records[i];

      if (!record.studentId || !UUID_REGEX.test(record.studentId.trim())) {
        errors.records = "One or more selected students have an invalid ID";
        break;
      }

      if (seenIds.has(record.studentId)) {
        errors.records = "Duplicate student selected in bulk list";
        break;
      }
      seenIds.add(record.studentId);

      if (inactiveStudentIds && inactiveStudentIds.has(record.studentId)) {
        errors.records = "Cannot record attendance for inactive students";
        break;
      }

      if (record.status !== "PRESENT" && record.status !== "ABSENT") {
        errors.records = "Every selected student must have status PRESENT or ABSENT";
        break;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    formattedDate,
  };
};

/**
 * Validates a date range filter (fromDate and toDate).
 */
export const validateDateRange = (
  fromDateYmd?: string,
  toDateYmd?: string,
): { isValid: boolean; error?: string } => {
  if (fromDateYmd && fromDateYmd.trim()) {
    const fromCheck = validateCalendarDate(fromDateYmd);
    if (!fromCheck.isValid) {
      return { isValid: false, error: "Invalid From Date" };
    }
  }

  if (toDateYmd && toDateYmd.trim()) {
    const toCheck = validateCalendarDate(toDateYmd);
    if (!toCheck.isValid) {
      return { isValid: false, error: "Invalid To Date" };
    }
  }

  if (fromDateYmd && toDateYmd && fromDateYmd.trim() && toDateYmd.trim()) {
    if (fromDateYmd.trim() > toDateYmd.trim()) {
      return { isValid: false, error: "From Date cannot be after To Date" };
    }
  }

  return { isValid: true };
};

/**
 * Validates a status string to match AttendanceStatus
 */
export const isValidAttendanceStatus = (
  status: string,
): status is AttendanceStatus => {
  return status === "PRESENT" || status === "ABSENT";
};
