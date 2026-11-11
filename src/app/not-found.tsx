import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md bg-surface-container-low rounded-2xl p-8 border border-outline-variant/30 shadow-md flex flex-col items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
          <span className="material-symbols-outlined text-[36px]">menu_book</span>
        </div>
        <span className="text-4xl font-headline font-bold text-primary">404</span>
        <h1 className="font-headline text-xl font-bold text-on-surface">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Halaman naskah atau tautan yang Anda cari belum tersedia di perpustakaan {siteConfig.name}.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-primary-container text-on-primary hover:bg-primary transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">home</span>
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    </div>
  );
}

