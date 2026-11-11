import { NextResponse } from "next/server";
import { getSession, comparePassword, hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { User } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Kata sandi saat ini dan kata sandi baru wajib diisi." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "Kata sandi baru minimal 6 karakter." },
        { status: 400 }
      );
    }

    const user = await db.getById<User>("Users", session.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Pengguna tidak ditemukan." },
        { status: 404 }
      );
    }

    const isMatch = await comparePassword(currentPassword, user.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Kata sandi saat ini salah." },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(newPassword);
    await db.update("Users", user.id, { password_hash: newHash });

    return NextResponse.json({
      success: true,
      message: "Kata sandi berhasil diperbarui.",
    });
  } catch (error: any) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan saat mengganti kata sandi." },
      { status: 500 }
    );
  }
}

