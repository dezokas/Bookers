import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { comparePassword, createSession } from "@/lib/auth";
import { User, Role } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await db.getByField<User>("Users", "email", cleanEmail);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Email atau kata sandi tidak sesuai." },
        { status: 401 }
      );
    }

    if (user.status !== "active") {
      return NextResponse.json(
        { success: false, error: "Akun Anda berstatus nonaktif. Silakan hubungi admin." },
        { status: 403 }
      );
    }

    const passwordMatch = await comparePassword(password, user.password_hash);
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: "Email atau kata sandi tidak sesuai." },
        { status: 401 }
      );
    }

    // Ambil detail role
    const roleRecord = await db.getById<Role>("Roles", user.role_id);
    const roleName = roleRecord?.name || "user";

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: roleName,
      role_id: user.role_id,
    };

    await createSession(sessionUser);

    return NextResponse.json({
      success: true,
      message: "Login berhasil.",
      user: sessionUser,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan internal saat proses login." },
      { status: 500 }
    );
  }
}

