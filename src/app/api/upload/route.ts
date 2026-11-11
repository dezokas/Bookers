import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { saveFile } from "@/lib/storage";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "File tidak ditemukan." }, { status: 400 });
    }

    const result = await saveFile(file);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      filePath: result.filePath,
      message: "File berhasil diunggah.",
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: "Terjadi kesalahan saat mengunggah file." }, { status: 500 });
  }
}

