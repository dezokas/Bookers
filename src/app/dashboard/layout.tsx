"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { SessionUser } from "@/lib/types";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const navItems = [
    { label: "Ringkasan", href: "/dashboard", icon: "dashboard" },
    { label: "Kelola Pesanan", href: "/dashboard/orders", icon: "shopping_cart" },
    { label: "Manajemen User", href: "/dashboard/users", icon: "group" },
    { label: "Manajemen Role", href: "/dashboard/roles", icon: "badge" },
    { label: "Kelola Berita", href: "/dashboard/news", icon: "newspaper" },
    { label: "Profil & Keamanan", href: "/dashboard/profile", icon: "manage_accounts" },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col lg:flex-row">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-surface-container-low border-r border-outline-variant/30 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col">
          {/* Brand Logo Header */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-outline-variant/30">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm">
                <span className="material-symbols-outlined text-[18px]">menu_book</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline text-lg font-bold text-primary leading-tight">
                  {siteConfig.name}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-secondary">
                  Admin Panel
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-outline hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-all ${
                    isActive
                      ? "bg-primary-container text-on-primary-container shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-outline-variant/30 flex flex-col gap-2">
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors flex items-center gap-2.5 border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">public</span>
            <span>Buka Website Utama</span>
          </Link>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>{loggingOut ? "Keluar..." : "Keluar Akun"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 sticky top-0 z-30 px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface"
              aria-label="Buka Menu"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-outline">Dashboard Pengelola</span>
              <span className="text-base font-bold text-on-surface">Bookers Workspace</span>
            </div>
          </div>

          {/* User Profile Pill & Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-bold text-on-surface leading-tight">
                {currentUser?.name || "Administrator"}
              </span>
              <span className="text-xs text-on-surface-variant font-medium">
                {currentUser?.email || "admin@gmail.com"}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary font-bold shadow-sm">
              <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Keluar dari akun"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span className="hidden sm:inline">{loggingOut ? "..." : "Keluar"}</span>
            </button>
          </div>
        </header>

        {/* Page View Body */}
        <main className="p-6 lg:p-10 flex-1">{children}</main>
      </div>
    </div>
  );
}

