import React from "react";
import { UserDetails } from "../users.types";

interface UserProfileInfoCardProps {
  user: UserDetails;
}

export default function UserProfileInfoCard({ user }: UserProfileInfoCardProps): React.JSX.Element {
  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-border">
        <h3 className="text-lg font-bold text-foreground">Profile Information</h3>
      </div>
      <div className="p-5 sm:p-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              First Name
            </dt>
            <dd className="text-sm font-medium text-foreground">{user.firstName}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Last Name
            </dt>
            <dd className="text-sm font-medium text-foreground">{user.lastName}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Email
            </dt>
            <dd className="text-sm font-medium text-foreground">{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Role
            </dt>
            <dd className="text-sm font-medium text-foreground capitalize">
              {user.role.toLowerCase()}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Account Status
            </dt>
            <dd className="text-sm font-medium text-foreground">{user.status}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Email Verification
            </dt>
            <dd className="text-sm font-medium text-foreground">
              {user.isVerified ? "Verified" : "Unverified"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Member Since
            </dt>
            <dd className="text-sm font-medium text-foreground">
              {new Date(user.createdAt).toLocaleDateString()}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Last Updated
            </dt>
            <dd className="text-sm font-medium text-foreground">
              {new Date(user.updatedAt).toLocaleString()}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
