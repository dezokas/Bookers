"use client";

import { useState, useEffect } from "react";
import { OrderRecord } from "@/lib/types";

export default function AdminOrdersManagementPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [filter, setFilter] = useState("all");

  // Modals
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [cancelModalOrder, setCancelModalOrder] = useState<OrderRecord | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch {
      setMessage({ type: "error", text: "Gagal memuat data pesanan." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: "dikonfirmasi" | "dibatalkan",
    adminNotes: string = ""
  ) => {
    setActionLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: orderId,
          status: newStatus,
          admin_notes: adminNotes,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Gagal memperbarui status pesanan." });
      } else {
        setMessage({
          type: "success",
          text: `Pesanan ${orderId} berhasil diubah statusnya menjadi ${newStatus}.`,
        });
        setSelectedOrder(null);
        setCancelModalOrder(null);
        setCancelReason("");
        loadOrders();
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan jaringan." });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === "all") return true;
    return o.status === filter;
  });

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl font-bold text-on-surface">Kelola Pesanan</h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Daftar tiket pesanan paket buku, verifikasi pembayaran QRIS, dan koordinasi pengiriman.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "Semua" },
            { id: "menunggu_konfirmasi", label: "Menunggu Konfirmasi" },
            { id: "dikonfirmasi", label: "Dikonfirmasi" },
            { id: "dibatalkan", label: "Dibatalkan" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === tab.id
                  ? "bg-primary-container text-on-primary-container shadow-xs"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Messages */}
      {message && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 border ${
            message.type === "success"
              ? "bg-secondary-container text-on-secondary-container border-secondary/20"
              : "bg-error-container text-on-error-container border-error/20"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {message.type === "success" ? "check_circle" : "error"}
          </span>
          <span>{message.text}</span>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-surface-container-low rounded-2xl border border-outline-variant/30 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-high/50 text-on-surface-variant font-bold uppercase tracking-wider border-b border-outline-variant/30">
              <tr>
                <th className="py-3.5 px-6">Tiket &amp; Pemesan</th>
                <th className="py-3.5 px-6">Paket Buku</th>
                <th className="py-3.5 px-6">Total Tagihan</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Tanggal</th>
                <th className="py-3.5 px-6 text-right">Aksi &amp; WhatsApp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-outline">
                    <span className="material-symbols-outlined text-[28px] animate-spin">
                      progress_activity
                    </span>
                    <p className="mt-2 text-xs">Memuat daftar pesanan...</p>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                    <p className="font-medium">Tidak ada pesanan pada filter ini.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isPending = order.status === "menunggu_konfirmasi";
                  const isConfirmed = order.status === "dikonfirmasi";
                  const isCancelled = order.status === "dibatalkan";

                  // Bersihkan format nomor WA untuk link wa.me
                  let waNumber = String(order.phone || "").replace(/[^0-9]/g, "");
                  if (waNumber.startsWith("0")) {
                    waNumber = "62" + waNumber.substring(1);
                  } else if (waNumber.startsWith("8")) {
                    waNumber = "62" + waNumber;
                  }

                  const waMessage = encodeURIComponent(
                    `Halo ${order.recipient_name}, kami dari tim Bookers terkait pesanan paket "${order.product_name}" (Tiket: ${order.id}).`
                  );

                  return (
                    <tr key={order.id} className="hover:bg-surface/50 transition-colors">
                      {/* Ticket & Buyer */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-mono font-bold text-primary text-xs">
                            {order.id}
                          </span>
                          <span className="font-bold text-sm text-on-surface mt-0.5">
                            {order.recipient_name}
                          </span>
                          <span className="text-[11px] text-on-surface-variant">
                            {order.phone}
                          </span>
                        </div>
                      </td>

                      {/* Package Item */}
                      <td className="py-4 px-6 max-w-xs">
                        <div className="flex flex-col">
                          <span className="font-bold text-on-surface line-clamp-1">
                            {order.product_name}
                          </span>
                          <span className="text-[11px] text-on-surface-variant">
                            Jumlah: {order.quantity} paket
                          </span>
                        </div>
                      </td>

                      {/* Total Price */}
                      <td className="py-4 px-6">
                        <span className="font-bold text-sm text-on-surface">
                          Rp {Number(order.total_price || 0).toLocaleString("id-ID")}
                        </span>
                        <span className="block text-[10px] text-secondary font-semibold">
                          Via QRIS
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isConfirmed
                              ? "bg-secondary-container text-on-secondary-container"
                              : isCancelled
                              ? "bg-error-container text-on-error-container"
                              : "bg-primary-fixed text-on-primary-fixed-variant"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isConfirmed
                                ? "bg-secondary"
                                : isCancelled
                                ? "bg-error"
                                : "bg-primary-container animate-pulse"
                            }`}
                          />
                          <span>
                            {isConfirmed
                              ? "Dikonfirmasi"
                              : isCancelled
                              ? "Dibatalkan"
                              : "Menunggu"}
                          </span>
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 text-on-surface-variant">
                        {new Date(order.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          {/* WhatsApp Shortcut */}
                          <a
                            href={`https://wa.me/${waNumber}?text=${waMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Chat WhatsApp Pembeli"
                            className="p-1.5 rounded-lg text-secondary hover:bg-secondary-container transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">chat</span>
                          </a>

                          {/* Detail Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            title="Lihat Detail Pesanan"
                            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              visibility
                            </span>
                          </button>

                          {/* Quick Confirm Button */}
                          {isPending && (
                            <button
                              type="button"
                              disabled={actionLoading}
                              onClick={() => handleUpdateStatus(order.id, "dikonfirmasi")}
                              title="Konfirmasi Pembayaran"
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-secondary text-on-secondary hover:bg-secondary/90 transition-all shadow-xs"
                            >
                              Konfirmasi
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Pesanan */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-surface rounded-2xl max-w-lg w-full p-6 border border-outline-variant/30 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-outline">
                  Detail Tiket Pesanan
                </span>
                <h3 className="font-mono text-base font-bold text-primary">
                  {selectedOrder.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Info Grid */}
            <div className="flex flex-col gap-3 text-xs">
              <div className="p-3 rounded-xl bg-surface-container/40 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                  Produk Yang Dipesan
                </span>
                <span className="font-bold text-sm text-on-surface">
                  {selectedOrder.product_name}
                </span>
                <span className="text-on-surface-variant">
                  {selectedOrder.quantity} paket × Rp {Number(selectedOrder.price || 0).toLocaleString("id-ID")} ={" "}
                  <strong className="text-primary font-bold">
                    Rp {Number(selectedOrder.total_price || 0).toLocaleString("id-ID")}
                  </strong>
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                  Data Penerima
                </span>
                <p>
                  <strong>Nama:</strong> {selectedOrder.recipient_name}
                </p>
                <p>
                  <strong>WhatsApp:</strong> {selectedOrder.phone}
                </p>
                <p>
                  <strong>Email Akun:</strong> {selectedOrder.user_email}
                </p>
                <p>
                  <strong>Alamat Kirim:</strong> {selectedOrder.shipping_address}
                </p>
                {selectedOrder.notes && (
                  <p>
                    <strong>Catatan Pembeli:</strong> {selectedOrder.notes}
                  </p>
                )}
                {selectedOrder.admin_notes && (
                  <p className="text-error font-medium">
                    <strong>Catatan Admin:</strong> {selectedOrder.admin_notes}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons in Modal */}
            <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
              {selectedOrder.status === "menunggu_konfirmasi" ? (
                <button
                  type="button"
                  onClick={() => {
                    setCancelModalOrder(selectedOrder);
                    setSelectedOrder(null);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition-colors"
                >
                  Tolak / Batalkan
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                {selectedOrder.status === "menunggu_konfirmasi" && (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus(selectedOrder.id, "dikonfirmasi")}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-secondary text-on-secondary hover:bg-secondary/90 transition-all shadow-sm"
                  >
                    {actionLoading ? "Menyimpan..." : "Konfirmasi Pembayaran"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface-container text-on-surface hover:bg-surface-container-high"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Batalkan Pesanan */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-surface rounded-2xl max-w-sm w-full p-6 border border-outline-variant/30 shadow-xl flex flex-col gap-4">
            <div className="w-12 h-12 rounded-full bg-error-container text-on-error-container flex items-center justify-center self-start">
              <span className="material-symbols-outlined text-[24px]">cancel</span>
            </div>
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface">
                Batalkan Pesanan {cancelModalOrder.id}
              </h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                Silakan sertakan alasan penolakan/pembatalan untuk pembeli:
              </p>
            </div>

            <textarea
              rows={3}
              required
              placeholder="cth. Bukti transfer tidak valid atau stok paket telah habis..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-surface text-xs border border-outline-variant/40 focus:ring-2 focus:ring-primary-container resize-none"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOrder(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleUpdateStatus(cancelModalOrder.id, "dibatalkan", cancelReason)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-error text-on-error hover:bg-error/90 transition-colors shadow-xs"
              >
                {actionLoading ? "Memproses..." : "Ya, Batalkan Pesanan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

