import React, { useEffect, useState, useCallback } from "react";
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
import CreateUserModal from "../components/CreateUserModal";

export default function UserManagementPage(): React.JSX.Element {
  const [users, setUsers] = useState<Array<Users> | null>(null);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<UserStats | null>(null);
  const [paginationDetails, setPaginationDetails] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadData = useCallback(async (isInitial = false): Promise<void> => {
    if (isInitial) {
      setLoading(true);
    } else {
      setTableLoading(true);
    }

    try {
      const [data, details] = await Promise.all([
        fetchUsers({
          page: currentPage,
          limit: 10,
          search: searchQuery.trim() || undefined,
          role: roleFilter || undefined,
          status: statusFilter || undefined,
        }),
        getUsersStatus(),
      ]);

      setUsers(data.users || []);
      setPaginationDetails(data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
      setUserDetails(details.result);
    } catch (e) {
      console.error("Error fetching users:", e);
      setUsers([]);
    } finally {
      setLoading(false);
      setTableLoading(false);
    }
  }, [currentPage, searchQuery, roleFilter, statusFilter]);

  useEffect(() => {
    loadData(users === null);
  }, [loadData]);

  const handleRefreshUser = async (): Promise<void> => {
    await loadData();
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleRoleChange = (role: string) => {
    setRoleFilter(role);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setRoleFilter("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <LoadingState
        message="Loading Users..."
        subtitle="Fetching user accounts and status statistics."
      />
    );
  }

  if (!userDetails && !users) {
    return (
      <ErrorState
        title="No Users Found"
        message="Unable to retrieve user management details."
        onRetry={() => loadData(true)}
      />
    );
  }

  const isEmpty = !tableLoading && (!users || users.length === 0);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      {/* 1. PAGE HEADER */}
      <UserManagementHeader
        onRefresh={handleRefreshUser}
        onAddUser={() => setIsCreateModalOpen(true)}
      />

      {/* 2. SUMMARY STATS */}
      {userDetails && <UserStatsCards userDetails={userDetails} />}

      <div className="bg-card border border-border rounded-2xl shadow-sm flex flex-col">
        {/* 3. USER LIST TOOLBAR */}
        <UserTableToolbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          roleFilter={roleFilter}
          onRoleChange={handleRoleChange}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
          onResetFilters={handleResetFilters}
        />

        {/* Loading State */}
        {tableLoading && (
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
        {isEmpty && (
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
        {!tableLoading && !isEmpty && users && <UserTable users={users} />}

        {/* 5. PAGINATION UI */}
        {paginationDetails && (
          <UserPagination
            paginationDetails={paginationDetails}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>

      {/* CREATE USER MODAL */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleRefreshUser}
      />
    </div>
  );
}
