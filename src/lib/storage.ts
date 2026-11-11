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

export async function saveFile(file: any): Promise<{ success: boolean; filePath?: string; error?: string }> {
  try {
    if (!file) {
      return { success: false, error: "File tidak ditemukan." };
    }

    const fileName = file.name || "image.jpg";
    const ext = path.extname(fileName).toLowerCase() || ".jpg";
    const isImageExt = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".jfif"].includes(ext);
    const isImageMime = file.type?.startsWith("image/") || ALLOWED_MIME_TYPES.includes(file.type);

    if (!isImageExt && !isImageMime) {
      return { success: false, error: "Hanya format gambar JPG, PNG, atau WEBP yang diperbolehkan." };
    }

    if (file.size && file.size > MAX_FILE_SIZE) {
      return { success: false, error: "Ukuran file terlalu besar. Maksimal 5MB." };
    }

    let buffer: Buffer;
    if (typeof file.arrayBuffer === "function") {
      buffer = Buffer.from(await file.arrayBuffer());
    } else if (Buffer.isBuffer(file)) {
      buffer = file;
    } else {
      return { success: false, error: "Format data upload tidak valid." };
    }

    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    const safeName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
    const targetPath = path.join(UPLOADS_DIR, safeName);

    await fs.promises.writeFile(targetPath, buffer);

    const publicPath = `/uploads/${safeName}`;
    return { success: true, filePath: publicPath };
  } catch (error: any) {
    console.error("Gagal menyimpan file:", error);
    return { success: false, error: `Gagal memproses file upload: ${error?.message || "Kesalahan server"}` };
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

