import React, { useEffect, useState } from "react";
import { Users as UsersIcon } from "lucide-react";
import { fetchUsers, getUsersStatus } from "../service/users.service";
import LoadingState from "../../../components/LoadingState";
import ErrorState from "../../../components/ErrorState";
import { Users, Pagination, UserStats } from "../users.types";
import UserManagementHeader from "../components/UserManagementHeader";
import UserStatsCards from "../components/UserStatsCards";
import UserTableToolbar from "../components/UserTableToolbar";
import UserTable from "../components/UserTable";
import UserPagination from "../components/UserPagination";

// GET /api/users
// Admin-only paginated list of user accounts with search, role filtering, and status filtering.
export default function UserManagementPage(): React.JSX.Element {
  // Static visual states
  const [users, setUsers] = useState<Array<Users> | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [userDetails, setUserDetails] = useState<UserStats | null>(null);
  const [paginationDetails, setPaginationDetails] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const getAllUsers = async (): Promise<void> => {
    try {
      const data = await fetchUsers({ page: currentPage, limit: 10 });
      const details = await getUsersStatus();
      setUsers(data.users);
      setPaginationDetails(data.pagination);
      setUserDetails(details.result);
      setIsEmpty(false);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshUser = async (): Promise<void> => {
    await getAllUsers();
  };

  useEffect(() => {
    getAllUsers();
  }, [currentPage]);

  if (loading) {
    return (
      <LoadingState
        message="Loading Users..."
        subtitle="Fetching user accounts and status statistics."
      />
    );
  }

  if (!users || !userDetails || !paginationDetails) {
    return (
      <ErrorState
        title="No Users Found"
        message="Unable to retrieve user management details."
        onRetry={getAllUsers}
      />
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      {/* 1. PAGE HEADER */}
      <UserManagementHeader onRefresh={handleRefreshUser} />

      {/* 2. SUMMARY STATS */}
      <UserStatsCards userDetails={userDetails} />

      <div className="bg-card border border-border rounded-2xl shadow-sm flex flex-col">
        {/* 3. USER LIST TOOLBAR */}
        <UserTableToolbar />

        {/* Loading State */}
        {loading && (
          <div className="p-5 space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
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
        {isEmpty && !loading && (
          <div className="py-24 flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground mb-4">
              <UsersIcon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No users found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}

        {/* 4. USER TABLE */}
        {!loading && !isEmpty && <UserTable users={users} />}

        {/* 5. PAGINATION UI */}
        <UserPagination paginationDetails={paginationDetails} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
}
