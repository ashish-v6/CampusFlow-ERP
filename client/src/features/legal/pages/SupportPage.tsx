import React, { useState, FormEvent } from "react";
import { Link } from "react-router";
import { ArrowLeft, LifeBuoy, Mail, Phone, MessageSquare, Send, CheckCircle2, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How do I reset my account password?",
    answer:
      "If you are logged in, navigate to Profile → Change Password to update your password. If you forgot your password, utilize the 'Forgot Password' link on the sign-in page to receive an OTP verification code via email.",
  },
  {
    question: "How is student attendance recorded and calculated?",
    answer:
      "Authorized faculty members mark attendance for scheduled sessions. Overall percentage is computed automatically in real-time as (Present Sessions / Total Recorded Sessions) * 100.",
  },
  {
    question: "Who can add or modify Academic Programs and Departments?",
    answer:
      "Only system users with the ADMIN role have administrative clearance to create, update, or alter status for Departments and Programs.",
  },
  {
    question: "What should I do if my student record displays incorrect department details?",
    answer:
      "Contact your academic advisor or submit a support ticket below citing your unique Student ID (e.g. STU-...) and correct departmental affiliation.",
  },
];

export default function SupportPage(): React.JSX.Element {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "General Inquiry",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success("Support ticket submitted! Ticket #CF-" + Math.floor(100000 + Math.random() * 900000));
    }, 600);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Top Navigation */}
      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group mb-4"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
            <LifeBuoy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Help & Support Center
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              CampusFlow ERP Institutional Assistance & Technical Helpdesk
            </p>
          </div>
        </div>
      </div>

      {/* Quick Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
            <Mail className="w-4 h-4" />
          </div>
          <h2 className="font-semibold text-foreground text-sm">Email Support</h2>
          <p className="text-xs text-muted-foreground">Response within 24 operational hours.</p>
          <a
            href="mailto:support@campusflow-erp.edu"
            className="text-xs font-medium text-primary hover:underline block pt-1"
          >
            support@campusflow-erp.edu
          </a>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Phone className="w-4 h-4" />
          </div>
          <h2 className="font-semibold text-foreground text-sm">Campus IT Hotline</h2>
          <p className="text-xs text-muted-foreground">Mon - Fri: 8:00 AM - 6:00 PM EST</p>
          <div className="text-xs font-mono font-medium text-foreground pt-1">+1 (800) 555-FLOW</div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-500 flex items-center justify-center border border-amber-500/20">
            <MessageSquare className="w-4 h-4" />
          </div>
          <h2 className="font-semibold text-foreground text-sm">Academic Helpdesk</h2>
          <p className="text-xs text-muted-foreground">Student records & transcript queries.</p>
          <span className="text-xs text-muted-foreground pt-1 block">Building A, Room 104</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FAQs Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-card border border-border rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 text-sm font-semibold text-foreground hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${
                        isOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Ticket Form */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-1">Submit a Support Request</h2>
          <p className="text-xs text-muted-foreground mb-5">
            Having an issue? Submit your inquiry directly to our campus tech team.
          </p>

          {submitted ? (
            <div className="py-12 flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-foreground">Request Submitted</h3>
              <p className="text-xs text-muted-foreground max-w-xs">
                Your support inquiry has been logged. An institutional representative will respond to your
                registered email shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: "",
                    email: "",
                    subject: "",
                    category: "General Inquiry",
                    message: "",
                  });
                }}
                className="mt-2 text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Jane Doe"
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. jane@institution.edu"
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Attendance Discrepancy">Attendance Discrepancy</option>
                    <option value="Account & Login Issue">Account & Login Issue</option>
                    <option value="Program/Department Issue">Program/Department Issue</option>
                    <option value="Feature Request">Feature Request</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief summary..."
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Detailed Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your issue or query..."
                  className="w-full bg-background border border-border rounded-xl p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-xl shadow-sm shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? "Sending..." : "Submit Ticket"}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
