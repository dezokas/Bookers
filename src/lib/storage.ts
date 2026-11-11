import fs from "fs";
import path from "path";
import crypto from "crypto";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// Pastikan direktori uploads tersedia
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function saveFile(file: File): Promise<{ success: boolean; filePath?: string; error?: string }> {
  try {
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return { success: false, error: "Hanya format gambar JPG, PNG, atau WEBP yang diperbolehkan." };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: "Ukuran file terlalu besar. Maksimal 5MB." };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || `.${file.type.split("/")[1] || "jpg"}`;
    const safeName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext.toLowerCase()}`;
    const targetPath = path.join(UPLOADS_DIR, safeName);

    await fs.promises.writeFile(targetPath, buffer);

    const publicPath = `/uploads/${safeName}`;
    return { success: true, filePath: publicPath };
  } catch (error) {
    console.error("Gagal menyimpan file:", error);
    return { success: false, error: "Gagal memproses file upload." };
  }
}

export async function deleteFile(publicFilePath: string): Promise<boolean> {
  try {
    if (!publicFilePath.startsWith("/uploads/")) {
      return false; // Jangan hapus file di luar /uploads/ (misalnya gambar dummy /images/)
    }
    const fileName = path.basename(publicFilePath);
    const fullPath = path.join(UPLOADS_DIR, fileName);
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Gagal menghapus file:", error);
    return false;
  }
}

