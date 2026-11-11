"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OrderRecord, SessionUser } from "@/lib/types";
import { siteConfig } from "@/config/site";

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.success || !data.user) {
          router.push("/login?redirect=/pesanan-saya");
          return;
        }
        setCurrentUser(data.user);
        return fetch("/api/orders");
      })
      .then((res) => res?.json())
      .then((data) => {
        if (data && data.success) {
          setOrders(data.orders || []);
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const filteredOrders = orders.filter((o) => {
    if (filter === "all") return true;
    return o.status === filter;
  });

  return (
    <div className="min-h-screen bg-surface py-12 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Kembali ke Beranda {siteConfig.name}</span>
          </Link>
          <Link
            href="/pesan"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary-container transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
            <span>Pesan Buku Baru</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="flex flex-col gap-1.5">
          <h1 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
            Pesanan Saya
          </h1>
          <p className="text-xs text-on-surface-variant">
            Daftar tiket pembelian paket buku dan status konfirmasi pembayaran Anda di Bookers.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "Semua Pesanan" },
            { id: "menunggu_konfirmasi", label: "Menunggu Konfirmasi" },
            { id: "dikonfirmasi", label: "Dikonfirmasi" },
            { id: "dibatalkan", label: "Dibatalkan" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === tab.id
                  ? "bg-primary-container text-on-primary-container shadow-xs"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="p-12 text-center text-outline flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[32px] animate-spin">
              progress_activity
            </span>
            <span className="text-xs">Memuat daftar pesanan...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-[40px] text-outline">
              receipt_long
            </span>
            <h3 className="font-headline font-bold text-base text-on-surface">
              Belum Ada Pesanan
            </h3>
            <p className="text-xs text-on-surface-variant max-w-sm">
              Anda belum memiliki riwayat pesanan paket buku pada kategori ini.
            </p>
            <Link
              href="/pesan"
              className="mt-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all"
            >
              Mulai Pesan Sekarang
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredOrders.map((order) => {
              const isConfirmed = order.status === "dikonfirmasi";
              const isCancelled = order.status === "dibatalkan";

              return (
                <div
                  key={order.id}
                  className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 hover:border-primary/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xs"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs font-bold text-primary">
                        {order.id}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
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
                      <span className="text-[11px] text-on-surface-variant">
                        • {new Date(order.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <h3 className="font-headline font-bold text-base text-on-surface">
                      {order.product_name}
                    </h3>

                    <div className="text-xs text-on-surface-variant flex flex-wrap gap-4">
                      <span>Jumlah: <strong>{order.quantity} paket</strong></span>
                      <span>Total: <strong className="text-on-surface font-semibold">Rp {Number(order.total_price || 0).toLocaleString("id-ID")}</strong></span>
                      <span>Penerima: <strong>{order.recipient_name}</strong></span>
                    </div>

                    {/* Confirmed Notice in List */}
                    {isConfirmed && (
                      <div className="p-2.5 rounded-xl bg-secondary-container/50 text-on-secondary-container text-xs flex items-center gap-2 border border-secondary/20 mt-1">
                        <span className="material-symbols-outlined text-[16px] text-secondary">
                          check_circle
                        </span>
                        <span>
                          Selamat, pembayaran Anda telah dikonfirmasi! Silakan tunggu informasi selanjutnya dari admin melalui email/WhatsApp.
                        </span>
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/pesanan/${order.id}`}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-surface text-primary border border-outline-variant/40 hover:bg-primary-container hover:text-on-primary transition-all shrink-0 flex items-center gap-1.5"
                  >
                    <span>Lihat Tiket &amp; QRIS</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

