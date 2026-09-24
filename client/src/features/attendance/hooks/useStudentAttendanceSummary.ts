/**
 * CampusFlow Attendance Module — useStudentAttendanceSummary Hook
 * 
 * Fetches attendance summary metrics and recent history for an individual student.
 */

import { useState, useEffect, useCallback } from "react";
import { getStudentSummary, getMySummary, getAttendances } from "../services/attendance.service";
import { AttendanceRecord, StudentAttendanceSummary } from "../types/attendance.types";

export interface UseStudentAttendanceSummaryReturn {
  summary: StudentAttendanceSummary | null;
  records: AttendanceRecord[] | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useStudentAttendanceSummary = (
  studentId?: string,
  isSelf: boolean = false,
): UseStudentAttendanceSummaryReturn => {
  const [summary, setSummary] = useState<StudentAttendanceSummary | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!isSelf && !studentId) {
      setError("No student ID specified");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isSelf) {
        const [sum, recs] = await Promise.all([
          getMySummary(),
          getAttendances({ limit: 50 }),
        ]);
        setSummary(sum);
        setRecords(recs.attendances);
      } else if (studentId) {
        const [sum, recs] = await Promise.all([
          getStudentSummary(studentId),
          getAttendances({ studentId, limit: 50 }),
        ]);
        setSummary(sum);
        setRecords(recs.attendances);
      }
    } catch (err: unknown) {
      console.error("Failed to load student attendance summary:", err);
      setError("Unable to load student attendance information.");
      setSummary(null);
      setRecords(null);
    } finally {
      setLoading(false);
    }
  }, [studentId, isSelf]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    summary,
    records,
    loading,
    error,
    refresh: loadData,
  };
};
