import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-surface py-12 lg:py-20" id="beranda">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-12 flex flex-col gap-8 lg:gap-10">
        {/* Headline & Call to Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-8 flex flex-col gap-4">
            <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold text-on-surface tracking-tight leading-[1.2]">
              Menyalakan Semangat{" "}
              <span className="text-primary-container italic font-serif">Literasi</span> &amp; Ruang
              Imajinasi Indonesia
            </h1>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Bookers menghadirkan kurasi buku berbobot, layanan penerbitan naskah profesional, dan
              kafe ruang baca nyaman untuk mempertemukan pemikiran terbaik.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center justify-center gap-3 w-full">
            <Link
              href="/pesan"
              className="w-full max-w-[260px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-primary-container text-on-primary hover:bg-primary transition-all duration-200 shadow-[0_6px_20px_-2px_rgba(249,115,22,0.35)] transform hover:-translate-y-0.5 text-center"
            >
              <span>Pesan Paket Buku</span>
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            </Link>
            <a
              href="#kontak"
              className="w-full max-w-[260px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-white transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 border border-secondary/30 text-center group"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary group-hover:text-white transition-colors">
                stylus_note
              </span>
              <span>Konsultasi Naskah</span>
            </a>
          </div>
        </div>

        {/* Framed Hero Visual */}
        <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_16px_40px_-8px_rgba(15,23,42,0.14)] group">
          <div className="relative w-full h-[360px] sm:h-[460px] lg:h-[580px] overflow-hidden bg-surface-container-high">
            <Image
              src="/images/hero-bookstore.jpg"
              alt="Interior Ruang Baca dan Kafe Buku Bookers Senopati"
              fill
              priority
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 1320px) 100vw, 1320px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/75 via-transparent to-transparent" />
          </div>

          {/* Floating Location Badge & Highlights */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-surface/95 backdrop-blur-md text-on-surface shadow-lg border border-outline-variant/40">
              <span
                className="material-symbols-outlined text-primary-container text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                location_on
              </span>
              <span className="text-sm font-semibold">Ruang Baca Senopati, Jakarta</span>
            </div>

            <div className="hidden md:flex items-center gap-6 px-6 py-3 rounded-2xl bg-surface/90 backdrop-blur-md text-on-surface shadow-lg text-xs sm:text-sm font-medium border border-outline-variant/40">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px]">
                  local_cafe
                </span>
                <span>Kopi Artisan Spesial</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-outline" />
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px]">
                  menu_book
                </span>
                <span>Akses Membaca Bebas</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-outline" />
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px]">wifi</span>
                <span>Koneksi Riset Cepat</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

