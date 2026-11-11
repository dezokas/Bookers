"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Gagal mendaftarkan akun.");
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-surface-container-low rounded-2xl p-8 border border-outline-variant/30 shadow-lg flex flex-col gap-6">
        <div className="flex flex-col items-center text-center gap-2">
          <Link href="/" className="flex items-center gap-2 mb-2 focus-visible:outline-none">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm">
              <span className="material-symbols-outlined text-[20px]">menu_book</span>
            </div>
            <span className="font-headline text-2xl font-bold text-primary">
              {siteConfig.name}
            </span>
          </Link>
          <h1 className="font-headline text-xl font-bold text-on-surface">Buat Akun Baru</h1>
          <p className="text-xs text-on-surface-variant">
            Bergabunglah dengan komunitas pembaca dan penulis Bookers.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-error-container text-on-error-container text-xs flex items-center gap-2 border border-error/20">
            <span className="material-symbols-outlined text-[18px] text-error">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface" htmlFor="name">
              Nama Lengkap
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="cth. Dewi Lestari"
              className="px-4 py-3 rounded-xl bg-surface text-on-surface text-sm border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface" htmlFor="email">
              Alamat Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="px-4 py-3 rounded-xl bg-surface text-on-surface text-sm border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface" htmlFor="password">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full px-4 py-3 rounded-xl bg-surface text-on-surface text-sm border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary-container transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-outline hover:text-on-surface transition-colors"
                aria-label="Lihat kata sandi"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface" htmlFor="confirmPassword">
              Konfirmasi Kata Sandi
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi kata sandi"
              className="px-4 py-3 rounded-xl bg-surface text-on-surface text-sm border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-semibold bg-primary-container text-on-primary hover:bg-primary transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">
                  progress_activity
                </span>
                <span>Mendaftarkan...</span>
              </>
            ) : (
              <>
                <span>Daftar Sekarang</span>
                <span className="material-symbols-outlined text-[18px]">person_add</span>
              </>
            )}
          </button>
        </form>

        <div className="flex flex-col items-center gap-3 pt-2 text-xs text-on-surface-variant">
          <p>
            Sudah memiliki akun?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Masuk di sini
            </Link>
          </p>
          <Link href="/" className="font-medium text-outline hover:text-on-surface flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

