import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { OrderRecord } from "@/lib/types";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Silakan masuk terlebih dahulu." },
        { status: 401 }
      );
    }

    const orderId = params.id;
    const order = await db.getById<OrderRecord>("Orders", orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Pesanan tidak ditemukan." },
        { status: 404 }
      );
    }

    // Hanya pemilik pesanan atau admin yang diizinkan melihat detail
    if (session.role !== "admin" && order.user_id !== session.id) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak. Anda tidak berhak melihat pesanan ini." },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Gagal memuat detail pesanan." },
      { status: 500 }
    );
  }
}

