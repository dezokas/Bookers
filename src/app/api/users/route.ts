import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { User, Role } from "@/lib/types";

// GET: Ambil daftar seluruh user (hanya admin)
export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }

    const users = await db.getAll<User>("Users");
    const roles = await db.getAll<Role>("Roles");

    const roleMap = new Map<string, string>();
    roles.forEach((r) => roleMap.set(r.id, r.name));

    // Sanitasi: jangan kirim password_hash ke klien!
    const sanitizedUsers = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role_id: u.role_id,
      role_name: roleMap.get(u.role_id) || "user",
      status: u.status,
      created_at: u.created_at,
      updated_at: u.updated_at,
    }));

    return NextResponse.json({ success: true, users: sanitizedUsers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: Ubah status atau role user
export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }

    const { id, role_id, status } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "ID user wajib disertakan." }, { status: 400 });
    }

    const targetUser = await db.getById<User>("Users", id);
    if (!targetUser) {
      return NextResponse.json({ success: false, error: "User tidak ditemukan." }, { status: 404 });
    }

    // Proteksi: Admin tidak boleh menonaktifkan akunnya sendiri
    if (session.id === id && status === "inactive") {
      return NextResponse.json(
        { success: false, error: "Anda tidak dapat menonaktifkan akun admin Anda sendiri." },
        { status: 400 }
      );
    }

    // Proteksi: Admin tidak boleh menurunkan role dirinya sendiri jika menjadi admin terakhir
    const adminRole = await db.getByField<Role>("Roles", "name", "admin");
    const adminRoleId = adminRole?.id || "role_admin";

    if (session.id === id && role_id && role_id !== adminRoleId) {
      const allUsers = await db.getAll<User>("Users");
      const activeAdmins = allUsers.filter(
        (u) => u.role_id === adminRoleId && u.status === "active"
      );
      if (activeAdmins.length <= 1) {
        return NextResponse.json(
          { success: false, error: "Tidak dapat mengubah role karena Anda adalah admin aktif terakhir." },
          { status: 400 }
        );
      }
    }

    const updates: Partial<User> = {};
    if (role_id) updates.role_id = role_id;
    if (status) updates.status = status;

    const updatedUser = await db.update<User>("Users", id, updates);
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Hapus user
export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID user wajib disertakan." }, { status: 400 });
    }

    // Proteksi: Admin tidak dapat menghapus dirinya sendiri
    if (session.id === id) {
      return NextResponse.json(
        { success: false, error: "Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif." },
        { status: 400 }
      );
    }

    // Proteksi: Admin terakhir tidak boleh dihapus
    const adminRole = await db.getByField<Role>("Roles", "name", "admin");
    const adminRoleId = adminRole?.id || "role_admin";
    const targetUser = await db.getById<User>("Users", id);

    if (targetUser && targetUser.role_id === adminRoleId) {
      const allUsers = await db.getAll<User>("Users");
      const activeAdmins = allUsers.filter((u) => u.role_id === adminRoleId);
      if (activeAdmins.length <= 1) {
        return NextResponse.json(
          { success: false, error: "Tidak dapat menghapus admin terakhir pada sistem." },
          { status: 400 }
        );
      }
    }

    await db.delete("Users", id);
    return NextResponse.json({ success: true, message: "Pengguna berhasil dihapus." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

