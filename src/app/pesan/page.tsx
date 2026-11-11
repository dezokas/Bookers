"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { bookPackages } from "@/config/products";
import { siteConfig } from "@/config/site";
import { SessionUser } from "@/lib/types";

function OrderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPkgId = searchParams.get("package") || bookPackages[0].id;

  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Form State
  const [selectedPkgId, setSelectedPkgId] = useState(initialPkgId);
  const [quantity, setQuantity] = useState(1);
  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setCurrentUser(data.user);
          setRecipientName(data.user.name || "");
        }
      })
      .finally(() => setAuthLoading(false));
  }, []);

  const selectedProduct =
    bookPackages.find((p) => p.id === selectedPkgId) || bookPackages[0];
  const totalPrice = selectedProduct.price * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!currentUser) {
      router.push(`/login?redirect=/pesan`);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: selectedProduct.id,
          quantity,
          recipient_name: recipientName,
          phone,
          shipping_address: shippingAddress,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Gagal membuat pesanan. Silakan periksa kembali data Anda.");
        setSubmitting(false);
        return;
      }

      // Berhasil dibuat -> arahkan langsung ke halaman pembayaran tiket QRIS
      router.push(`/pesanan/${data.order.id}`);
    } catch {
      setError("Terjadi gangguan koneksi internet. Silakan coba lagi.");
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center text-outline">
        <span className="material-symbols-outlined text-[32px] animate-spin">
          progress_activity
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-12 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Kembali ke Beranda {siteConfig.name}</span>
          </Link>
          {currentUser && (
            <Link
              href="/pesanan-saya"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface-container text-on-surface text-xs font-semibold border border-outline-variant/30 hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">
                receipt_long
              </span>
              <span>Pesanan Saya</span>
            </Link>
          )}
        </div>

        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold w-fit border border-secondary/20">
            <span className="material-symbols-outlined text-[16px]">local_mall</span>
            <span>Formulir Pemesanan Resmi</span>
          </div>
          <h1 className="font-headline text-3xl font-bold text-on-surface">
            Pesan Paket Buku &amp; Kurasi Sastra
          </h1>
          <p className="text-sm text-on-surface-variant max-w-2xl leading-relaxed">
            Pilih paket kurasi bacaan favorit Anda. Setelah formulir dikirim, sistem akan menerbitkan tiket pesanan dan kode QRIS resmi untuk pembayaran instan.
          </p>
        </div>

        {/* Login Alert Banner if Not Authenticated */}
        {!currentUser && (
          <div className="p-5 rounded-2xl bg-primary-fixed/40 border border-primary/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-[24px] shrink-0 mt-0.5">
                account_circle
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-on-surface">
                  Perlu Masuk Akun untuk Memesan
                </span>
                <span className="text-xs text-on-surface-variant leading-relaxed">
                  Agar tiket pesanan tercatat di akun Anda dan dapat dipantau statusnya, silakan masuk atau daftar akun terlebih dahulu.
                </span>
              </div>
            </div>
            <Link
              href="/login?redirect=/pesan"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-primary text-on-primary hover:bg-primary-container transition-all shrink-0 shadow-sm"
            >
              Masuk Sekarang
            </Link>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-error-container text-on-error-container text-xs flex items-center gap-2 border border-error/20">
            <span className="material-symbols-outlined text-[18px] text-error">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form & Summary Grid */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Product Selection & Shipping Info */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Step 1: Pilih Paket Produk */}
            <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-4 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                1. Pilih Paket Buku
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {bookPackages.map((pkg) => {
                  const isSelected = pkg.id === selectedPkgId;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPkgId(pkg.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                        isSelected
                          ? "bg-surface border-primary ring-2 ring-primary/20 shadow-sm"
                          : "bg-surface/50 border-outline-variant/30 hover:bg-surface"
                      }`}
                    >
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-sm text-on-surface line-clamp-1">
                            {pkg.name}
                          </span>
                          {pkg.badge && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container shrink-0">
                              {pkg.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-on-surface-variant line-clamp-2">
                          {pkg.subtitle}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                        <span className="text-sm font-bold text-primary">
                          Rp {pkg.price.toLocaleString("id-ID")}
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? "border-primary bg-primary text-on-primary"
                              : "border-outline"
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20">
                <span className="text-xs font-semibold text-on-surface">Jumlah Paket (Kuantitas)</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-surface border border-outline-variant/40 flex items-center justify-center text-on-surface hover:bg-surface-container"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold w-6 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-surface border border-outline-variant/40 flex items-center justify-center text-on-surface hover:bg-surface-container"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2: Data Pengiriman */}
            <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-4 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                2. Data Penerima &amp; Pengiriman
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface">
                    Nama Lengkap Penerima
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="cth. Mochammad Farhan"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-surface text-xs border border-outline-variant/40 focus:ring-2 focus:ring-primary-container"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface">
                    Nomor WhatsApp Penerima
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="cth. 081288997700"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-surface text-xs border border-outline-variant/40 focus:ring-2 focus:ring-primary-container"
                  />
                  <span className="text-[10px] text-on-surface-variant">
                    Digunakan admin untuk konfirmasi &amp; info resi pengiriman.
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">
                  Alamat Lengkap Pengiriman
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Nama jalan, nomor rumah, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten, Kode Pos..."
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-surface text-xs border border-outline-variant/40 focus:ring-2 focus:ring-primary-container resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">
                  Catatan Tambahan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="cth. Titipkan ke pos satpam jika tidak ada orang"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-surface text-xs border border-outline-variant/40 focus:ring-2 focus:ring-primary-container"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout Action */}
          <div className="lg:col-span-5 flex flex-col gap-5 sticky top-24">
            <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-5 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Ringkasan Pemesanan
              </span>

              {/* Selected Item Preview */}
              <div className="flex gap-3.5 items-start p-3 rounded-xl bg-surface border border-outline-variant/20">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-surface-container shrink-0">
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="font-bold text-xs text-on-surface leading-tight">
                    {selectedProduct.name}
                  </span>
                  <span className="text-[11px] text-on-surface-variant mt-0.5">
                    {quantity}x @ Rp {selectedProduct.price.toLocaleString("id-ID")}
                  </span>
                  <span className="text-xs font-bold text-primary mt-1">
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Package Included Features */}
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="text-[11px] font-bold text-on-surface">Termasuk dalam paket:</span>
                <ul className="flex flex-col gap-1 text-[11px] text-on-surface-variant">
                  {selectedProduct.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-secondary shrink-0">
                        check
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cost Breakdown */}
              <div className="pt-3 border-t border-outline-variant/20 flex flex-col gap-2 text-xs">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal Produk</span>
                  <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Biaya Pengiriman</span>
                  <span className="font-semibold text-secondary">GRATIS (Promo Subsidi)</span>
                </div>
                <div className="flex justify-between text-on-surface font-bold text-sm pt-2 border-t border-outline-variant/20">
                  <span>Total Tagihan</span>
                  <span className="text-primary font-headline text-base">
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Payment Method Badge */}
              <div className="p-3 rounded-xl bg-secondary-container/40 border border-secondary/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-secondary">
                    qr_code_scanner
                  </span>
                  <span className="font-semibold text-on-surface">Metode Pembayaran:</span>
                </div>
                <span className="font-bold text-secondary">QRIS Nasional</span>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl text-xs font-bold bg-primary text-on-primary hover:bg-primary-container transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">
                      progress_activity
                    </span>
                    <span>Membuat Tiket Pesanan...</span>
                  </>
                ) : (
                  <>
                    <span>Lanjutkan ke Pembayaran QRIS</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-outline">
                Pesanan Anda akan langsung tercatat sebagai tiket resmi di sistem Bookers.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center text-outline">
          <span className="material-symbols-outlined text-[24px] animate-spin">
            progress_activity
          </span>
        </div>
      }
    >
      <OrderContent />
    </Suspense>
  );
}

