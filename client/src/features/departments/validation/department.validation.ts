/**
 * CampusFlow Department Module — Client-Side Validation
 * 
 * Provides immediate feedback to the user prior to API requests.
 * Mirrors backend schema rules to enforce integrity.
 */

import { DepartmentCreateDto, DepartmentUpdateDto } from "../types/department.types";

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates the Create Department payload.
 * 
 * Rules:
 * - name: required, trimmed string, 1 to 40 characters
 * - code: required, trimmed string, 1 to 12 characters
 */
export const validateCreateDepartment = (data: DepartmentCreateDto): ValidationResult => {
  const errors: Record<string, string> = {};

  // 1. Department Name
  const trimmedName = data.name ? data.name.trim() : "";
  if (!trimmedName) {
    errors.name = "Department name is required";
  } else if (trimmedName.length > 40) {
    errors.name = "Department name cannot exceed 40 characters";
  }

  // 2. Department Code
  const trimmedCode = data.code ? data.code.trim() : "";
  if (!trimmedCode) {
    errors.code = "Department code is required";
  } else if (trimmedCode.length > 12) {
    errors.code = "Department code cannot exceed 12 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates the Update Department payload.
 */
export const validateUpdateDepartment = (data: DepartmentUpdateDto): ValidationResult => {
  const errors: Record<string, string> = {};

  // Name
  if (data.name !== undefined) {
    const trimmed = data.name.trim();
    if (!trimmed) {
      errors.name = "Department name cannot be empty";
    } else if (trimmed.length > 40) {
      errors.name = "Department name cannot exceed 40 characters";
    }
  }

  // Code
  if (data.code !== undefined) {
    const trimmed = data.code.trim();
    if (!trimmed) {
      errors.code = "Department code cannot be empty";
    } else if (trimmed.length > 12) {
      errors.code = "Department code cannot exceed 12 characters";
    }
  }

  // Status
  if (data.status !== undefined && !["ACTIVE", "INACTIVE"].includes(data.status)) {
    errors.status = "Invalid status selection";
  }

  // Must have at least one field
  const hasFields =
    (data.name !== undefined && data.name.trim().length > 0) ||
    (data.code !== undefined && data.code.trim().length > 0) ||
    data.status !== undefined;

  if (!hasFields) {
    errors.general = "At least one field must be modified";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
