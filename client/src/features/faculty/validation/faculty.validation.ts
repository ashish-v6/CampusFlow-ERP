/**
 * CampusFlow Faculty Module — Client-Side Validation
 * 
 * Provides immediate feedback to the user prior to API requests.
 * Mirrors backend schema rules to enhance user experience.
 */

import { FacultyCreateDto, FacultyUpdateDto } from "../types/faculty.types";
import { getTodayDateString, isFutureDate } from "../utils/facultyBadgeStyles";

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates the Create Faculty payload.
 * 
 * Strict Business Rules:
 * - User: required
 * - Faculty ID: required, exactly 8 characters
 * - Department: required
 * - Designation: required, non-empty, max 30 characters
 * - Joining Date: required, valid date, must NOT be in the future (joiningDate <= today)
 * - Phone: required, exactly 10 digits
 */
export const validateCreateFaculty = (data: FacultyCreateDto): ValidationResult => {
  const errors: Record<string, string> = {};
  const todayStr = getTodayDateString();

  // 1. User selector
  if (!data.userId || !data.userId.trim()) {
    errors.userId = "Please select an eligible faculty user";
  }

  // 2. Faculty ID (backend schema requires exactly 8 characters: z.string().min(8).max(8))
  const trimmedFacultyId = data.facultyId ? data.facultyId.trim() : "";
  if (!trimmedFacultyId) {
    errors.facultyId = "Faculty ID is required";
  } else if (trimmedFacultyId.length !== 8) {
    errors.facultyId = "Faculty ID must be exactly 8 characters";
  }

  // 3. Department selector
  if (!data.departmentId || !data.departmentId.trim()) {
    errors.departmentId = "Please select a department";
  }

  // 4. Designation (required, non-empty, max 30 chars)
  const trimmedDesignation = data.designation ? data.designation.trim() : "";
  if (!trimmedDesignation) {
    errors.designation = "Designation is required";
  } else if (trimmedDesignation.length > 30) {
    errors.designation = "Designation cannot exceed 30 characters";
  }

  // 5. Joining Date: Required, valid date, and MUST NOT be in the future
  if (!data.joiningDate || !data.joiningDate.trim()) {
    errors.joiningDate = "Joining date is required";
  } else if (isNaN(Date.parse(data.joiningDate))) {
    errors.joiningDate = "Please enter a valid joining date";
  } else if (isFutureDate(data.joiningDate) || data.joiningDate.split("T")[0] > todayStr) {
    errors.joiningDate = "Joining date cannot be in the future.";
  }

  // 6. Phone: Required, exactly 10 digits
  const trimmedPhone = data.phone ? data.phone.trim() : "";
  if (!trimmedPhone) {
    errors.phone = "Phone number is required";
  } else if (!/^\d{10}$/.test(trimmedPhone)) {
    errors.phone = "Phone number must be exactly 10 digits";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates the Update Faculty payload.
 * 
 * Enforces:
 * - Joining Date <= Today
 * - Designation <= 30 chars if supplied
 * - Phone: exactly 10 digits if supplied
 * - Status: ACTIVE or INACTIVE if supplied
 */
export const validateUpdateFaculty = (data: FacultyUpdateDto): ValidationResult => {
  const errors: Record<string, string> = {};
  const todayStr = getTodayDateString();

  // Department
  if (data.departmentId !== undefined && !data.departmentId.trim()) {
    errors.departmentId = "Please select a valid department";
  }

  // Designation
  if (data.designation !== undefined) {
    const trimmed = data.designation.trim();
    if (!trimmed) {
      errors.designation = "Designation cannot be empty";
    } else if (trimmed.length > 30) {
      errors.designation = "Designation cannot exceed 30 characters";
    }
  }

  // Joining Date: if provided, MUST NOT be in the future
  if (data.joiningDate !== undefined && data.joiningDate.trim()) {
    if (isNaN(Date.parse(data.joiningDate))) {
      errors.joiningDate = "Please enter a valid joining date";
    } else if (isFutureDate(data.joiningDate) || data.joiningDate.split("T")[0] > todayStr) {
      errors.joiningDate = "Joining date cannot be in the future.";
    }
  }

  // Phone: if provided, exactly 10 digits
  if (data.phone !== undefined && data.phone.trim()) {
    const trimmedPhone = data.phone.trim();
    if (!/^\d{10}$/.test(trimmedPhone)) {
      errors.phone = "Phone number must be exactly 10 digits";
    }
  }

  // Status
  if (data.status !== undefined && !["ACTIVE", "INACTIVE"].includes(data.status)) {
    errors.status = "Invalid status selection";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
