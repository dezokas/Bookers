import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";
import { User, Role } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Nama, email, dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Kata sandi minimal 6 karakter." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await db.getByField<User>("Users", "email", cleanEmail);

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Email sudah terdaftar. Silakan masuk menggunakan akun tersebut." },
        { status: 400 }
      );
    }

    // Role default untuk pendaftar baru adalah 'user'
    const userRole = await db.getByField<Role>("Roles", "name", "user");
    const roleId = userRole?.id || "role_user";

    const passwordHash = await hashPassword(password);
    const now = new Date().toISOString();

    const newUser = await db.create<User>("Users", {
      name: name.trim(),
      email: cleanEmail,
      password_hash: passwordHash,
      role_id: roleId,
      status: "active",
      created_at: now,
      updated_at: now,
    });

    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: "user",
      role_id: roleId,
    };

    await createSession(sessionUser);

    return NextResponse.json({
      success: true,
      message: "Registrasi berhasil.",
      user: sessionUser,
    });
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan internal saat registrasi." },
      { status: 500 }
    );
  }
}

