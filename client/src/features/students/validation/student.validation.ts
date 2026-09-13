/**
 * CampusFlow Student Module — Client-Side Validation
 * 
 * Provides immediate feedback to the user prior to API requests.
 * Mirrors backend schema rules to enhance user experience.
 */

import { StudentCreateDto, StudentUpdateDto } from "../types/student.types";
import { getTodayDateString } from "../utils/studentBadgeStyles";

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates the Create Student payload.
 * 
 * Strict Date Business Rules:
 * - Admission Date <= Today (Admission date cannot be in the future)
 * - Date of Birth <= Today (Date of birth cannot be in the future)
 * - Date of Birth <= Admission Date (Date of birth cannot be after admission date)
 */
export const validateCreateStudent = (data: StudentCreateDto): ValidationResult => {
  const errors: Record<string, string> = {};
  const todayStr = getTodayDateString();

  // 1. User selector
  if (!data.userId || !data.userId.trim()) {
    errors.userId = "Please select an eligible student user";
  }

  // 2. Student ID (institution business ID: e.g. 2026CS001)
  const trimmedStudentId = data.studentId ? data.studentId.trim() : "";
  if (!trimmedStudentId) {
    errors.studentId = "Student ID is required";
  } else if (trimmedStudentId.length < 8) {
    errors.studentId = "Student ID must be at least 8 characters";
  } else if (trimmedStudentId.length > 16) {
    errors.studentId = "Student ID cannot exceed 16 characters";
  }

  // 3. Admission Date: Required, valid date, and MUST NOT be in the future
  if (!data.admissionDate || !data.admissionDate.trim()) {
    errors.admissionDate = "Admission date is required";
  } else if (isNaN(Date.parse(data.admissionDate))) {
    errors.admissionDate = "Please enter a valid admission date";
  } else if (data.admissionDate > todayStr) {
    errors.admissionDate = "Admission date cannot be in the future";
  }

  // 4. Program selector
  if (!data.programId || !data.programId.trim()) {
    errors.programId = "Please select an academic program";
  }

  // 5. Date of Birth (optional): valid date, and MUST NOT be in the future
  if (data.dateOfBirth && data.dateOfBirth.trim()) {
    if (isNaN(Date.parse(data.dateOfBirth))) {
      errors.dateOfBirth = "Please enter a valid date of birth";
    } else if (data.dateOfBirth > todayStr) {
      errors.dateOfBirth = "Date of birth cannot be in the future";
    }
  }

  // 6. Business rule: Date of Birth <= Admission Date <= Today
  // Therefore DOB after Admission Date is invalid
  if (
    data.dateOfBirth &&
    data.dateOfBirth.trim() &&
    data.admissionDate &&
    data.admissionDate.trim() &&
    !errors.dateOfBirth &&
    !errors.admissionDate
  ) {
    if (data.dateOfBirth > data.admissionDate) {
      errors.dateOfBirth = "Date of birth cannot be after admission date";
    }
  }

  // 7. Gender (optional)
  if (data.gender && !["MALE", "FEMALE", "OTHER"].includes(data.gender)) {
    errors.gender = "Invalid gender selection";
  }

  // 8. Phone (optional, exactly 10 digits)
  if (data.phone && data.phone.trim()) {
    const trimmedPhone = data.phone.trim();
    if (!/^\d{10}$/.test(trimmedPhone)) {
      errors.phone = "Phone number must be exactly 10 digits";
    }
  }

  // 9. Address (optional, min 8, max 40 chars)
  if (data.address && data.address.trim()) {
    const trimmedAddress = data.address.trim();
    if (trimmedAddress.length < 8) {
      errors.address = "Address must be at least 8 characters";
    } else if (trimmedAddress.length > 40) {
      errors.address = "Address cannot exceed 40 characters";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates the Update Student payload.
 * 
 * Enforces:
 * - Date of Birth <= Today
 * - Date of Birth <= Admission Date
 */
export const validateUpdateStudent = (
  data: StudentUpdateDto,
  currentAdmissionDate?: string,
): ValidationResult => {
  const errors: Record<string, string> = {};
  const todayStr = getTodayDateString();

  // Date of Birth (optional)
  if (data.dateOfBirth && data.dateOfBirth.trim()) {
    if (isNaN(Date.parse(data.dateOfBirth))) {
      errors.dateOfBirth = "Please enter a valid date of birth";
    } else if (data.dateOfBirth > todayStr) {
      errors.dateOfBirth = "Date of birth cannot be in the future";
    } else if (currentAdmissionDate) {
      const admDateStr = currentAdmissionDate.split("T")[0];
      if (data.dateOfBirth > admDateStr) {
        errors.dateOfBirth = "Date of birth cannot be after admission date";
      }
    }
  }

  // Gender (optional)
  if (data.gender && !["MALE", "FEMALE", "OTHER"].includes(data.gender)) {
    errors.gender = "Invalid gender selection";
  }

  // Phone (optional, exactly 10 digits)
  if (data.phone && data.phone.trim()) {
    const trimmedPhone = data.phone.trim();
    if (!/^\d{10}$/.test(trimmedPhone)) {
      errors.phone = "Phone number must be exactly 10 digits";
    }
  }

  // Address (optional, min 8, max 40 chars)
  if (data.address && data.address.trim()) {
    const trimmedAddress = data.address.trim();
    if (trimmedAddress.length < 8) {
      errors.address = "Address must be at least 8 characters";
    } else if (trimmedAddress.length > 40) {
      errors.address = "Address cannot exceed 40 characters";
    }
  }

  // Status (optional)
  if (data.status && !["ACTIVE", "INACTIVE"].includes(data.status)) {
    errors.status = "Invalid status selection";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
