import React from "react";
import { useAuth } from "../../../context/Auth/useAuth";
import LoadingState from "../../../components/LoadingState";
import ErrorState from "../../../components/ErrorState";
import { useDashboard } from "../hooks/useDashboard";
import DashboardHeader from "../components/DashboardHeader";
import DashboardStatCards from "../components/DashboardStatCards";
import AttendanceOverviewCard from "../components/AttendanceOverviewCard";
import RecentActivityCard from "../components/RecentActivityCard";
import FacultyDashboardView from "../components/FacultyDashboardView";
import StudentDashboardView from "../components/StudentDashboardView";

export default function DashboardPage(): React.JSX.Element {
  const { user } = useAuth();
  const {
    data,
    departments,
    loading,
    error,
    departmentFilter,
    startDate,
    endDate,
    setDepartmentFilter,
    setStartDate,
    setEndDate,
    refreshDashboard,
    resetFilters,
  } = useDashboard();

  const userFullName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.role ||
    "User";

  const hasFilters = departmentFilter !== "" || startDate !== "" || endDate !== "";
  const isStudent = user?.role?.toUpperCase() === "STUDENT";

  // 1. Initial Loading State
  if (loading && !data) {
    return (
      <LoadingState
        message="Loading ERP Dashboard..."
        subtitle="Retrieving institutional metrics, student records, and operational statistics."
      />
    );
  }

  // 2. Error State
  if (error && !data) {
    return (
      <ErrorState
        title="Failed to Load Dashboard"
        message={error}
        onRetry={refreshDashboard}
      />
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      {/* 1. Header with greeting, role badge, filters, and refresh */}
      <DashboardHeader
        userName={userFullName}
        userRole={user?.role || "USER"}
        onRefresh={refreshDashboard}
        departments={departments}
        departmentFilter={departmentFilter}
        onDepartmentChange={setDepartmentFilter}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        onResetFilters={resetFilters}
        hasFilters={hasFilters}
        canFilterDepartment={!isStudent}
      />

      {/* 2. Role-specific Dashboard Views */}
      {data && (
        <>
          {data.role === "ADMIN" && (
            <div className="space-y-6 lg:space-y-8">
              {/* 4 Summary Stat Cards */}
              <DashboardStatCards stats={data.systemStats} />

              {/* Attendance Overview Card */}
              <AttendanceOverviewCard stats={data.attendanceStats} />

              {/* Recent Activity Sections (Students, Faculty, Departments) */}
              <RecentActivityCard
                students={data.recent.students}
                faculty={data.recent.faculty}
                departments={data.recent.departments}
              />
            </div>
          )}

          {data.role === "FACULTY" && <FacultyDashboardView data={data} />}

          {data.role === "STUDENT" && <StudentDashboardView data={data} />}
        </>
      )}
    </div>
  );
}
