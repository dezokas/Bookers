import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { OrderRecord } from "@/lib/types";
import { bookPackages } from "@/config/products";

// GET: Ambil daftar pesanan (Admin = semua, User = miliknya saja)
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Silakan masuk ke akun Anda terlebih dahulu." },
        { status: 401 }
      );
    }

    const allOrders = await db.getAll<OrderRecord>("Orders");

    if (session.role === "admin") {
      return NextResponse.json({ success: true, orders: allOrders });
    }

    // Untuk user biasa, filter hanya pesanan miliknya
    const userOrders = allOrders.filter((o) => o.user_id === session.id);
    return NextResponse.json({ success: true, orders: userOrders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Gagal memuat pesanan." },
      { status: 500 }
    );
  }
}

// POST: Buat pesanan paket buku baru
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Silakan masuk ke akun Anda untuk memesan." },
        { status: 401 }
      );
    }

    const {
      product_id,
      quantity,
      recipient_name,
      phone,
      shipping_address,
      notes,
    } = await req.json();

    // 1. Validasi Input
    if (!product_id) {
      return NextResponse.json(
        { success: false, error: "Pilihan paket buku wajib ditentukan." },
        { status: 400 }
      );
    }

    const selectedProduct = bookPackages.find((p) => p.id === product_id);
    if (!selectedProduct) {
      return NextResponse.json(
        { success: false, error: "Paket buku yang dipilih tidak valid." },
        { status: 400 }
      );
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) {
      return NextResponse.json(
        { success: false, error: "Jumlah pesanan minimal 1 eksemplar." },
        { status: 400 }
      );
    }

    if (!recipient_name || recipient_name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Nama lengkap penerima wajib diisi." },
        { status: 400 }
      );
    }

    const cleanPhone = (phone || "").replace(/[^0-9+]/g, "");
    if (cleanPhone.length < 8) {
      return NextResponse.json(
        { success: false, error: "Nomor WhatsApp aktif wajib diisi dengan benar." },
        { status: 400 }
      );
    }

    if (!shipping_address || shipping_address.trim().length < 8) {
      return NextResponse.json(
        { success: false, error: "Alamat lengkap pengiriman wajib diisi." },
        { status: 400 }
      );
    }

    // 2. Kalkulasi Total Harga
    const price = selectedProduct.price;
    const totalPrice = price * qty;
    const now = new Date().toISOString();
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // 3. Simpan Pesanan ke Tabel Orders
    const newOrder: OrderRecord = {
      id: orderId,
      user_id: session.id,
      user_email: session.email,
      product_id: selectedProduct.id,
      product_name: selectedProduct.name,
      quantity: qty,
      price: price,
      total_price: totalPrice,
      recipient_name: recipient_name.trim(),
      phone: cleanPhone,
      shipping_address: shipping_address.trim(),
      notes: notes ? notes.trim() : "",
      payment_method: "QRIS",
      status: "menunggu_konfirmasi",
      admin_notes: "",
      created_at: now,
      updated_at: now,
    };

    const saved = await db.create<OrderRecord>("Orders", newOrder);

    return NextResponse.json({
      success: true,
      message: "Pesanan berhasil dibuat. Silakan lanjutkan pembayaran via QRIS.",
      order: saved,
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Terjadi kesalahan saat memproses pesanan." },
      { status: 500 }
    );
  }
}

// PUT: Perbarui status pesanan (Admin Only)
export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Akses ditolak. Hanya administrator yang dapat memperbarui status pesanan." },
        { status: 403 }
      );
    }

    const { id, status, admin_notes } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID pesanan wajib disertakan." },
        { status: 400 }
      );
    }

    const existing = await db.getById<OrderRecord>("Orders", id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Pesanan tidak ditemukan." },
        { status: 404 }
      );
    }

    const updates: Partial<OrderRecord> = {
      updated_at: new Date().toISOString(),
    };

    if (status && ["menunggu_konfirmasi", "dikonfirmasi", "dibatalkan"].includes(status)) {
      updates.status = status;
    }

    if (admin_notes !== undefined) {
      updates.admin_notes = admin_notes;
    }

    const updated = await db.update<OrderRecord>("Orders", id, updates);

    return NextResponse.json({
      success: true,
      message: "Status pesanan berhasil diperbarui.",
      order: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Gagal memperbarui status pesanan." },
      { status: 500 }
    );
  }
}

