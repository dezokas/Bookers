"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { SessionUser } from "@/lib/types";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("#beranda");
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    // Cek status sesi login
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});

    const sectionIds = siteConfig.navigation.map((item) =>
      item.href.replace("#", "")
    );

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const scrollPosition = window.scrollY + 160;
      let current = `#${sectionIds[0]}`;

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            current = `#${id}`;
            break;
          } else if (scrollPosition >= top) {
            current = `#${id}`;
          }
        }
      }

      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 60
      ) {
        current = `#${sectionIds[sectionIds.length - 1]}`;
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setActiveSection(href);
    setMobileMenuOpen(false);
  };

  const isAdmin = currentUser?.role === "admin";

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-surface/95 backdrop-blur-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
          : "bg-surface/90 backdrop-blur-md"
      }`}
    >
      <div className="h-20 max-w-[1320px] mx-auto px-6 lg:px-12 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <Link
          href="#beranda"
          onClick={() => handleNavClick("#beranda")}
          className="flex items-center gap-3 shrink-0 focus-visible:outline-2 focus-visible:outline-primary rounded-lg"
        >
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm">
            <span className="material-symbols-outlined text-[20px]">menu_book</span>
          </div>
          <span className="font-headline text-2xl font-bold tracking-tight text-primary">
            {siteConfig.name}
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Navigasi Utama"
          className="hidden lg:flex items-center gap-1 xl:gap-2 px-3 py-1.5 rounded-full bg-surface-container/60 border border-outline-variant/30"
        >
          {siteConfig.navigation.map((item) => {
            const isActive = activeSection === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-primary-container text-on-primary-container shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {currentUser ? (
            <Link
              href="/pesanan-saya"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-surface-container-low text-on-surface hover:bg-surface-container transition-all border border-outline-variant/30 h-10 shadow-xs"
              title="Lihat riwayat pesanan saya"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">shopping_bag</span>
              <span>Pesanan Saya</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold bg-surface-container-low text-on-surface hover:bg-surface-container-highest transition-all duration-200 border border-outline-variant/30 h-10 shadow-xs"
            >
              Masuk
            </Link>
          )}

          <Link
            href="/pesan"
            className="inline-flex items-center gap-2 justify-center px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary-container text-on-primary hover:bg-primary transition-all duration-200 shadow-[0_4px_14px_-2px_rgba(249,115,22,0.35)] hover:shadow-none h-10"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
            <span>Pesan Buku</span>
          </Link>

          {/* User Icon Avatar Indicator */}
          <Link
            href={currentUser ? (isAdmin ? "/dashboard" : "/pesanan-saya") : "/login"}
            aria-label="Akun Pengguna"
            title={currentUser ? `Masuk sebagai ${currentUser.name} (${currentUser.role})` : "Masuk ke Akun"}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary hover:bg-primary-container transition-colors shadow-sm shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isAdmin ? "admin_panel_settings" : "person"}
            </span>
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Tutup Menu" : "Buka Menu"}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Accessible Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface/98 backdrop-blur-2xl border-b border-outline-variant/30 px-6 py-6 shadow-xl transition-all animate-fadeIn">
          <nav className="flex flex-col gap-2">
            {siteConfig.navigation.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`px-4 py-3 rounded-xl text-base font-semibold transition-colors flex items-center justify-between ${
                    isActive
                      ? "bg-primary-container text-on-primary-container shadow-sm"
                      : "text-on-surface hover:bg-surface-container"
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`material-symbols-outlined text-[18px] ${
                      isActive ? "text-on-primary-container" : "text-outline"
                    }`}
                  >
                    chevron_right
                  </span>
                </a>
              );
            })}
            <div className="pt-4 mt-2 border-t border-outline-variant/30 flex flex-col gap-2">
              <Link
                href="/pesan"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl text-center text-sm font-semibold bg-primary-container text-on-primary shadow-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                <span>Pesan Paket Buku</span>
              </Link>
              {currentUser ? (
                <>
                  <Link
                    href="/pesanan-saya"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 rounded-xl text-center text-sm font-semibold bg-surface-container-low text-on-surface border border-outline-variant/40 flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary">shopping_bag</span>
                    <span>Pesanan Saya ({currentUser.name})</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 rounded-xl text-center text-sm font-semibold bg-secondary-container text-on-secondary-container"
                    >
                      Buka Dashboard Admin
                    </Link>
                  )}
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-xl text-center text-sm font-semibold bg-surface-container-low text-on-surface border border-outline-variant/40"
                >
                  Masuk ke Akun
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
