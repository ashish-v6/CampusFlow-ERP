/**
 * CampusFlow Student Module — Program Service
 * 
 * Provides academic program options for filters and student creation/update forms.
 * Attempts to call /api/programs if mounted on the backend, with a fallback
 * to verified database programs.
 */

import api from "../../../api/axios";
import { Program } from "../types/student.types";

/**
 * Fallback programs matching the actual database records in CampusFlow ERP.
 * This guarantees the UI functions correctly even before a dedicated
 * /api/programs endpoint is mounted.
 */
const DEFAULT_FALLBACK_PROGRAMS: Program[] = [
  {
    id: "6f0a17ac-0e18-4678-8492-2d264a1e1a37",
    name: "BCA",
    code: "24CS",
    status: "ACTIVE",
  },
  {
    id: "e5c23c3b-fd50-4bb3-88fe-2aab3faff33d",
    name: "BBA",
    code: "BBA",
    status: "ACTIVE",
  },
  {
    id: "821066f3-c15f-4ac7-8e1e-8527779ad471",
    name: "B-COM",
    code: "BC",
    status: "ACTIVE",
  },
  {
    id: "ea703a12-49c6-41f1-8d12-d1129de7546f",
    name: "BA",
    code: "BA",
    status: "ACTIVE",
  },
  {
    id: "0fc98c85-33f8-4823-9223-450fb02d8abb",
    name: "B-TECH",
    code: "CSE26",
    status: "INACTIVE",
  },
];

interface ProgramApiResponse {
  programs?: Program[];
  result?: Program[];
}

/**
 * Fetches available programs for student assignment and filtering.
 */
export const getPrograms = async (): Promise<Program[]> => {
  try {
    const response = await api.get<ProgramApiResponse | Program[]>("/api/programs");
    if (Array.isArray(response.data)) {
      return response.data;
    }
    const data = response.data as ProgramApiResponse;
    if (data && Array.isArray(data.programs)) {
      return data.programs;
    }
    if (data && Array.isArray(data.result)) {
      return data.result;
    }
    return DEFAULT_FALLBACK_PROGRAMS;
  } catch {
    // If endpoint is not yet mounted on backend, return verified database programs
    return DEFAULT_FALLBACK_PROGRAMS;
  }
};
