import React from "react";
import { Clock } from "lucide-react";
import { ActivityLogItem } from "../users.types";

interface UserActivityLogCardProps {
  activityLog: Array<ActivityLogItem>;
}

export default function UserActivityLogCard({
  activityLog,
}: UserActivityLogCardProps): React.JSX.Element {
  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-accent text-muted-foreground rounded-md">
          Demo
        </span>
      </div>
      <div className="p-5">
        <div className="relative border-l border-border/60 ml-3 space-y-6">
          {activityLog.map((log) => (
            <div key={log.id} className="relative pl-6">
              <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
                <div className="w-1 h-1 bg-primary rounded-full" />
              </div>
              <p className="text-sm font-medium text-foreground">{log.action}</p>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {log.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
