import fs from "fs";
import path from "path";
import { Role, User, NewsRecord } from "./types";

interface DbRequestPayload {
  action: "getAll" | "getById" | "getByField" | "create" | "update" | "delete" | "ping";
  table?: string;
  id?: string;
  field?: string;
  value?: any;
  data?: any;
  secret?: string;
}

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;
const APPS_SCRIPT_SECRET = process.env.APPS_SCRIPT_SECRET || "bookers_super_secret_token_2026";

// File lokal untuk fallback dev jika URL Apps Script belum diisi oleh pengguna
const LOCAL_DB_PATH = path.join(process.cwd(), "data", "local-database.json");

function ensureLocalDbFile() {
  const dir = path.dirname(LOCAL_DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(LOCAL_DB_PATH)) {
    const now = new Date().toISOString();
    const initialData = {
      Roles: [
        {
          id: "role_admin",
          name: "admin",
          description: "Pengelola penuh sistem, konten, role, dan akun pengguna",
          permissions: "*",
          is_system: "true",
          created_at: now,
        },
        {
          id: "role_user",
          name: "user",
          description: "Pengguna terdaftar (pembaca & anggota komunitas)",
          permissions: "read:news,order:create",
          is_system: "true",
          created_at: now,
        },
      ],
      Users: [
        {
          id: "usr_admin_default",
          name: "Administrator Bookers",
          email: "admin@gmail.com",
          password_hash: "$2b$10$yN3AHMwy7PZwgJIcfSXSLe4ph3eUgIXuHbUNM1fLNiacclitb9jg6", // 123456
          role_id: "role_admin",
          status: "active",
          created_at: now,
          updated_at: now,
        },
      ],
      News: [
        {
          id: "news_1",
          title: "Membaca Ulang Realisme Magis dalam Lanskap Sastra Asia Tenggara Kontemporer",
          slug: "realisme-magis-asia-tenggara",
          excerpt:
            "Bagaimana penulis muda Indonesia mengolah kembali mitos lokal menjadi refleksi kritis persoalan sosial modern.",
          content:
            "Karya sastra realisme magis kembali menemukan ruang hangat di kalangan pembaca muda tanah air. Melalui perpaduan kearifan lokal dan kritik sosial kontemporer, naskah-naskah terbaru menyajikan dialog mendalam yang tidak sekadar menghibur namun juga menggugah nalar kritis.",
          thumbnail_path: "/images/news-1.jpg",
          status: "published",
          author_id: "usr_admin_default",
          created_at: "2025-05-14T10:00:00.000Z",
          updated_at: now,
        },
        {
          id: "news_2",
          title: "Malam Puisi Senopati: Membuka Ruang Dialog Inklusif bagi Generasi Baru",
          slug: "malam-puisi-senopati",
          excerpt:
            "Ratusan penikmat sastra berkumpul di Bookers Lounge merayakan peluncuran antologi puisi kemanusiaan dan kebebasan berekspresi.",
          content:
            "Suasana temaram hangat di Bookers Senopati menjadi saksi pertemuan lebih dari seratus pecinta bait puisi. Program rutin mingguan ini membuka panggung bebas bagi siapa pun yang ingin membacakan karya maupun mendengarkan curahan renungan sastra.",
          thumbnail_path: "/images/news-2.jpg",
          status: "published",
          author_id: "usr_admin_default",
          created_at: "2025-05-08T19:30:00.000Z",
          updated_at: now,
        },
        {
          id: "news_3",
          title: "Panduan Menyusun Proposal Naskah yang Memikat Penerbit Idaman Anda",
          slug: "panduan-proposal-naskah",
          excerpt:
            "Langkah-langkah esensial dari meja dewan redaksi Bookers untuk membantu karya perdana Anda lolos telaah kurasi tanpa berbelit.",
          content:
            "Banyak naskah brilian gagal tembus ke meja redaksi hanya karena penyusunan proposal sinopsis yang kurang terstruktur. Artikel panduan ini merangkum 5 poin kunci yang selalu dinilai oleh dewan kurator Bookers saat meninjau karya baru.",
          thumbnail_path: "/images/news-3.jpg",
          status: "published",
          author_id: "usr_admin_default",
          created_at: "2025-04-29T14:00:00.000Z",
          updated_at: now,
        },
      ],
    };
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initialData, null, 2), "utf-8");
  }
}

function readLocalDb(): Record<string, any[]> {
  ensureLocalDbFile();
  try {
    const raw = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { Roles: [], Users: [], News: [] };
  }
}

