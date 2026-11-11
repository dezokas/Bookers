"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { OrderRecord } from "@/lib/types";

export default function OrderPaymentTicketPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrderDetail = () => {
    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          setError(data.error || "Pesanan tidak ditemukan.");
        }
      })
      .catch(() => setError("Gagal memuat data pesanan."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrderDetail();
    // Polling status pesanan setiap 8 detik agar pengguna langsung melihat saat admin mengonfirmasi
    const interval = setInterval(loadOrderDetail, 8000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 gap-3 text-outline">
        <span className="material-symbols-outlined text-[36px] animate-spin">
          progress_activity
        </span>
        <span className="text-xs font-semibold">Memuat tiket pesanan...</span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md bg-surface-container-low p-8 rounded-2xl border border-outline-variant/30 flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-[42px] text-error">error</span>
          <h1 className="font-headline text-lg font-bold text-on-surface">Pesanan Tidak Ditemukan</h1>
          <p className="text-xs text-on-surface-variant">{error}</p>
          <Link
            href="/pesan"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-primary text-on-primary hover:bg-primary-container"
          >
            Kembali ke Pemesanan
          </Link>
        </div>
      </div>
    );
  }

  const isPending = order.status === "menunggu_konfirmasi";
  const isConfirmed = order.status === "dikonfirmasi";
  const isCancelled = order.status === "dibatalkan";

  return (
    <div className="min-h-screen bg-surface py-12 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/pesanan-saya"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Daftar Pesanan Saya</span>
          </Link>
          <Link
            href="/"
            className="text-xs text-on-surface-variant hover:text-on-surface"
          >
            Beranda
          </Link>
        </div>

        {/* Confirmation Status Banner (Wajib Step 3) */}
        {isConfirmed && (
          <div className="p-6 rounded-2xl bg-secondary-container border border-secondary/30 text-on-secondary-container shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-start gap-3.5">
              <span className="material-symbols-outlined text-[28px] text-secondary shrink-0 mt-0.5">
                verified
              </span>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-sm">Pembayaran Berhasil Dikonfirmasi!</span>
                <p className="text-xs leading-relaxed">
                  Selamat, pembayaran Anda telah dikonfirmasi! Silakan tunggu informasi selanjutnya dari admin melalui email/WhatsApp.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-secondary text-on-secondary text-xs font-bold uppercase tracking-wider shrink-0">
              Lunas &amp; Diproses
            </span>
          </div>
        )}

        {isCancelled && (
          <div className="p-6 rounded-2xl bg-error-container border border-error/30 text-on-error-container shadow-sm flex items-start gap-3.5">
            <span className="material-symbols-outlined text-[28px] text-error shrink-0 mt-0.5">
              cancel
            </span>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-sm">Pesanan Dibatalkan</span>
              <p className="text-xs leading-relaxed">
                Pesanan ini telah dibatalkan oleh pihak pengelola Bookers.
                {order.admin_notes && ` Alasan: "${order.admin_notes}"`}
              </p>
            </div>
          </div>
        )}

        {/* Ticket Card Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: QRIS Barcode & Payment Steps */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col items-center text-center gap-4 shadow-sm">
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                  Scan QRIS Pembayaran
                </span>
                <h2 className="font-headline text-lg font-bold text-on-surface">
                  MOHAMMAD AMMAR AYYASY
                </h2>
                <span className="text-[11px] text-outline font-mono">
                  NMID: ID1026545853032 (GoPay Merchant)
                </span>
              </div>

              {/* QRIS Barcode Display */}
              <div className="p-3 bg-white rounded-2xl shadow-md border border-outline-variant/30 max-w-[280px] w-full aspect-[3/4] relative overflow-hidden">
                <Image
                  src="/images/qris.jpg"
                  alt="QRIS Pembayaran Bookers"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <div className="flex flex-col items-center gap-1 pt-1">
                <span className="text-xs text-on-surface-variant font-medium">
                  Total Tagihan Pembayaran:
                </span>
                <span className="font-headline text-2xl font-bold text-primary">
                  Rp {Number(order.total_price || 0).toLocaleString("id-ID")}
                </span>
              </div>

              <div className="w-full pt-3 border-t border-outline-variant/20 flex flex-col gap-2 text-left text-xs text-on-surface-variant">
                <span className="font-bold text-on-surface">Panduan Pembayaran:</span>
                <ol className="list-decimal list-inside flex flex-col gap-1.5 leading-relaxed text-[11px]">
                  <li>Buka aplikasi mobile banking (BCA, Mandiri, BRI, BNI) atau e-wallet (GoPay, OVO, Dana, ShopeePay).</li>
                  <li>Pilih menu <strong>Pindai / Scan QRIS</strong>.</li>
                  <li>Arahkan kamera ke kode QRIS di atas.</li>
                  <li>Masukkan nominal tepat sebesar: <strong>Rp {Number(order.total_price || 0).toLocaleString("id-ID")}</strong>.</li>
                  <li>Selesaikan pembayaran dan simpan bukti transfer Anda.</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Right Column: Order Ticket Summary */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-outline">
                    Nomor Tiket Pesanan
                  </span>
                  <span className="font-mono text-xs font-bold text-on-surface">
                    {order.id}
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isConfirmed
                      ? "bg-secondary-container text-on-secondary-container"
                      : isCancelled
                      ? "bg-error-container text-on-error-container"
                      : "bg-primary-fixed text-on-primary-fixed-variant"
                  }`}
                >
                  {isConfirmed
                    ? "Dikonfirmasi"
                    : isCancelled
                    ? "Dibatalkan"
                    : "Menunggu Konfirmasi"}
                </span>
              </div>

              {/* Rincian Produk */}
              <div className="flex flex-col gap-2 text-xs">
                <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
                  Rincian Item
                </span>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-sm text-on-surface block">
                      {order.product_name}
                    </span>
                    <span className="text-on-surface-variant text-[11px]">
                      {order.quantity}x @ Rp {Number(order.price || 0).toLocaleString("id-ID")}
                    </span>
                  </div>
                  <span className="font-bold text-on-surface">
                    Rp {Number(order.total_price || 0).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Rincian Penerima */}
              <div className="flex flex-col gap-2 text-xs pt-3 border-t border-outline-variant/20">
                <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
                  Data Penerima &amp; Kirim
                </span>
                <div className="flex flex-col gap-1 text-[11px] text-on-surface-variant">
                  <p>
                    <strong className="text-on-surface">Penerima:</strong> {order.recipient_name}
                  </p>
                  <p>
                    <strong className="text-on-surface">No. WhatsApp:</strong> {String(order.phone || "")}
                  </p>
                  <p>
                    <strong className="text-on-surface">Alamat:</strong> {order.shipping_address}
                  </p>
                  {order.notes && (
                    <p>
                      <strong className="text-on-surface">Catatan:</strong> {order.notes}
                    </p>
                  )}
                  <p>
                    <strong className="text-on-surface">Waktu Dibuat:</strong>{" "}
                    {new Date(order.created_at).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>

              {/* Action: WhatsApp Admin Shortcut */}
              <div className="pt-3 border-t border-outline-variant/20 flex flex-col gap-2.5">
                <span className="text-[11px] text-on-surface-variant">
                  Sudah melakukan pembayaran? Anda dapat langsung mengonfirmasi bukti transfer ke WhatsApp admin:
                </span>
                <a
                  href={`https://wa.me/6281288997700?text=${encodeURIComponent(
                    `Halo Admin Bookers, saya sudah melakukan transfer QRIS untuk pesanan tiket ${order.id} atas nama ${order.recipient_name} dengan total Rp ${Number(order.total_price || 0).toLocaleString("id-ID")}. Mohon diverifikasi ya!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl text-xs font-bold bg-secondary text-on-secondary hover:bg-secondary/90 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  <span>Kirim Bukti via WhatsApp Admin</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

