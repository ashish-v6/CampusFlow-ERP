import React from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  Building2,
  GraduationCap,
  Users,
  ShieldCheck,
  Target,
  Sparkles,
  Award,
  Globe,
  HeartHandshake,
} from "lucide-react";
import { useAuth } from "../../../context/Auth/useAuth";

export default function AboutPage(): React.JSX.Element {
  const { user } = useAuth();

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-10 space-y-12 sm:space-y-16 animate-in fade-in duration-500">
      {/* 1. Header / Navigation */}
      <div>
        <Link
          to={user ? "/dashboard" : "/login"}
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group mb-4"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{user ? "Back to Dashboard" : "Back to Sign In"}</span>
        </Link>
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0 shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              About CampusFlow ERP
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Architecting the digital foundation of modern collegiate and university operations.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Our Core Mission</h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            CampusFlow ERP was engineered to eliminate fragmented administrative silos in higher
            education. By connecting student records, attendance tracking, faculty profiles, and
            degree curricula in a real-time reactive ecosystem, universities achieve unprecedented
            operational transparency and speed.
          </p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Our Institutional Vision</h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            We envision educational environments where educators spend less time on routine roll-call
            and record reconciliation, and more time mentoring scholars. Automated compliance,
            frictionless attendance, and enterprise-grade role security pave the path for future-proof learning institutions.
          </p>
        </div>
      </div>

      {/* 3. Core Values */}
      <section className="space-y-6">
        <div className="text-center sm:text-left space-y-1">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Platform Principles</h2>
          <p className="text-sm text-muted-foreground">The four foundational pillars guiding every feature we engineer.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-sm hover:border-primary/40 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-foreground text-sm">Zero-Trust Security</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every endpoint enforces strict role-based access control, cryptographic password hashing, and tokenized authorization.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-sm hover:border-primary/40 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-foreground text-sm">Precision Attendance</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Real-time attendance computation prevents record tampering and gives students instant visibility into attendance health.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-sm hover:border-primary/40 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Globe className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-foreground text-sm">Enterprise Scalability</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Engineered with modern relational databases, indexed query pathways, and reactive interfaces that scale to tens of thousands of scholars.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-sm hover:border-primary/40 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-foreground text-sm">Human-Centered UX</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Thoughtfully curated typography, dark mode optimization, and streamlined tables reduce cognitive load for administrators and educators.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Built For Stakeholders */}
      <section className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Built For Every Academic Stakeholder</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary font-semibold text-base">
              <Users className="w-5 h-5" />
              <h3>University Administrators</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Full control over user accounts, faculty assignments, departmental divisions, degree curriculum codes, and security policies.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-500 font-semibold text-base">
              <Building2 className="w-5 h-5" />
              <h3>Faculty & Instructors</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Fast daily roll-call marking, program student rosters, faculty profile oversight, and attendance history audit trails.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-500 font-semibold text-base">
              <GraduationCap className="w-5 h-5" />
              <h3>Enrolled Students</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Personal academic profiles, enrolled program tracking, real-time attendance percentages, and profile contact management.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
