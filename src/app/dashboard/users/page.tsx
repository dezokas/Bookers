"use client";

import { useState, useEffect } from "react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role_id: string;
  role_name: string;
  status: "active" | "inactive";
  created_at: string;
}

interface RoleItem {
  id: string;
  name: string;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal State for Delete Confirmation
  const [deleteModalUser, setDeleteModalUser] = useState<UserItem | null>(null);

  // Modal State for Create New User
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRoleId, setNewUserRoleId] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  const loadData = async () => {
    try {
      const [usersRes, rolesRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/roles"),
      ]);
      const usersData = await usersRes.json();
      const rolesData = await rolesRes.json();

      if (usersData.success) setUsers(usersData.users || []);
      if (rolesData.success) {
        const loadedRoles = rolesData.roles || [];
        setRoles(loadedRoles);
        // Default role untuk akun baru adalah "user" (non-admin)
        const defaultUserRole = loadedRoles.find((r: any) => r.name === "user");
        if (defaultUserRole) setNewUserRoleId(defaultUserRole.id);
      }
    } catch {
      setMessage({ type: "error", text: "Gagal memuat data pengguna." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          password: newUserPassword,
          role_id: newUserRoleId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Gagal membuat akun pengguna." });
      } else {
        setMessage({
          type: "success",
          text: `Akun baru ${newUserName} (${newUserEmail}) berhasil dibuat.`,
        });
        setCreateModalOpen(false);
        setNewUserName("");
        setNewUserEmail("");
        setNewUserPassword("");
        loadData();
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan saat membuat akun." });
    } finally {
      setCreateLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRoleId: string) => {
    setActionLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role_id: newRoleId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Gagal mengubah role pengguna." });
      } else {
        setMessage({ type: "success", text: "Role pengguna berhasil diperbarui." });
        loadData();
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan jaringan." });
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    setActionLoading(true);
    setMessage(null);
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Gagal mengubah status pengguna." });
      } else {
        setMessage({
          type: "success",
          text: `Status pengguna berhasil diubah menjadi ${newStatus}.`,
        });
        loadData();
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan jaringan." });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteModalUser) return;
    setActionLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/users?id=${deleteModalUser.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Gagal menghapus pengguna." });
      } else {
        setMessage({ type: "success", text: "Pengguna berhasil dihapus." });
        setDeleteModalUser(null);
        loadData();
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan saat menghapus pengguna." });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl font-bold text-on-surface">Manajemen Pengguna</h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Daftar akun anggota, hak akses role, dan status keaktifan di Bookers.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface text-on-surface text-xs border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary-container"
            />
            <span className="material-symbols-outlined text-[18px] text-outline absolute left-3 top-2.5">
              search
            </span>
          </div>

          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-all shadow-sm shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>Tambah Akun Baru</span>
          </button>
        </div>
      </div>

      {/* Alert Messages */}
      {message && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 border ${
            message.type === "success"
              ? "bg-secondary-container text-on-secondary-container border-secondary/20"
              : "bg-error-container text-on-error-container border-error/20"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {message.type === "success" ? "check_circle" : "error"}
          </span>
          <span>{message.text}</span>
        </div>
      )}

      {/* Users Table Card */}
      <div className="bg-surface-container-low rounded-2xl border border-outline-variant/30 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-high/50 text-on-surface-variant font-bold uppercase tracking-wider border-b border-outline-variant/30">
              <tr>
                <th className="py-3.5 px-6">Pengguna</th>
                <th className="py-3.5 px-6">Role</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Terdaftar</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-outline">
                    <span className="material-symbols-outlined text-[28px] animate-spin">
                      progress_activity
                    </span>
                    <p className="mt-2 text-xs">Memuat data pengguna...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[32px] text-outline">
                      person_search
                    </span>
                    <p className="mt-2 font-medium">Tidak ada data pengguna yang cocok.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isAdmin = user.role_name === "admin";
                  const isActive = user.status === "active";

                  return (
                    <tr key={user.id} className="hover:bg-surface/50 transition-colors">
                      {/* Name & Email */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center font-bold text-xs shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-on-surface text-sm">{user.name}</span>
                            <span className="text-on-surface-variant text-[11px]">{user.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role Dropdown */}
                      <td className="py-4 px-6">
                        <select
                          value={user.role_id}
                          disabled={actionLoading}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg bg-surface text-xs font-semibold border border-outline-variant/40 focus:ring-1 focus:ring-primary-container"
                        >
                          {roles.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isActive
                              ? "bg-secondary-container text-on-secondary-container"
                              : "bg-surface-container-highest text-on-surface-variant"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? "bg-secondary" : "bg-outline"
                            }`}
                          />
                          <span>{isActive ? "Aktif" : "Nonaktif"}</span>
                        </span>
                      </td>

                      {/* Registered Date */}
                      <td className="py-4 px-6 text-on-surface-variant">
                        {new Date(user.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => handleStatusToggle(user.id, user.status)}
                            title={isActive ? "Nonaktifkan Akun" : "Aktifkan Akun"}
                            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {isActive ? "toggle_on" : "toggle_off"}
                            </span>
                          </button>
                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => setDeleteModalUser(user)}
                            title="Hapus Akun"
                            className="p-1.5 rounded-lg text-error hover:bg-error-container hover:text-on-error-container transition-colors disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-surface rounded-2xl max-w-sm w-full p-6 border border-outline-variant/30 shadow-xl flex flex-col gap-4">
            <div className="w-12 h-12 rounded-full bg-error-container text-on-error-container flex items-center justify-center self-start">
              <span className="material-symbols-outlined text-[24px]">warning</span>
            </div>
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface">Konfirmasi Hapus</h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                Apakah Anda yakin ingin menghapus akun <strong>{deleteModalUser.name}</strong> ({deleteModalUser.email})? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleDeleteUser}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-error text-on-error hover:bg-error/90 transition-colors shadow-xs"
              >
                {actionLoading ? "Menghapus..." : "Ya, Hapus Akun"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 border border-outline-variant/30 shadow-xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">person_add</span>
                <h3 className="font-headline text-lg font-bold text-on-surface">Buat Akun Pengguna Baru</h3>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-on-surface">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-on-surface">Alamat Email</label>
                <input
                  type="email"
                  required
                  placeholder="nama@email.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-on-surface">Kata Sandi (Password)</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Minimal 6 karakter"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-on-surface">Tingkat Role</label>
                <select
                  value={newUserRoleId}
                  onChange={(e) => setNewUserRoleId(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:ring-2 focus:ring-primary"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name === "user" ? "user (Pengguna Biasa / Bukan Admin)" : r.name}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-outline">
                  Pilih "user" untuk akun anggota biasa (bukan administrator).
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-primary text-on-primary hover:bg-primary/90 transition-colors shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">check</span>
                  <span>{createLoading ? "Menyimpan..." : "Buat Akun"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

