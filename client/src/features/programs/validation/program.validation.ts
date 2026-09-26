/**
 * CampusFlow Academic Program Module — Client-Side Validation
 * 
 * Provides immediate feedback to the user prior to API requests.
 * Mirrors backend schema rules to enforce strict integrity.
 */

import { CreateProgramDto, UpdateProgramDto } from "../types/program.types";

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

const PROGRAM_CODE_REGEX = /^[A-Z0-9\-_]+$/;

/**
 * Validates the Create Program payload.
 * 
 * Rules:
 * - name: required, 2 to 100 characters
 * - code: required, 2 to 20 characters, uppercase alphanumeric (e.g. CS-BS, IT-BE)
 * - departmentId: required
 * - status: "ACTIVE" | "INACTIVE"
 */
export const validateCreateProgram = (data: CreateProgramDto): ValidationResult => {
  const errors: Record<string, string> = {};

  // 1. Program Name
  const trimmedName = data.name ? data.name.trim() : "";
  if (!trimmedName) {
    errors.name = "Program name is required";
  } else if (trimmedName.length < 2) {
    errors.name = "Program name must be at least 2 characters";
  } else if (trimmedName.length > 100) {
    errors.name = "Program name cannot exceed 100 characters";
  }

  // 2. Program Code
  const trimmedCode = data.code ? data.code.trim().toUpperCase() : "";
  if (!trimmedCode) {
    errors.code = "Program code is required";
  } else if (trimmedCode.length < 2) {
    errors.code = "Program code must be at least 2 characters";
  } else if (trimmedCode.length > 20) {
    errors.code = "Program code cannot exceed 20 characters";
  } else if (!PROGRAM_CODE_REGEX.test(trimmedCode)) {
    errors.code = "Program code must be uppercase alphanumeric (e.g. CS-BS, IT-BE)";
  }

  // 3. Department ID
  if (!data.departmentId || !data.departmentId.trim()) {
    errors.departmentId = "Department selection is required";
  }

  // 4. Status
  if (data.status && !["ACTIVE", "INACTIVE"].includes(data.status)) {
    errors.status = "Invalid status selection";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates the Update Program payload.
 */
export const validateUpdateProgram = (data: UpdateProgramDto): ValidationResult => {
  const errors: Record<string, string> = {};

  // Name
  if (data.name !== undefined) {
    const trimmed = data.name.trim();
    if (!trimmed) {
      errors.name = "Program name cannot be empty";
    } else if (trimmed.length < 2) {
      errors.name = "Program name must be at least 2 characters";
    } else if (trimmed.length > 100) {
      errors.name = "Program name cannot exceed 100 characters";
    }
  }

  // Code
  if (data.code !== undefined) {
    const trimmed = data.code.trim().toUpperCase();
    if (!trimmed) {
      errors.code = "Program code cannot be empty";
    } else if (trimmed.length < 2) {
      errors.code = "Program code must be at least 2 characters";
    } else if (trimmed.length > 20) {
      errors.code = "Program code cannot exceed 20 characters";
    } else if (!PROGRAM_CODE_REGEX.test(trimmed)) {
      errors.code = "Program code must be uppercase alphanumeric (e.g. CS-BS, IT-BE)";
    }
  }

  // Department ID
  if (data.departmentId !== undefined && !data.departmentId.trim()) {
    errors.departmentId = "Department selection cannot be empty";
  }

  // Status
  if (data.status !== undefined && !["ACTIVE", "INACTIVE"].includes(data.status)) {
    errors.status = "Invalid status selection";
  }

  // At least one field required
  const hasFields =
    (data.name !== undefined && data.name.trim().length > 0) ||
    (data.code !== undefined && data.code.trim().length > 0) ||
    (data.departmentId !== undefined && data.departmentId.trim().length > 0) ||
    data.status !== undefined;

  if (!hasFields) {
    errors.general = "At least one field must be modified";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
