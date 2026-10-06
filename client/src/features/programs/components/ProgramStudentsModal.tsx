import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";
import { X, Users, Search, ArrowUpRight, GraduationCap } from "lucide-react";
import { Program, ProgramStudentSummary } from "../types/program.types";

interface ProgramStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: Program;
}

export default function ProgramStudentsModal({
  isOpen,
  onClose,
  program,
}: ProgramStudentsModalProps): React.JSX.Element | null {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const students: ProgramStudentSummary[] = program.students || [];

  const filteredStudents = students.filter((s) => {
    const fullName = `${s.user.firstName} ${s.user.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return (
      fullName.includes(query) ||
      s.studentId.toLowerCase().includes(query) ||
      s.user.email.toLowerCase().includes(query)
    );
  });

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
                Enrolled Students
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {students.length}
                </span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {program.name} <span className="font-mono font-semibold">({program.code})</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Search Bar */}
        {students.length > 0 && (
          <div className="p-4 border-b border-border bg-muted/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students by name, ID, or email..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground text-foreground"
              />
            </div>
          </div>
        )}

        {/* Students Table or Empty State */}
        <div className="overflow-y-auto flex-1 p-0">
          {students.length === 0 ? (
            <div className="py-14 px-4 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">No Students Enrolled</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                There are currently no students enrolled under this academic program.
              </p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <p className="text-sm text-muted-foreground">No students match your search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-border bg-muted/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="px-5 py-3 font-medium">Student</th>
                    <th className="px-5 py-3 font-medium">Student ID</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium text-right">Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-sm">
                  {filteredStudents.map((s) => {
                    const initials = `${s.user.firstName.charAt(0)}${s.user.lastName.charAt(0)}`.toUpperCase();
                    const isActive = s.status === "ACTIVE";

                    return (
                      <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                        {/* Student Name & Email */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                              {initials}
                            </div>
                            <div>
                              <div className="font-semibold text-foreground text-sm">
                                {s.user.firstName} {s.user.lastName}
                              </div>
                              <div className="text-xs text-muted-foreground font-mono">
                                {s.user.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Student ID */}
                        <td className="px-5 py-3.5 font-mono text-xs">
                          <span className="px-2 py-0.5 rounded bg-muted text-foreground border border-border font-semibold font-mono">
                            {s.studentId}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${
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

                        {/* Action Link */}
                        <td className="px-5 py-3.5 text-right">
                          <Link
                            to={`/students/${s.id}`}
                            onClick={onClose}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <span>View</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
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

        {/* Modal Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-muted/10">
          <Link
            to={`/programs/${program.id}`}
            onClick={onClose}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Open Full Program Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-accent/60 hover:bg-accent text-foreground text-xs font-semibold rounded-xl border border-border transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
