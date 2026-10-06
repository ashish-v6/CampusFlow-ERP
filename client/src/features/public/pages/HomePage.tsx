import React from "react";
import { Link } from "react-router";
import {
  GraduationCap,
  Users,
  CalendarCheck,
  Building2,
  BookOpen,
  Shield,
  ArrowRight,
  CheckCircle2,
  Zap,
  BarChart3,
  Layers,
} from "lucide-react";
import { useAuth } from "../../../context/Auth/useAuth";

export default function HomePage(): React.JSX.Element {
  const { user } = useAuth();

  return (
    <div className="w-full flex flex-col space-y-16 sm:space-y-24 py-8 sm:py-14 animate-in fade-in duration-500">
      {/* 1. Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide uppercase shadow-sm">
          <Zap className="w-3.5 h-3.5" />
          <span>Next-Generation Academic ERP</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Empowering Higher Education with{" "}
          <span className="bg-gradient-to-r from-primary via-indigo-600 to-primary bg-clip-text text-transparent">
            Unified Campus Intelligence
          </span>
        </h1>

        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Streamline student lifecycle administration, automate faculty roll-call attendance, and
          orchestrate academic degree programs from a centralized, secure institutional portal.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 pt-2">
          {user ? (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>Access Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-card hover:bg-accent text-foreground font-semibold text-sm shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>Register Account</span>
              </Link>
            </>
          )}
        </div>

        {/* Quick Stats Banner */}
        <div className="pt-8 sm:pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">99.9%</div>
            <div className="text-xs text-muted-foreground mt-1">Roll-Call Accuracy</div>
          </div>
          <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">3 Roles</div>
            <div className="text-xs text-muted-foreground mt-1">Admin, Faculty, Student</div>
          </div>
          <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">Real-Time</div>
            <div className="text-xs text-muted-foreground mt-1">Attendance Analytics</div>
          </div>
          <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">Zero Latency</div>
            <div className="text-xs text-muted-foreground mt-1">Central Directory</div>
          </div>
        </div>
      </section>

      {/* 2. Core Modules Showcase */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Comprehensive Institutional Modules
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Everything your campus needs to manage students, educators, and curriculum.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4 hover:border-primary/40 transition-all hover:shadow-md group">
            <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Smart Attendance Engine</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Daily student attendance marking with automated rate percentage computation, status breakdowns (Present, Absent, Late), and audit logging.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4 hover:border-primary/40 transition-all hover:shadow-md group">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Student Lifecycle</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Complete student registry linked to institutional IDs, enrolled degree programs, admission dates, contact details, and attendance histories.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4 hover:border-primary/40 transition-all hover:shadow-md group">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Faculty Directory</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Manage instructional staff, professor designations, departmental attachments, and course assignments with ease.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4 hover:border-primary/40 transition-all hover:shadow-md group">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Academic Programs</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Define undergraduate and postgraduate degree curricula, link them to governing departments, and track student cohort populations.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4 hover:border-primary/40 transition-all hover:shadow-md group">
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Department Administration</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Institutional hierarchy modeling with department codes, faculty rosters, academic offerings, and status controls.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4 hover:border-primary/40 transition-all hover:shadow-md group">
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Enterprise Security</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bcrypt encryption, strict RBAC permission barriers, secure cookie sessions, and audit logging to guarantee data privacy.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Bottom Call To Action */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-primary/10 via-card to-indigo-500/10 border border-primary/20 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-lg">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
            Ready to modernize campus operations?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Experience next-generation academic resource planning. Sign in to your authorized portal or reach out to our administration team.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-md transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Sign In Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card hover:bg-accent text-foreground font-semibold text-sm transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
