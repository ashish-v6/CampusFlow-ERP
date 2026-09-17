/**
 * CampusFlow Faculty Module — useFacultyDetails Hook
 * 
 * Fetches and maintains state for a single faculty record.
 * Handles loading, error states, and cache invalidation/refresh after edits.
 */

import { useState, useEffect, useCallback } from "react";
import { AxiosError } from "axios";
import { getFacultyById } from "../services/faculty.service";
import { Faculty } from "../types/faculty.types";

export interface UseFacultyDetailsReturn {
  faculty: Faculty | null;
  loading: boolean;
  error: string | null;
  refreshFaculty: () => Promise<void>;
}

export const useFacultyDetails = (
  facultyId: string | undefined,
): UseFacultyDetailsReturn => {
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFaculty = useCallback(async () => {
    if (!facultyId) {
      setError("No faculty ID specified");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getFacultyById(facultyId);
      setFaculty(data);
    } catch (err: unknown) {
      console.error("Failed to load faculty details:", err);
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) {
          setError(err.response?.data?.message || "Faculty record not found");
        } else if (err.response?.status === 403) {
          setError(err.response?.data?.message || "Not authorized to view this faculty profile");
        } else if (err.response?.status === 401) {
          setError("Authentication required to view this faculty profile");
        } else {
          setError(err.response?.data?.message || "Unable to load faculty information");
        }
      } else {
        setError("Unable to load faculty information");
      }
      setFaculty(null);
    } finally {
      setLoading(false);
    }
  }, [facultyId]);

  useEffect(() => {
    fetchFaculty();
  }, [fetchFaculty]);

  return {
    faculty,
    loading,
    error,
    refreshFaculty: fetchFaculty,
  };
};
