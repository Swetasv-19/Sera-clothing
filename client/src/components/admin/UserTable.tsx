"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import api from "@/lib/axios";
import UserModal from "./UserModal";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(
        `/admin/users?search=${searchTerm}&page=${page}&limit=10`,
      );
      setUsers(data.data);
      setTotalPages(data.pages);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, searchTerm]);

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/admin/users/${id}/status`, { isActive: !currentStatus });
      fetchUsers();
    } catch (err) {
      console.error("Error updating user status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      try {
        await api.delete(`/admin/users/${id}`);
        fetchUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  return (
    <div className="margin-top-lg padding-around bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] shadow-sm overflow-hidden transition-colors duration-300 block">
      <div className="p-6 border-b border-[var(--card-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="margin-bottom relative flex-1 max-w-md group">
          <Icon
            icon="material-symbols:search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-[var(--accent-primary)] transition-colors"
          />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="padding-around-s input-box w-full pl-10 pr-4 py-2 bg-[var(--surface-alt)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all text-[var(--foreground)]"
          />
        </div>

        <button
          onClick={handleAdd}
          className="padding-around-s margin-bottom flex items-center gap-2 px-5 py-2 text-sm font-semibold text-gray-300 bg-transparent border border-[var(--card-border)] hover:border-gray-500 hover:text-white rounded-md transition-all duration-200"
        >
          <Icon
            icon="material-symbols:add"
            className="text-[18px] opacity-80"
          />
          <span>Add User</span>
        </button>
      </div>

      <div className="margin-top overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[var(--surface)]">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider border-b border-[var(--card-border)]">
                User
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider border-b border-[var(--card-border)]">
                Role
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider border-b border-[var(--card-border)]">
                Joined
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider border-b border-[var(--card-border)]">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider text-right border-b border-[var(--card-border)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--card-border)]">
            {isLoading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="px-6 py-6">
                    <div className="h-6 bg-[var(--surface-alt)] rounded w-full" />
                  </td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-[var(--muted)] font-medium"
                >
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user: any) => (
                <tr
                  key={user._id}
                  className="group hover:bg-[var(--surface-alt)] transition-colors border-b border-[var(--card-border)] border-radius-lg"
                >
                  <td className="padding-around">
                    <div className="flex flex-col">
                      <span className="font-bold text-[var(--foreground)] leading-tight">
                        {user.name}
                      </span>
                      <span className="text-xs text-[var(--muted)]">
                        {user.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`padding-around-s px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                        user.role === "admin"
                          ? "bg-[var(--accent-primary)] text-white border-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-primary)]/20"
                          : "bg-[var(--surface-alt)] text-[var(--foreground)] border-[var(--card-border)]"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[var(--muted)] text-sm font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(user._id, user.isActive)}
                      className={`flex items-center space-x-2 p-1 px-2 rounded-lg transition-all ${
                        user.isActive
                          ? "text-emerald-500 hover:bg-emerald-500/10"
                          : "text-rose-500 hover:bg-rose-500/10"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${user.isActive ? "bg-[var(--accent-primary)] shadow-[0_0_8px_var(--accent-primary)]" : "bg-rose-500"}`}
                      />
                      <span className="text-xs font-bold uppercase tracking-tighter">
                        {user.isActive ? "Active" : "Banned"}
                      </span>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-alt)] rounded-lg transition-all"
                        title="Edit"
                      >
                        <Icon
                          icon="material-symbols:edit-outline"
                          className="text-xl"
                        />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 text-[var(--muted)] hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Icon
                          icon="material-symbols:delete-outline"
                          className="text-xl"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="p-6 border-t border-[var(--card-border)] flex items-center justify-between bg-[var(--card-bg)]">
          <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center space-x-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-alt)] disabled:opacity-30 transition-all rounded-lg"
            >
              <Icon icon="material-symbols:chevron-left" className="text-2xl" />
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-alt)] disabled:opacity-30 transition-all rounded-lg"
            >
              <Icon
                icon="material-symbols:chevron-right"
                className="text-2xl"
              />
            </button>
          </div>
        </div>
      )}

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchUsers}
        user={selectedUser}
      />
    </div>
  );
};

export default UserTable;
