/**
 * CampusFlow Student Module — useStudentDetails Hook
 * 
 * Fetches and maintains state for a single student record.
 * Handles loading, error states, and cache invalidation/refresh after edits.
 */

import { useState, useEffect, useCallback } from "react";
import { AxiosError } from "axios";
import { getStudentById, getMyStudentProfile } from "../services/student.service";
import { Student } from "../types/student.types";

export interface UseStudentDetailsReturn {
  student: Student | null;
  loading: boolean;
  error: string | null;
  refreshStudent: () => Promise<void>;
}

export const useStudentDetails = (
  studentId: string | undefined,
): UseStudentDetailsReturn => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudent = useCallback(async () => {
    if (!studentId) {
      setError("No student ID specified");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = studentId === "me"
        ? await getMyStudentProfile()
        : await getStudentById(studentId);
      setStudent(data);
    } catch (err: unknown) {
      console.error("Failed to load student details:", err);
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) {
          setError(err.response?.data?.message || "Student not found");
        } else if (err.response?.status === 403) {
          setError(err.response?.data?.message || "Not allowed to view this Student");
        } else if (err.response?.status === 401) {
          setError("Authentication required to view this student profile");
        } else {
          setError(err.response?.data?.message || "Unable to load student information");
        }
      } else {
        setError("Unable to load student information");
      }
      setStudent(null);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  return {
    student,
    loading,
    error,
    refreshStudent: fetchStudent,
  };
};
