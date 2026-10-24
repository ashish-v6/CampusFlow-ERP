import React from "react";
import { Link } from "react-router";
import { CheckCircle2, XCircle, Eye } from "lucide-react";
import { Users } from "../users.types";

interface UserTableProps {
  users: Array<Users>;
}

export default function UserTable({ users }: UserTableProps): React.JSX.Element {
  return (
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
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-muted/30 transition-colors group">
              <td className="px-5 py-4">
                <Link to={`/users/${user.id}`} className="flex items-center gap-3 group/user">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                    {`${user.firstName[0]}${user.lastName[0]}`}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground group-hover/user:text-primary transition-colors">
                      {user.firstName + " " + user.lastName}
                    </div>
                  </div>
                </Link>
              </td>
              <td className="px-5 py-4 text-muted-foreground">{user.email}</td>
              <td className="px-5 py-4">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    user.role === "ADMIN"
                      ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                      : user.role === "FACULTY"
                        ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
                        : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-5 py-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                    user.status === "ACTIVE"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : user.status === "INACTIVE"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20"
                        : "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      user.status === "ACTIVE"
                        ? "bg-emerald-500"
                        : user.status === "INACTIVE"
                          ? "bg-amber-500"
                          : "bg-slate-500"
                    }`}
                  />
                  {user.status}
                </span>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  {user.isVerified ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-foreground">Verified</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-muted-foreground">UnVerified</span>
                    </>
                  )}
                </div>
              </td>
              <td className="px-5 py-4 text-muted-foreground text-sm">
                {new Date(user.createdAt).toDateString()}
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
  );
}
