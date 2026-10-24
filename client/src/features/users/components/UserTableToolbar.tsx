import React from "react";
import { Search, Filter } from "lucide-react";

export default function UserTableToolbar(): React.JSX.Element {
  return (
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
          <option value="" className="bg-card text-foreground">
            All roles
          </option>
          <option value="admin" className="bg-card text-foreground">
            Admin
          </option>
          <option value="faculty" className="bg-card text-foreground">
            Faculty
          </option>
          <option value="student" className="bg-card text-foreground">
            Student
          </option>
        </select>

        <select className="w-full sm:w-36 px-3 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground cursor-pointer">
          <option value="" className="bg-card text-foreground">
            All statuses
          </option>
          <option value="active" className="bg-card text-foreground">
            Active
          </option>
          <option value="suspended" className="bg-card text-foreground">
            Suspended
          </option>
          <option value="inactive" className="bg-card text-foreground">
            Inactive
          </option>
        </select>

        <button
          type="button"
          className="p-2.5 text-muted-foreground hover:text-foreground bg-accent/50 hover:bg-accent border border-transparent rounded-xl transition-all sm:hidden lg:block"
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
