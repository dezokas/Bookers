import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { deleteFile } from "@/lib/storage";
import { NewsRecord } from "@/lib/types";

// Helper: buat slug dari judul
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

// GET: Ambil daftar berita
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    const session = await getSession();

    const newsList = await db.getAll<NewsRecord>("News");

    // Jika admin meminta all=true, kembalikan semua termasuk draft
    if (all && session?.role === "admin") {
      return NextResponse.json({ success: true, news: newsList });
    }

    // Untuk publik, hanya kembalikan berita yang berstatus published
    const publishedNews = newsList.filter((n) => n.status === "published");
    return NextResponse.json({ success: true, news: publishedNews });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Tambah berita baru (admin only)
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }

    const { title, excerpt, content, thumbnail_path, status } = await req.json();

    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, error: "Judul berita wajib diisi." }, { status: 400 });
    }

    const slug = `${slugify(title)}-${Date.now().toString(36)}`;
    const now = new Date().toISOString();

    const newNews = await db.create<NewsRecord>("News", {
      title: title.trim(),
      slug,
      excerpt: excerpt || "",
      content: content || "",
      thumbnail_path: thumbnail_path || "/images/news-1.jpg",
      status: status === "draft" ? "draft" : "published",
      author_id: session.id,
      created_at: now,
      updated_at: now,
    });

    return NextResponse.json({ success: true, news: newNews });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: Perbarui berita (admin only)
export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }

    const { id, title, excerpt, content, thumbnail_path, status } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "ID berita wajib disertakan." }, { status: 400 });
    }

    const existing = await db.getById<NewsRecord>("News", id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Berita tidak ditemukan." }, { status: 404 });
    }

    const updates: Partial<NewsRecord> = {};
    if (title) updates.title = title.trim();
    if (excerpt !== undefined) updates.excerpt = excerpt;
    if (content !== undefined) updates.content = content;
    if (thumbnail_path !== undefined) updates.thumbnail_path = thumbnail_path;
    if (status !== undefined) updates.status = status;

    const updated = await db.update<NewsRecord>("News", id, updates);
    return NextResponse.json({ success: true, news: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Hapus berita (admin only)
export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID berita wajib disertakan." }, { status: 400 });
    }

    const existing = await db.getById<NewsRecord>("News", id);
    if (existing && existing.thumbnail_path) {
      // Hapus file dari folder upload lokal jika memang tersimpan di /uploads/
      await deleteFile(existing.thumbnail_path);
    }

    await db.delete("News", id);
    return NextResponse.json({ success: true, message: "Berita berhasil dihapus." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

