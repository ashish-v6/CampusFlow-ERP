import React, { useState, FormEvent, ChangeEvent } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/Auth/useAuth";

export default function ContactPage(): React.JSX.Element {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : "",
    email: user ? user.email : "",
    subject: "",
    category: "General Inquiry",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Message sent successfully! Our team will respond shortly.");
    }, 600);
  };

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
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Contact & Inquiries
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Have questions regarding system access, institutional licensing, or support? We're here to help.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Form Card */}
        <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1 border-b border-border/60 pb-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              <span>Send Us a Message</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Direct institutional inquiries to the CampusFlow administration desk.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 text-center space-y-4 bg-primary/5 border border-primary/20 rounded-2xl animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Message Received!</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Thank you for reaching out. A ticket has been dispatched to our academic support office. We typically respond within 24 business hours.
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
                className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Institutional Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@university.edu"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="category" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Inquiry Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Account & Access">Account & Access</option>
                    <option value="Attendance Roll-Call Support">Attendance Roll-Call Support</option>
                    <option value="Institutional Licensing">Institutional Licensing</option>
                    <option value="Technical Issue">Technical Bug or Issue</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Brief subject summary"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Your Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your inquiry, request, or issue with relevant details..."
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-muted-foreground resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-md shadow-primary/20 transition-all cursor-pointer disabled:opacity-60"
              >
                {loading ? "Transmitting..." : "Send Message"}
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Right: Institutional Contact Info Cards */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-foreground">Direct Campus Contacts</h3>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Support & Inquiries</div>
                  <a href="mailto:support@campusflow.edu" className="text-xs text-primary hover:underline font-mono">
                    support@campusflow.edu
                  </a>
                  <div className="text-xs text-muted-foreground mt-0.5">For account and academic assistance</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Institutional Helpdesk</div>
                  <div className="text-xs font-mono text-muted-foreground">+91 98765 00000</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Toll-free campus helpline</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Campus Headquarters</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    Central Administrative Complex, North Tower<br />
                    CampusFlow University, Suite 101
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Administrative Hours</div>
                  <div className="text-xs text-muted-foreground">
                    Monday &ndash; Friday: 9:00 AM &ndash; 6:00 PM IST<br />
                    Saturday &ndash; Sunday: Emergency On-Call
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Support Tip */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>Self-Service Portal</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Enrolled students and faculty members can directly review their attendance history,
              academic program requirements, and account credentials inside their respective dashboard portals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