function writeLocalDb(data: Record<string, any[]>) {
  ensureLocalDbFile();
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function syncLocalBackup(payload: DbRequestPayload, resultData: any) {
  if (!payload.table) return;
  const db = readLocalDb();
  const rows = db[payload.table] || [];

  if (payload.action === "create" && resultData) {
    const exists = rows.some((r: any) => String(r.id) === String(resultData.id));
    if (!exists) {
      rows.push(resultData);
      db[payload.table] = rows;
      writeLocalDb(db);
    }
  } else if (payload.action === "update" && resultData) {
    const index = rows.findIndex((r: any) => String(r.id) === String(payload.id));
    if (index !== -1) {
      rows[index] = { ...rows[index], ...resultData };
      db[payload.table] = rows;
      writeLocalDb(db);
    }
  } else if (payload.action === "delete" && payload.id) {
    db[payload.table] = rows.filter((r: any) => String(r.id) !== String(payload.id));
    writeLocalDb(db);
  }
}

/**
 * Pemanggil utama database.
 * Jika APPS_SCRIPT_URL tersedia, mengirim request ke Apps Script Web App.
 * Jika belum dikonfigurasi, menggunakan Local Database (persisten di data/local-database.json).
 */
async function callAppsScript(payload: DbRequestPayload): Promise<any> {
  const appsScriptUrl = process.env.APPS_SCRIPT_URL?.trim();
  const secret = process.env.APPS_SCRIPT_SECRET?.trim() || "bookers_super_secret_token_2026";

  if (appsScriptUrl && appsScriptUrl !== "") {
    try {
      const res = await fetch(appsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, secret: secret }),
        redirect: "follow",
        cache: "no-store",
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || "Gagal memproses request di Apps Script");
      }

      // Update backup lokal agar data selalu tersinkron
      try {
        syncLocalBackup(payload, json.data);
      } catch {}

      return json.data !== undefined ? json.data : json;
    } catch (err: any) {
      console.error("Gagal menghubungkan ke Google Apps Script, beralih ke local fallback:", err.message);
    }
  }

  // --- LOCAL FALLBACK ENGINE ---
  const db = readLocalDb();
  const table = payload.table || "";
  const rows = db[table] || [];

  switch (payload.action) {
    case "ping":
      return { success: true, mode: "local-fallback" };

    case "getAll":
      return rows;

    case "getById":
      return rows.find((r: any) => String(r.id) === String(payload.id)) || null;

    case "getByField":
      return (
        rows.find(
          (r: any) =>
            String(r[payload.field!]).toLowerCase() ===
            String(payload.value).toLowerCase()
        ) || null
      );

    case "create": {
      const now = new Date().toISOString();
      const newRecord = {
        ...payload.data,
        id: payload.data.id || `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        created_at: payload.data.created_at || now,
        updated_at: now,
      };
      rows.push(newRecord);
      db[table] = rows;
      writeLocalDb(db);
      return newRecord;
    }

    case "update": {
      const now = new Date().toISOString();
      const index = rows.findIndex((r: any) => String(r.id) === String(payload.id));
      if (index === -1) {
        throw new Error(`Data dengan ID ${payload.id} tidak ditemukan.`);
      }
      const updated = {
        ...rows[index],
        ...payload.data,
        updated_at: now,
      };
      rows[index] = updated;
      db[table] = rows;
      writeLocalDb(db);
      return updated;
    }

    case "delete": {
      const filtered = rows.filter((r: any) => String(r.id) !== String(payload.id));
      db[table] = filtered;
      writeLocalDb(db);
      return true;
    }

    default:
      throw new Error(`Aksi ${payload.action} tidak dikenali`);
  }
}

export const db = {
  async getAll<T = any>(table: string): Promise<T[]> {
    return callAppsScript({ action: "getAll", table });
  },

  async getById<T = any>(table: string, id: string): Promise<T | null> {
    return callAppsScript({ action: "getById", table, id });
  },

  async getByField<T = any>(table: string, field: string, value: any): Promise<T | null> {
    return callAppsScript({ action: "getByField", table, field, value });
  },

  async create<T = any>(table: string, data: any): Promise<T> {
    return callAppsScript({ action: "create", table, data });
  },

  async update<T = any>(table: string, id: string, data: any): Promise<T> {
    return callAppsScript({ action: "update", table, id, data });
  },

  async delete(table: string, id: string): Promise<boolean> {
    return callAppsScript({ action: "delete", table, id });
  },

  async ping(): Promise<{ success: boolean; mode?: string }> {
    return callAppsScript({ action: "ping" });
  },
};

