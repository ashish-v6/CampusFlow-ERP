import React from "react";
import { Link } from "react-router";
import { ArrowLeft, ShieldCheck, FileText, Lock, AlertTriangle, HelpCircle } from "lucide-react";
import { useAuth } from "../../../context/Auth/useAuth";

export default function TermsPage(): React.JSX.Element {
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
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Terms of Service
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Effective Date: September 2026 &bull; CampusFlow Academic Enterprise Platform
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-8 text-foreground/90 leading-relaxed text-sm sm:text-base">
        {/* Section 1 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-foreground font-semibold text-lg">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h2>1. Acceptance of Terms</h2>
          </div>
          <p className="text-muted-foreground text-sm">
            By logging in, browsing, or utilizing the CampusFlow ERP system, all authorized
            stakeholders—including administrators, faculty staff, and enrolled students—agree to comply
            with and be bound by these Terms of Service. If you do not agree to these terms, access to the
            ERP portal will be revoked by your institution.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-foreground font-semibold text-lg">
            <Lock className="w-5 h-5 text-primary" />
            <h2>2. User Accounts & Security</h2>
          </div>
          <p className="text-muted-foreground text-sm">
            You are responsible for maintaining the confidentiality of your institutional login credentials.
            Any actions performed under your authorized session remain your institutional responsibility.
            Sharing credentials or circumventing Role-Based Access Controls (RBAC) constitutes a material
            breach of institutional policy.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-foreground font-semibold text-lg">
            <FileText className="w-5 h-5 text-primary" />
            <h2>3. Academic Data & Attendance Integrity</h2>
          </div>
          <p className="text-muted-foreground text-sm">
            CampusFlow ERP enforces strict record-keeping for attendance, departmental curricula, faculty
            allocations, and student transcripts. Faculty members marking attendance must ensure all records
            faithfully reflect classroom presence. Tampering with or misrepresenting academic records is strictly
            prohibited and subject to disciplinary action.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-foreground font-semibold text-lg">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2>4. System Availability & Acceptable Use</h2>
          </div>
          <p className="text-muted-foreground text-sm">
            CampusFlow strives to provide 99.9% platform availability. Scheduled maintenance windows will
            be communicated in advance. Users agree not to conduct load testing, unauthorized scraping,
            or denial-of-service attempts against the campus server cluster.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-foreground font-semibold text-lg">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h2>5. Revisions & Institutional Contact</h2>
          </div>
          <p className="text-muted-foreground text-sm">
            These terms may be updated periodically to comply with relevant accreditation standards and
            educational compliance frameworks. For questions regarding terms of use, contact your campus
            system administrator at{" "}
            <a
              href="mailto:admin@campusflow-erp.edu"
              className="text-primary hover:underline font-medium"
            >
              admin@campusflow-erp.edu
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
