"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState({
    usersCount: 0,
    rolesCount: 0,
    newsCount: 0,
    publishedCount: 0,
    ordersCount: 0,
    pendingOrdersCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [usersRes, rolesRes, newsRes, ordersRes] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/roles"),
          fetch("/api/news?all=true"),
          fetch("/api/orders"),
        ]);

        const usersData = await usersRes.json();
        const rolesData = await rolesRes.json();
        const newsData = await newsRes.json();
        const ordersData = await ordersRes.json();

        const users = usersData.users || [];
        const roles = rolesData.roles || [];
        const news = newsData.news || [];
        const orders = ordersData.orders || [];

        setStats({
          usersCount: users.length,
          rolesCount: roles.length,
          newsCount: news.length,
          publishedCount: news.filter((n: any) => n.status === "published").length,
          ordersCount: orders.length,
          pendingOrdersCount: orders.filter((o: any) => o.status === "menunggu_konfirmasi").length,
        });
      } catch (err) {
        console.error("Gagal memuat statistik:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex flex-col gap-8 max-w-6xl">
      {/* Welcome Banner */}
      <div className="p-6 lg:p-8 rounded-2xl bg-gradient-to-r from-primary-fixed to-surface-container border border-outline-variant/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <h1 className="font-headline text-2xl lg:text-3xl font-bold text-on-primary-fixed">
            Selamat Datang di Ruang Redaksi Bookers
          </h1>
          <p className="text-sm text-on-primary-fixed-variant max-w-2xl leading-relaxed">
            Kelola data akun pengguna, pengaturan hak akses, serta publikasi kabar sastra dan resensi buku yang terhubung ke database.
          </p>
        </div>

        <Link
          href="/dashboard/news"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-on-primary font-semibold text-sm shadow-md hover:bg-primary-container transition-all shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Tulis Berita Baru</span>
        </Link>
      </div>

      {/* Stats Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Orders Card */}
        <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between gap-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
              Total Pesanan
            </span>
            <div className="w-9 h-9 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-2xl font-bold text-on-surface">
              {loading ? "..." : stats.ordersCount}
            </span>
            <span className="text-[11px] text-on-surface-variant mt-0.5">Tiket order masuk</span>
          </div>
        </div>

        {/* Pending Orders Card */}
        <div className="p-5 rounded-2xl bg-surface-container-low border-2 border-primary/40 flex flex-col justify-between gap-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
              Perlu Konfirmasi
            </span>
            <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[18px]">pending_actions</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-2xl font-bold text-primary">
              {loading ? "..." : stats.pendingOrdersCount}
            </span>
            <span className="text-[11px] text-on-surface font-medium mt-0.5">Menunggu verifikasi QRIS</span>
          </div>
        </div>

        {/* Users Card */}
        <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between gap-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
              Pengguna
            </span>
            <div className="w-9 h-9 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">group</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-2xl font-bold text-on-surface">
              {loading ? "..." : stats.usersCount}
            </span>
            <span className="text-[11px] text-on-surface-variant mt-0.5">Akun terdaftar</span>
          </div>
        </div>

        {/* Roles Card */}
        <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between gap-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
              Role
            </span>
            <div className="w-9 h-9 rounded-xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">badge</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-2xl font-bold text-on-surface">
              {loading ? "..." : stats.rolesCount}
            </span>
            <span className="text-[11px] text-on-surface-variant mt-0.5">Role hak akses</span>
          </div>
        </div>

        {/* Total News Card */}
        <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between gap-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
              Total Berita
            </span>
            <div className="w-9 h-9 rounded-xl bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">newspaper</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-2xl font-bold text-on-surface">
              {loading ? "..." : stats.newsCount}
            </span>
            <span className="text-[11px] text-on-surface-variant mt-0.5">Kabar &amp; resensi</span>
          </div>
        </div>

        {/* Published News Card */}
        <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between gap-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
              Tayang
            </span>
            <div className="w-9 h-9 rounded-xl bg-secondary-fixed text-on-secondary-fixed-variant flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">visibility</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-2xl font-bold text-secondary">
              {loading ? "..." : stats.publishedCount}
            </span>
            <span className="text-[11px] text-on-surface-variant mt-0.5">Tayang di beranda</span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Link
          href="/dashboard/orders"
          className="p-6 rounded-2xl bg-surface-container-low border border-primary/30 hover:border-primary hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
        >
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-xs">
              <span className="material-symbols-outlined text-[22px]">shopping_cart_checkout</span>
            </div>
            <h3 className="font-bold text-base text-on-surface group-hover:text-primary transition-colors">
              Kelola Pesanan
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Verifikasi transfer QRIS pelanggan, ubah status pesanan, dan koordinasi via WhatsApp.
            </p>
          </div>
          <span className="text-xs font-bold text-primary flex items-center gap-1">
            <span>Buka Pesanan</span>
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </span>
        </Link>

        <Link
          href="/dashboard/users"
          className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 hover:border-primary hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
        >
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-primary shadow-xs">
              <span className="material-symbols-outlined text-[22px]">manage_accounts</span>
            </div>
            <h3 className="font-bold text-base text-on-surface group-hover:text-primary transition-colors">
              Manajemen Pengguna
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Cari pengguna, ubah role akun, aktifkan/nonaktifkan status akun, atau hapus anggota.
            </p>
          </div>
          <span className="text-xs font-bold text-primary flex items-center gap-1">
            <span>Buka Pengguna</span>
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </span>
        </Link>

        <Link
          href="/dashboard/roles"
          className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 hover:border-secondary hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
        >
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-secondary shadow-xs">
              <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
            </div>
            <h3 className="font-bold text-base text-on-surface group-hover:text-secondary transition-colors">
              Role &amp; Izin
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Tinjau role sistem bawaan (admin &amp; user) serta buat role baru kustom dengan izin spesifik.
            </p>
          </div>
          <span className="text-xs font-bold text-secondary flex items-center gap-1">
            <span>Buka Role</span>
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </span>
        </Link>

        <Link
          href="/dashboard/news"
          className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 hover:border-primary transition-all flex flex-col justify-between gap-4 group"
        >
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-primary-container shadow-xs">
              <span className="material-symbols-outlined text-[22px]">edit_note</span>
            </div>
            <h3 className="font-bold text-base text-on-surface group-hover:text-primary transition-colors">
              Kelola Berita &amp; Artikel
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Tulis, unggah gambar sampul lokal, edit, dan pratinjau berita sastra yang langsung terbit ke landing page.
            </p>
          </div>
          <span className="text-xs font-bold text-primary flex items-center gap-1">
            <span>Buka Redaksi</span>
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
}

