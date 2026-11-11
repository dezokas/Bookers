"use client";

import { useState, useEffect } from "react";
import { SessionUser } from "@/lib/types";

export default function ProfileSecurityPage() {
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCurrentUser(data.user);
      })
      .catch(() => {});
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Konfirmasi kata sandi baru tidak cocok." });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Kata sandi baru minimal 6 karakter." });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Gagal mengubah kata sandi." });
      } else {
        setMessage({
          type: "success",
          text: "Kata sandi berhasil diperbarui! Mohon catat kata sandi baru Anda.",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan jaringan." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="font-headline text-2xl font-bold text-on-surface">Profil &amp; Keamanan Akun</h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Kelola kredensial akun administrator Bookers Anda.
        </p>
      </div>

      {/* Account Info Card */}
      <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-center gap-4 shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-on-primary font-bold text-xl shadow-sm">
          {currentUser?.name?.charAt(0) || "A"}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-base text-on-surface">{currentUser?.name || "Administrator"}</span>
          <span className="text-xs text-on-surface-variant">{currentUser?.email || "admin@gmail.com"}</span>
          <span className="text-[11px] font-semibold text-secondary mt-0.5 capitalize">
            Role: {currentUser?.role || "admin"}
          </span>
        </div>
      </div>

      {/* Security Warning Notice */}
      <div className="p-4 rounded-xl bg-primary-fixed/40 border border-primary/30 flex items-start gap-3">
        <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
          security
        </span>
        <div className="text-xs text-on-surface leading-relaxed">
          <strong>Perhatian:</strong> Akun admin bawaan dibuat dengan password awal <code>123456</code>. Pastikan Anda menggantinya dengan kombinasi yang kuat dan aman sebelum situs dipublikasikan ke production.
        </div>
      </div>

      {/* Status Alert */}
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

      {/* Change Password Form */}
      <div className="p-6 sm:p-8 rounded-2xl bg-surface-container-low border border-outline-variant/30 shadow-xs flex flex-col gap-5">
        <h2 className="font-headline text-lg font-bold text-on-surface">Ganti Kata Sandi</h2>

        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface">Kata Sandi Saat Ini</label>
            <input
              type="password"
              required
              placeholder="Masukkan kata sandi lama (cth. 123456)"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-surface text-xs border border-outline-variant/40 focus:ring-2 focus:ring-primary-container"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface">Kata Sandi Baru</label>
            <input
              type="password"
              required
              placeholder="Minimal 6 karakter kombinasi aman"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-surface text-xs border border-outline-variant/40 focus:ring-2 focus:ring-primary-container"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface">Konfirmasi Kata Sandi Baru</label>
            <input
              type="password"
              required
              placeholder="Ulangi kata sandi baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-surface text-xs border border-outline-variant/40 focus:ring-2 focus:ring-primary-container"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-fit px-6 py-3 rounded-xl text-xs font-semibold bg-primary text-on-primary hover:bg-primary-container transition-all shadow-sm mt-2 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? "Menyimpan..." : "Perbarui Kata Sandi"}
          </button>
        </form>
      </div>
    </div>
  );
}

