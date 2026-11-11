"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "buku",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate immediate smooth feedback
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "buku", message: "" });
    }, 600);
  };

  return (
    <section className="relative w-full bg-surface py-16 lg:py-24 scroll-mt-20" id="kontak">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-12 flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col items-start gap-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant border border-primary/20">
            <span className="material-symbols-outlined text-[16px]">contact_support</span>
            <span className="text-xs font-bold uppercase tracking-wider">HUBUNGI KAMI</span>
          </div>

          <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-bold text-on-surface leading-tight">
            Mari Berkunjung atau Mulai Percakapan Bersama Kami
          </h2>
          <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed">
            Apakah Anda ingin mendiskusikan naskah, menjadwalkan kunjungan komunitas, atau sekadar
            bertanya stok buku favorit? Kami siap menyapa.
          </p>
        </div>

        {/* Split Layout: Contact Form + Google Maps */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Details + Form */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* Contact Detail Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Address */}
              <div className="p-5 rounded-2xl bg-surface-container-low flex items-start gap-3.5 border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary-container text-[24px] mt-0.5 shrink-0">
                  location_on
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-on-surface">Alamat Utama</span>
                  <span className="text-xs text-on-surface-variant leading-relaxed">
                    {siteConfig.contact.address}
                  </span>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="p-5 rounded-2xl bg-surface-container-low flex items-start gap-3.5 border border-outline-variant/30">
                <span className="material-symbols-outlined text-secondary text-[24px] mt-0.5 shrink-0">
                  chat
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-on-surface">WhatsApp &amp; Telepon</span>
                  <span className="text-xs text-on-surface-variant leading-relaxed">
                    {siteConfig.contact.phone}
                    <br />
                    <span className="text-secondary font-medium">
                      {siteConfig.contact.phoneNote}
                    </span>
                  </span>
                </div>
              </div>

              {/* Email */}
              <div className="p-5 rounded-2xl bg-surface-container-low flex items-start gap-3.5 border border-outline-variant/30">
                <span className="material-symbols-outlined text-secondary text-[24px] mt-0.5 shrink-0">
                  mail
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-on-surface">Surat Elektronik</span>
                  <span className="text-xs text-on-surface-variant leading-relaxed">
                    {siteConfig.contact.email}
                    <br />
                    {siteConfig.contact.emailEditorial} (Editorial)
                  </span>
                </div>
              </div>

              {/* Hours */}
              <div className="p-5 rounded-2xl bg-surface-container-low flex items-start gap-3.5 border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary-container text-[24px] mt-0.5 shrink-0">
                  schedule
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-on-surface">Jam Operasional</span>
                  <span className="text-xs text-on-surface-variant leading-relaxed">
                    {siteConfig.contact.operatingHours}
                  </span>
                </div>
              </div>
            </div>

            {/* Message Form */}
            <form
              onSubmit={handleSubmit}
              className="p-8 rounded-2xl bg-surface-container-low flex flex-col gap-5 shadow-sm border border-outline-variant/30"
              id="contactForm"
            >
              <h3 className="text-lg font-bold text-on-surface">
                Kirim Pesan atau Permintaan Naskah
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="fullName" className="text-xs font-semibold text-on-surface">
                    Nama Lengkap
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="cth. Raditya Wicaksono"
                    className="px-4 py-3 rounded-xl bg-surface text-on-surface placeholder:text-outline text-sm border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="emailAddr" className="text-xs font-semibold text-on-surface">
                    Alamat Email
                  </label>
                  <input
                    id="emailAddr"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nama@email.com"
                    className="px-4 py-3 rounded-xl bg-surface text-on-surface placeholder:text-outline text-sm border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="subjectSelect" className="text-xs font-semibold text-on-surface">
                  Pilihan Subjek
                </label>
                <select
                  id="subjectSelect"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="px-4 py-3 rounded-xl bg-surface text-on-surface text-sm border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
                >
                  <option value="buku">Tanya Ketersediaan Buku</option>
                  <option value="naskah">Pengajuan Proposal Naskah Baru</option>
                  <option value="acara">Kerjasama Acara &amp; Komunitas</option>
                  <option value="institusi">Pengadaan Perpustakaan Institusi</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="messageText" className="text-xs font-semibold text-on-surface">
                  Pesan Anda
                </label>
                <textarea
                  id="messageText"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Ceritakan kebutuhan buku, rencana acara, atau garis besar naskah Anda..."
                  className="px-4 py-3 rounded-xl bg-surface text-on-surface placeholder:text-outline text-sm border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary-container transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-fit px-8 py-3.5 rounded-xl text-sm font-semibold bg-primary-container text-on-primary hover:bg-primary transition-all duration-200 shadow-[0_4px_16px_-2px_rgba(249,115,22,0.3)] flex items-center justify-center gap-2 disabled:opacity-75"
              >
                <span>{loading ? "Mengirimkan..." : "Kirim Pesan Sekarang"}</span>
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>

              {submitted && (
                <div className="p-4 rounded-xl bg-secondary-container text-on-secondary-container text-xs sm:text-sm flex items-center gap-2 border border-secondary/20 animate-fadeIn">
                  <span className="material-symbols-outlined text-[20px] text-secondary">
                    check_circle
                  </span>
                  <span>
                    Terima kasih! Pesan Anda telah diterima tim Bookers dan akan dibalas dalam 1x24 jam
                    kerja.
                  </span>
                </div>
              )}
            </form>
          </div>

          {/* Right Column: Google Maps Embed Card */}
          <div className="lg:col-span-5 flex flex-col gap-4 sticky top-28">
            <div className="relative w-full rounded-2xl overflow-hidden shadow-md bg-surface-container flex flex-col border border-outline-variant/30">
              {/* Map Preview Frame with Real Google Maps Iframe */}
              <div className="relative w-full h-[380px] sm:h-[440px] bg-surface-container-high overflow-hidden">
                <iframe
                  title="Lokasi Bookers di Google Maps"
                  src={siteConfig.contact.mapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full filter saturate-[1.1] contrast-[1.05]"
                />

                {/* Transport Access Badges Floating Over Map */}
                <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap gap-2 pointer-events-none">
                  <div className="px-3 py-1.5 rounded-lg bg-surface/95 backdrop-blur-md text-on-surface text-xs font-medium shadow flex items-center gap-1.5 border border-outline-variant/40">
                    <span className="material-symbols-outlined text-secondary text-[16px]">
                      directions_subway
                    </span>
                    <span>5 menit dari MRT Senayan</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-surface/95 backdrop-blur-md text-on-surface text-xs font-medium shadow flex items-center gap-1.5 border border-outline-variant/40">
                    <span className="material-symbols-outlined text-secondary text-[16px]">
                      local_parking
                    </span>
                    <span>Area Parkir Tersedia</span>
                  </div>
                </div>
              </div>

              {/* Card Bottom Bar */}
              <div className="p-5 bg-surface flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-on-surface">Bookers Flagship</span>
                  <span className="text-xs text-on-surface-variant">
                    {siteConfig.contact.addressSub}
                  </span>
                </div>
                <a
                  href={siteConfig.contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container hover:bg-primary-fixed hover:text-on-primary-fixed-variant text-on-surface text-xs font-semibold transition-all shrink-0 border border-outline-variant/30"
                >
                  <span>Buka di Google Maps</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

