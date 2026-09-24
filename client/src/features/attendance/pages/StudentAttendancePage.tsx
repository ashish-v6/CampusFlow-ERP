import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  ArrowLeft,
  Calendar,
  Filter,
  RefreshCw,
  AlertCircle,
  Clock,
  User,
  Edit3,
} from "lucide-react";
import { useStudentAttendanceSummary } from "../hooks/useStudentAttendanceSummary";
import { useAuth } from "../../../context/Auth/useAuth";
import StudentAttendanceSummaryCard from "../components/StudentAttendanceSummaryCard";
import EditAttendanceModal from "../components/EditAttendanceModal";
import { AttendanceRecord, AttendanceStatus } from "../types/attendance.types";
import {
  getAttendanceStatusStyles,
  formatDisplayDate,
} from "../utils/attendanceBadgeStyles";

export default function StudentAttendancePage(): React.JSX.Element {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isSelf = user?.role === "STUDENT" && (!studentId || studentId === "me");
  const canEdit = user?.role === "ADMIN" || user?.role === "FACULTY";

  const { summary, records, loading, error, refresh } =
    useStudentAttendanceSummary(isSelf ? undefined : studentId, isSelf);

  // Status filtering in history
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);

  const filteredRecords = (records || []).filter((r) => {
    if (selectedStatus === "ALL") return true;
    return r.status === selectedStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(user?.role === "STUDENT" ? "/dashboard" : "/attendance")}
            className="p-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {user?.role !== "STUDENT" && (
                <>
                  <Link to="/attendance" className="hover:text-primary transition-colors">
                    Attendance
                  </Link>
                  <span>/</span>
                </>
              )}
              <span className="text-foreground font-medium">Student Summary</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight mt-0.5">
              {isSelf ? "My Attendance Record" : "Student Attendance Record"}
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={() => refresh()}
          disabled={loading}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors cursor-pointer disabled:opacity-50 text-foreground"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Loading State */}
      {loading && !summary && (
        <div className="bg-card border border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium text-foreground">Loading attendance summary...</p>
          <p className="text-xs text-muted-foreground mt-1">Retrieving academic session records.</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-base">Error Loading Attendance Record</h3>
            <p className="text-sm mt-1">{error}</p>
            <button
              type="button"
              onClick={() => refresh()}
              className="mt-3 px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Summary Card */}
      {summary && <StudentAttendanceSummaryCard summary={summary} />}

      {/* Attendance History Table Card */}
      {summary && (
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          {/* Header & Filter Controls */}
          <div className="p-5 sm:p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">Session History</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Detailed record of marked classes and historical attendance status.
              </p>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-muted rounded-xl border border-border/60 text-xs font-medium">
              {[
                { label: "All", value: "ALL" },
                { label: "Present", value: "PRESENT" },
                { label: "Absent", value: "ABSENT" },
                { label: "Late", value: "LATE" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setSelectedStatus(tab.value)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    selectedStatus === tab.value
                      ? "bg-background text-foreground shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Records Table */}
          {filteredRecords.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">No attendance records found</p>
              <p className="text-xs text-muted-foreground mt-1">
                No classes match the selected filter criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="border-b border-border bg-muted/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="px-5 py-3.5 font-medium">Session Date</th>
                    <th className="px-5 py-3.5 font-medium">Status</th>
                    <th className="px-5 py-3.5 font-medium">Marked By</th>
                    <th className="px-5 py-3.5 font-medium">Remarks</th>
                    {canEdit && <th className="px-5 py-3.5 font-medium text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-sm">
                  {filteredRecords.map((rec) => {
                    const statusStyle = getAttendanceStatusStyles(rec.status);
                    const markerName = rec.faculty?.user
                      ? `${rec.faculty.user.firstName} ${rec.faculty.user.lastName}`
                      : "Admin / System";

                    return (
                      <tr key={rec.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-4 font-medium text-foreground whitespace-nowrap">
                          {formatDisplayDate(rec.date)}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle.badge}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                            {statusStyle.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-muted-foreground/70" />
                            <span>{markerName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-xs text-muted-foreground max-w-xs truncate">
                          {rec.remarks || "—"}
                        </td>
                        {canEdit && (
                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => setEditingRecord(rec)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Edit Attendance Record Modal */}
      {canEdit && (
        <EditAttendanceModal
          isOpen={!!editingRecord}
          onClose={() => setEditingRecord(null)}
          onSuccess={() => {
            refresh();
          }}
          record={editingRecord}
        />
      )}
    </div>
  );
}
