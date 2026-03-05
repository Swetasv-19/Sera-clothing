"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import api from "@/lib/axios";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md group">
          <Icon
            icon="material-symbols:search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors"
          />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="px-6 py-8">
                    <div className="h-6 bg-gray-100 rounded-lg w-full" />
                  </td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-400 font-medium"
                >
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user: any) => (
                <tr
                  key={user._id}
                  className="group hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 leading-tight">
                        {user.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {user.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                        user.role === "admin"
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-600 border-gray-200/50"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(user._id, user.isActive)}
                      className={`flex items-center space-x-2 p-1 px-2 rounded-lg transition-all ${
                        user.isActive
                          ? "text-emerald-600 hover:bg-emerald-50"
                          : "text-rose-600 hover:bg-rose-50"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${user.isActive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-rose-500"}`}
                      />
                      <span className="text-xs font-bold uppercase tracking-tighter">
                        {user.isActive ? "Active" : "Banned"}
                      </span>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
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
        <div className="p-6 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center space-x-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 disabled:opacity-30 transition-all rounded-lg"
            >
              <Icon icon="material-symbols:chevron-left" className="text-2xl" />
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 disabled:opacity-30 transition-all rounded-lg"
            >
              <Icon
                icon="material-symbols:chevron-right"
                className="text-2xl"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
