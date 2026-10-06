import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Users,
  Search,
  CheckCircle2,
  Edit3,
  ExternalLink,
  Calendar,
  X,
} from "lucide-react";
import { useAuth } from "../../../context/Auth/useAuth";
import { getProgramById } from "../services/program.service";
import { getDepartments } from "../../departments/services/department.service";
import { Program } from "../types/program.types";
import { Department } from "../../departments/types/department.types";
import { getProgramStatusStyles, getProgramInitials } from "../utils/programBadgeStyles";
import LoadingState from "../../../components/LoadingState";
import ErrorState from "../../../components/ErrorState";
import UpdateProgramModal from "../components/UpdateProgramModal";

export default function ProgramDetailsPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [program, setProgram] = useState<Program | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false);

  // Student filter states
  const [studentSearch, setStudentSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const fetchProgram = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getProgramById(id);
      setProgram(res.program);
    } catch (err: unknown) {
      console.error("Error loading program details:", err);
      setError("Unable to retrieve program details. The record may not exist.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchDepartments = useCallback(async () => {
    try {
      const res = await getDepartments({ page: 1, limit: 100 });
      setDepartments(res.departments);
    } catch (err) {
      console.error("Failed to load departments:", err);
    }
  }, []);

  useEffect(() => {
    fetchProgram();
    fetchDepartments();
  }, [fetchProgram, fetchDepartments]);

  if (loading) {
    return (
      <LoadingState
        message="Loading Program Details..."
        subtitle="Retrieving academic program curriculum and student enrollments."
      />
    );
  }

  if (error || !program) {
    return (
      <ErrorState
        title="Program Not Found"
        message={error || "Academic program could not be loaded."}
        backUrl="/programs"
        backText="Back to Programs"
        onRetry={fetchProgram}
      />
    );
  }

  const canEdit = user?.role === "ADMIN";
  const statusStyles = getProgramStatusStyles(program.status);
  const initials = getProgramInitials(program.name);
  const allStudents = program.students || [];

  const filteredStudents = allStudents.filter((s) => {
    const fullName = `${s.user.firstName} ${s.user.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(studentSearch.toLowerCase()) ||
      s.studentId.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.user.email.toLowerCase().includes(studentSearch.toLowerCase());

    const matchesStatus = statusFilter === "" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      {/* 1. TOP HEADER & BREADCRUMB */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group mb-3"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Programs</span>
          </Link>
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base border border-primary/20 shrink-0">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                  {program.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-lg bg-muted text-foreground border border-border font-mono font-semibold text-xs">
                  {program.code}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles.badge}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusStyles.dot}`} />
                  {program.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>Department: </span>
                <Link
                  to={`/departments/${program.departmentId}`}
                  className="font-medium text-foreground hover:text-primary transition-colors underline decoration-dotted"
                >
                  {program.department?.name} ({program.department?.code})
                </Link>
              </p>
            </div>
          </div>
        </div>

        {canEdit && (
          <button
            type="button"
            onClick={() => setIsUpdateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-xl shadow-sm shadow-primary/20 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Edit3 className="w-4 h-4" />
            Edit Program
          </button>
        )}
      </div>

      {/* 2. OVERVIEW METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Students Enrolled */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Enrolled Students</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold text-foreground">{allStudents.length}</div>
          <p className="text-[11px] text-muted-foreground">Active academic cohort</p>
        </div>

        {/* Department Info */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Department</span>
            <Building2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-lg font-bold text-foreground truncate">
            {program.department?.name || "Unassigned"}
          </div>
          <div className="text-[11px] text-muted-foreground font-mono">
            Code: {program.department?.code}
          </div>
        </div>

        {/* Operational Status */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Admissions Status</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-lg font-bold text-foreground">
            {program.status === "ACTIVE" ? "Open for Enrollment" : "Enrollment Closed"}
          </div>
          <p className="text-[11px] text-muted-foreground">{statusStyles.description}</p>
        </div>
      </div>

      {/* 3. ENROLLED STUDENTS LIST */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-5 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              Enrolled Students
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {allStudents.length}
              </span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              List of all students registered in this degree program.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search students..."
                className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              />
              {studentSearch && (
                <button
                  type="button"
                  onClick={() => setStudentSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        {/* Students Table */}
        {allStudents.length === 0 ? (
          <div className="py-20 px-4 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground mb-3">
              <Users className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-foreground">No Students Enrolled</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              No students are registered in this program yet. Students can be enrolled via the Student Management module.
            </p>
            <Link
              to="/students"
              className="mt-4 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-xl transition-all shadow-sm"
            >
              Go to Student Directory
            </Link>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-sm">
            No students match your search filter.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="px-5 py-3.5 font-medium">Student Name</th>
                  <th className="px-5 py-3.5 font-medium">Student ID</th>
                  <th className="px-5 py-3.5 font-medium">Email</th>
                  <th className="px-5 py-3.5 font-medium">Admission Date</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-sm">
                {filteredStudents.map((s) => {
                  const sInitials = `${s.user.firstName.charAt(0)}${s.user.lastName.charAt(0)}`.toUpperCase();
                  const isActive = s.status === "ACTIVE";

                  return (
                    <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                      {/* Name + Initials */}
                      <td className="px-5 py-3.5">
                        <Link
                          to={`/students/${s.id}`}
                          className="flex items-center gap-3 group/std"
                        >
                          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                            {sInitials}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground group-hover/std:text-primary transition-colors">
                              {s.user.firstName} {s.user.lastName}
                            </div>
                            {s.phone && (
                              <div className="text-[11px] text-muted-foreground">
                                {s.phone}
                              </div>
                            )}
                          </div>
                        </Link>
                      </td>

                      {/* Student ID */}
                      <td className="px-5 py-3.5 font-mono text-xs">
                        <span className="px-2.5 py-1 rounded bg-muted text-foreground border border-border font-semibold font-mono">
                          {s.studentId}
                        </span>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-3.5 text-xs text-muted-foreground font-mono">
                        {s.user.email}
                      </td>

                      {/* Admission Date */}
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {s.admissionDate
                              ? new Date(s.admissionDate).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            isActive
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                          />
                          {s.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          to={`/students/${s.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <span>View Profile</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Program Modal */}
      {canEdit && (
        <UpdateProgramModal
          isOpen={isUpdateOpen}
          onClose={() => setIsUpdateOpen(false)}
          onSuccess={fetchProgram}
          program={program}
          departments={departments}
        />
      )}
    </div>
  );
}
