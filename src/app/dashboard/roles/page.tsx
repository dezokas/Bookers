"use client";

import { useState, useEffect } from "react";
import { Role } from "@/lib/types";

export default function RolesManagementPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal States
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalRole, setEditModalRole] = useState<Role | null>(null);
  const [deleteModalRole, setDeleteModalRole] = useState<Role | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: "read:news",
  });

  const loadRoles = async () => {
    try {
      const res = await fetch("/api/roles");
      const data = await res.json();
      if (data.success) {
        setRoles(data.roles || []);
      }
    } catch {
      setMessage({ type: "error", text: "Gagal memuat data role." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Gagal membuat role." });
      } else {
        setMessage({ type: "success", text: "Role baru berhasil ditambahkan." });
        setCreateModalOpen(false);
        setFormData({ name: "", description: "", permissions: "read:news" });
        loadRoles();
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan jaringan." });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalRole) return;
    setActionLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/roles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editModalRole.id,
          description: formData.description,
          permissions: formData.permissions,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Gagal memperbarui role." });
      } else {
        setMessage({ type: "success", text: "Role berhasil diperbarui." });
        setEditModalRole(null);
        loadRoles();
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan jaringan." });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!deleteModalRole) return;
    setActionLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/roles?id=${deleteModalRole.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Gagal menghapus role." });
      } else {
        setMessage({ type: "success", text: "Role berhasil dihapus." });
        setDeleteModalRole(null);
        loadRoles();
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan saat menghapus role." });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl font-bold text-on-surface">Manajemen Role</h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Konfigurasi tingkatan hak akses dan permission pengguna.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormData({ name: "", description: "", permissions: "read:news" });
            setCreateModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-container text-on-primary font-semibold text-xs shadow-sm hover:bg-primary transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Tambah Role Baru</span>
        </button>
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

      {/* Roles Table */}
      <div className="bg-surface-container-low rounded-2xl border border-outline-variant/30 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-high/50 text-on-surface-variant font-bold uppercase tracking-wider border-b border-outline-variant/30">
              <tr>
                <th className="py-3.5 px-6">Nama Role</th>
                <th className="py-3.5 px-6">Deskripsi</th>
                <th className="py-3.5 px-6">Hak Izin (Permissions)</th>
                <th className="py-3.5 px-6">Tipe Role</th>
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
                    <p className="mt-2 text-xs">Memuat data role...</p>
                  </td>
                </tr>
              ) : roles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-on-surface-variant">
                    <p className="font-medium">Belum ada role terdaftar.</p>
                  </td>
                </tr>
              ) : (
                roles.map((role) => {
                  const isSystem =
                    String(role.is_system).toLowerCase() === "true" ||
                    role.name === "admin" ||
                    role.name === "user";

                  return (
                    <tr key={role.id} className="hover:bg-surface/50 transition-colors">
                      {/* Role Name */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-primary">
                            badge
                          </span>
                          <span className="font-bold text-sm text-on-surface capitalize">
                            {role.name}
                          </span>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="py-4 px-6 text-on-surface-variant max-w-xs">
                        {role.description || "-"}
                      </td>

                      {/* Permissions */}
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1.5">
                          {role.permissions
                            .split(",")
                            .map((p, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-surface border border-outline-variant/40 font-mono text-[10px] text-on-surface"
                              >
                                {p.trim()}
                              </span>
                            ))}
                        </div>
                      </td>

                      {/* System Badge */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isSystem
                              ? "bg-secondary-container text-on-secondary-container"
                              : "bg-surface-container-highest text-on-surface-variant"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[12px]">
                            {isSystem ? "verified" : "tune"}
                          </span>
                          <span>{isSystem ? "Sistem (Terkunci)" : "Kustom"}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditModalRole(role);
                              setFormData({
                                name: role.name,
                                description: role.description || "",
                                permissions: role.permissions || "read:news",
                              });
                            }}
                            title="Edit Role"
                            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>

                          {!isSystem ? (
                            <button
                              type="button"
                              onClick={() => setDeleteModalRole(role)}
                              title="Hapus Role"
                              className="p-1.5 rounded-lg text-error hover:bg-error-container hover:text-on-error-container transition-colors"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          ) : (
                            <span
                              title="Role sistem bawaan tidak dapat dihapus"
                              className="p-1.5 text-outline/40 cursor-not-allowed"
                            >
                              <span className="material-symbols-outlined text-[18px]">lock</span>
                            </span>
                          )}
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

      {/* Modal Tambah Role */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 border border-outline-variant/30 shadow-xl flex flex-col gap-4">
            <h3 className="font-headline text-lg font-bold text-on-surface">Tambah Role Baru</h3>

            <form onSubmit={handleCreateRole} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">Nama Role (ID Unik)</label>
                <input
                  type="text"
                  required
                  placeholder="cth. editor, reviewer"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl bg-surface text-xs border border-outline-variant/40 focus:ring-2 focus:ring-primary-container"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">Deskripsi Peran</label>
                <input
                  type="text"
                  placeholder="cth. Mengelola naskah masuk dan artikel"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl bg-surface text-xs border border-outline-variant/40 focus:ring-2 focus:ring-primary-container"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">
                  Permissions (pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  placeholder="read:news,write:news"
                  value={formData.permissions}
                  onChange={(e) => setFormData({ ...formData, permissions: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl bg-surface text-xs border border-outline-variant/40 focus:ring-2 focus:ring-primary-container font-mono"
                />
                <span className="text-[10px] text-on-surface-variant">
                  Contoh: <code>read:news, write:news, manage:orders</code>
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-xs"
                >
                  {actionLoading ? "Menyimpan..." : "Simpan Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Role */}
      {editModalRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 border border-outline-variant/30 shadow-xl flex flex-col gap-4">
            <h3 className="font-headline text-lg font-bold text-on-surface">
              Ubah Role: {editModalRole.name}
            </h3>

            <form onSubmit={handleUpdateRole} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">Deskripsi Peran</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl bg-surface text-xs border border-outline-variant/40 focus:ring-2 focus:ring-primary-container"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">Permissions</label>
                <input
                  type="text"
                  value={formData.permissions}
                  onChange={(e) => setFormData({ ...formData, permissions: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl bg-surface text-xs border border-outline-variant/40 focus:ring-2 focus:ring-primary-container font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalRole(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-xs"
                >
                  {actionLoading ? "Menyimpan..." : "Perbarui Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Delete Role */}
      {deleteModalRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-surface rounded-2xl max-w-sm w-full p-6 border border-outline-variant/30 shadow-xl flex flex-col gap-4">
            <div className="w-12 h-12 rounded-full bg-error-container text-on-error-container flex items-center justify-center self-start">
              <span className="material-symbols-outlined text-[24px]">warning</span>
            </div>
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface">Konfirmasi Hapus</h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                Apakah Anda yakin ingin menghapus role <strong>{deleteModalRole.name}</strong>?
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalRole(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleDeleteRole}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-error text-on-error hover:bg-error/90 transition-colors shadow-xs"
              >
                {actionLoading ? "Menghapus..." : "Ya, Hapus Role"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

