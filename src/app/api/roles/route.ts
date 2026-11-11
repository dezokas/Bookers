import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Role } from "@/lib/types";

// GET: Ambil daftar seluruh role
export async function GET() {
  try {
    const roles = await db.getAll<Role>("Roles");
    return NextResponse.json({ success: true, roles });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Tambah role baru
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }

    const { name, description, permissions } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "Nama role wajib diisi." }, { status: 400 });
    }

    const cleanName = name.trim().toLowerCase();
    const existing = await db.getByField<Role>("Roles", "name", cleanName);
    if (existing) {
      return NextResponse.json({ success: false, error: "Nama role sudah ada." }, { status: 400 });
    }

    const newRole = await db.create<Role>("Roles", {
      name: cleanName,
      description: description || "",
      permissions: permissions || "read:news",
      is_system: "false",
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, role: newRole });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: Perbarui deskripsi / permissions role non-sistem
export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }

    const { id, description, permissions } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "ID role wajib disertakan." }, { status: 400 });
    }

    const role = await db.getById<Role>("Roles", id);
    if (!role) {
      return NextResponse.json({ success: false, error: "Role tidak ditemukan." }, { status: 404 });
    }

    const updates: Partial<Role> = {};
    if (description !== undefined) updates.description = description;
    if (permissions !== undefined) updates.permissions = permissions;

    const updated = await db.update<Role>("Roles", id, updates);
    return NextResponse.json({ success: true, role: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Hapus role non-sistem
export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID role wajib disertakan." }, { status: 400 });
    }

    const role = await db.getById<Role>("Roles", id);
    if (!role) {
      return NextResponse.json({ success: false, error: "Role tidak ditemukan." }, { status: 404 });
    }

    // Proteksi: Role sistem tidak boleh dihapus
    if (String(role.is_system).toLowerCase() === "true" || role.name === "admin" || role.name === "user") {
      return NextResponse.json(
        { success: false, error: "Role sistem bawaan tidak dapat dihapus." },
        { status: 400 }
      );
    }

    await db.delete("Roles", id);
    return NextResponse.json({ success: true, message: "Role berhasil dihapus." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

