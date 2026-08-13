import React from "react";
import { Link } from "react-router";
import { 
  Users, 
  UserCheck, 
  UserX, 
  UserMinus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Plus, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Eye
} from "lucide-react";

// GET /api/users
// Admin-only paginated list of user accounts with search, role filtering, and status filtering.
export default function UserManagementPage(): React.JSX.Element {
  // Static visual states
  const isLoading = false;
  const isEmpty = false;

  const dummyUsers = [
    { id: "USR-001", name: "Ashu Patel", email: "ashu@example.com", role: "Student", status: "Active", verified: true, joined: "Aug 12, 2026", avatar: "AP" },
    { id: "USR-002", name: "Rahul Sharma", email: "rahul.s@example.com", role: "Student", status: "Active", verified: true, joined: "Aug 10, 2026", avatar: "RS" },
    { id: "USR-003", name: "Priya Shah", email: "priya.shah@campus.edu", role: "Faculty", status: "Active", verified: true, joined: "Jul 22, 2026", avatar: "PS" },
    { id: "USR-004", name: "Admin User", email: "admin@campus.edu", role: "Admin", status: "Active", verified: true, joined: "Jan 15, 2026", avatar: "AU" },
    { id: "USR-005", name: "Neha Joshi", email: "neha.j@example.com", role: "Student", status: "Suspended", verified: false, joined: "Aug 14, 2026", avatar: "NJ" },
    { id: "USR-006", name: "Amit Mehta", email: "amit.m@campus.edu", role: "Faculty", status: "Inactive", verified: true, joined: "May 05, 2026", avatar: "AM" },
    { id: "USR-007", name: "Riya Desai", email: "riya.d@example.com", role: "Student", status: "Active", verified: true, joined: "Aug 15, 2026", avatar: "RD" },
    { id: "USR-008", name: "Karan Patel", email: "karan.p@example.com", role: "Student", status: "Active", verified: true, joined: "Aug 15, 2026", avatar: "KP" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Users
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            Manage and monitor CampusFlow user accounts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            className="p-2.5 text-muted-foreground hover:text-foreground bg-card border border-border rounded-xl shadow-sm hover:border-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            aria-label="Refresh user list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {/* UI placeholder button - User creation is handled via Auth signup / backend onboarding */}
          <button 
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-xl shadow-sm shadow-primary/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      {/* 2. SUMMARY STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Users</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="text-3xl font-bold text-foreground">247</div>
        </div>
        
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Users</span>
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="text-3xl font-bold text-foreground">218</div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Suspended</span>
            <UserX className="w-4 h-4" />
          </div>
          <div className="text-3xl font-bold text-foreground">17</div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Inactive</span>
            <UserMinus className="w-4 h-4" />
          </div>
          <div className="text-3xl font-bold text-foreground">12</div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm flex flex-col">
        
        {/* 3. USER LIST TOOLBAR */}
        <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72 lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground text-foreground"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select className="w-full sm:w-36 px-3 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground cursor-pointer">
              <option value="" className="bg-card text-foreground">All roles</option>
              <option value="admin" className="bg-card text-foreground">Admin</option>
              <option value="faculty" className="bg-card text-foreground">Faculty</option>
              <option value="student" className="bg-card text-foreground">Student</option>
            </select>
            
            <select className="w-full sm:w-36 px-3 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground cursor-pointer">
              <option value="" className="bg-card text-foreground">All statuses</option>
              <option value="active" className="bg-card text-foreground">Active</option>
              <option value="suspended" className="bg-card text-foreground">Suspended</option>
              <option value="inactive" className="bg-card text-foreground">Inactive</option>
            </select>

            <button className="p-2.5 text-muted-foreground hover:text-foreground bg-accent/50 hover:bg-accent border border-transparent rounded-xl transition-all sm:hidden lg:block">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-5 space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-border/50">
                <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-3 bg-muted rounded w-1/5" />
                </div>
                <div className="hidden sm:block h-6 bg-muted rounded-full w-20" />
                <div className="hidden lg:block h-6 bg-muted rounded-full w-24" />
                <div className="h-8 w-8 bg-muted rounded-md shrink-0" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {isEmpty && !isLoading && (
          <div className="py-24 flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No users found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}

        {/* 4. USER TABLE */}
        {!isLoading && !isEmpty && (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="px-5 py-3.5 font-medium">User</th>
                  <th className="px-5 py-3.5 font-medium">Email</th>
                  <th className="px-5 py-3.5 font-medium">Role</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 font-medium">Email Verification</th>
                  <th className="px-5 py-3.5 font-medium">Joined</th>
                  <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-sm">
                {dummyUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-5 py-4">
                      <Link to={`/users/${user.id}`} className="flex items-center gap-3 group/user">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                          {user.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground group-hover/user:text-primary transition-colors">
                            {user.name}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {user.id}
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        user.role === 'Admin' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' :
                        user.role === 'Faculty' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' :
                        'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                        user.status === 'Suspended' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20' :
                        'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          user.status === 'Active' ? 'bg-emerald-500' :
                          user.status === 'Suspended' ? 'bg-amber-500' :
                          'bg-slate-500'
                        }`} />
                        {user.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        {user.verified ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-foreground">Verified</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-muted-foreground">Unverified</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground text-sm">
                      {user.joined}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link 
                        to={`/users/${user.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 6. PAGINATION UI */}
        <div className="p-4 sm:px-5 sm:py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm bg-muted/10 rounded-b-2xl">
          <div className="text-muted-foreground">
            Showing <span className="font-medium text-foreground">1</span> to <span className="font-medium text-foreground">8</span> of <span className="font-medium text-foreground">247</span> users
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md bg-primary text-primary-foreground font-medium shadow-sm shadow-primary/20">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition-colors">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition-colors">
              3
            </button>
            <span className="px-1 text-muted-foreground">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition-colors">
              31
            </button>
            <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
