import React from "react";
import { Link } from "react-router";
import { ArrowLeft, Shield, Eye, Database, CheckCircle } from "lucide-react";
import { useAuth } from "../../../context/Auth/useAuth";

export default function PrivacyPolicyPage(): React.JSX.Element {
  const { user } = useAuth();

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Top Navigation / Breadcrumb */}
      <div>
        <Link
          to={user ? "/dashboard" : "/login"}
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group mb-4"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{user ? "Back to Dashboard" : "Back to Sign In"}</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Effective Date: September 2026 &bull; Student & Institutional Privacy Commitments
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-8 text-foreground/90 leading-relaxed text-sm sm:text-base">
        {/* Section 1 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-foreground font-semibold text-lg">
            <Eye className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2>1. Information We Collect</h2>
          </div>
          <p className="text-muted-foreground text-sm">
            CampusFlow ERP handles student, faculty, and administrative records on behalf of your institution.
            Collected data includes:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1.5 pl-2">
            <li>Personal Identifiers: Full name, institutional email, phone number, and mailing address.</li>
            <li>Academic Profiles: Student ID, Faculty ID, Department affiliations, and Program enrollments.</li>
            <li>Attendance & Participation: Daily attendance timestamps, status (Present, Absent, Late), and remarks.</li>
            <li>System Telemetry: Session tokens, login audit timestamps, and client user-agent data.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-foreground font-semibold text-lg">
            <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2>2. How We Safeguard Your Information</h2>
          </div>
          <p className="text-muted-foreground text-sm">
            All passwords stored within CampusFlow ERP are hashed using modern cryptographic algorithms
            (bcrypt with 10 salt rounds). All network communication is encrypted using TLS 1.3 in transit, and database
            volumes are encrypted at rest. We implement rigorous Role-Based Access Control (RBAC) to ensure that
            students can only view their own personal profiles and academic attendance metrics.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-foreground font-semibold text-lg">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2>3. Zero Third-Party Monetization</h2>
          </div>
          <p className="text-muted-foreground text-sm">
            We do not sell, rent, lease, or monetize student or faculty personal information under any
            circumstances. Data is retained strictly in accordance with academic record retention policies
            governed by your institution and state educational authorities.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-foreground font-semibold text-lg">
            <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2>4. Data Rights & Inquiries</h2>
          </div>
          <p className="text-muted-foreground text-sm">
            If you wish to review, correct, or request an audit of your personal data records, you may do so
            through the Profile module or by contacting your University Registrar and Data Protection Officer at{" "}
            <a
              href="mailto:privacy@campusflow-erp.edu"
              className="text-primary hover:underline font-medium"
            >
              privacy@campusflow-erp.edu
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
