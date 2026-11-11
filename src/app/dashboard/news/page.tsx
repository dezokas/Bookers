"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { NewsRecord } from "@/lib/types";

export default function NewsManagementPage() {
  const [news, setNews] = useState<NewsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modals
  const [editorModalOpen, setEditorModalOpen] = useState(false);
  const [previewNews, setPreviewNews] = useState<NewsRecord | null>(null);
  const [deleteModalNews, setDeleteModalNews] = useState<NewsRecord | null>(null);

  // Form State
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    thumbnail_path: "/images/news-1.jpg",
    status: "published" as "published" | "draft",
  });

  const loadNews = async () => {
    try {
      const res = await fetch("/api/news?all=true");
      const data = await res.json();
      if (data.success) {
        setNews(data.news || []);
      }
    } catch {
      setMessage({ type: "error", text: "Gagal memuat daftar berita." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const openNewEditor = () => {
    setEditId(null);
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      thumbnail_path: "/images/news-1.jpg",
      status: "published",
    });
    setEditorModalOpen(true);
  };

  const openEditEditor = (item: NewsRecord) => {
    setEditId(item.id);
    setFormData({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      thumbnail_path: item.thumbnail_path,
      status: item.status,
    });
    setEditorModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    setMessage(null);

    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Gagal mengunggah gambar." });
      } else {
        setFormData((prev) => ({ ...prev, thumbnail_path: data.filePath }));
        setMessage({ type: "success", text: "Gambar thumbnail berhasil diunggah ke folder lokal." });
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan saat upload gambar." });
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setMessage(null);

    try {
      const method = editId ? "PUT" : "POST";
      const payload = editId ? { id: editId, ...formData } : formData;

      const res = await fetch("/api/news", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Gagal menyimpan artikel." });
      } else {
        setMessage({
          type: "success",
          text: editId ? "Artikel berhasil diperbarui." : "Artikel baru berhasil dipublikasikan.",
        });
        setEditorModalOpen(false);
        loadNews();
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan jaringan." });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteNews = async () => {
    if (!deleteModalNews) return;
    setActionLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/news?id=${deleteModalNews.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Gagal menghapus artikel." });
      } else {
        setMessage({ type: "success", text: "Artikel berhasil dihapus." });
        setDeleteModalNews(null);
        loadNews();
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan saat menghapus artikel." });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl font-bold text-on-surface">Kelola Berita &amp; Artikel</h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Tulis resensi buku, esai sastra, dan kabar komunitas yang tampil langsung di landing page.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewEditor}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-container text-on-primary font-semibold text-xs shadow-sm hover:bg-primary transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Tulis Artikel Baru</span>
        </button>
      </div>

      {/* Alert Messages */}
      {message && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 border ${
            message.type === "success"
              ? "bg-secondary-container text-on-secondary-container border-secondary/20"
              : "bg-error-container text-on-error-container border-error/20"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {message.type === "success" ? "check_circle" : "error"}
          </span>
          <span>{message.text}</span>
        </div>
      )}

      {/* Media Local Note Info */}
      <div className="p-3.5 rounded-xl bg-surface-container-high/60 border border-outline-variant/30 text-xs text-on-surface-variant flex items-start gap-2.5">
        <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
          folder
        </span>
        <div>
          <span className="font-bold text-on-surface">Catatan Media Lokal:</span> Seluruh gambar thumbnail disimpan di folder lokal <code>public/uploads/</code> dan path-nya tersimpan di database.
        </div>
      </div>

      {/* News Table */}
      <div className="bg-surface-container-low rounded-2xl border border-outline-variant/30 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-high/50 text-on-surface-variant font-bold uppercase tracking-wider border-b border-outline-variant/30">
              <tr>
                <th className="py-3.5 px-6">Thumbnail &amp; Judul</th>
                <th className="py-3.5 px-6">Ringkasan</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Tanggal</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-outline">
                    <span className="material-symbols-outlined text-[28px] animate-spin">
                      progress_activity
                    </span>
                    <p className="mt-2 text-xs">Memuat daftar artikel...</p>
                  </td>
                </tr>
              ) : news.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-on-surface-variant">
                    <p className="font-medium">Belum ada artikel berita.</p>
                  </td>
                </tr>
              ) : (
                news.map((item) => {
                  const isPublished = item.status === "published";

                  return (
                    <tr key={item.id} className="hover:bg-surface/50 transition-colors">
                      {/* Thumbnail & Title */}
                      <td className="py-4 px-6 max-w-sm">
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-surface-container shrink-0 border border-outline-variant/30">
                            <Image
                              src={item.thumbnail_path || "/images/news-1.jpg"}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="font-bold text-sm text-on-surface line-clamp-2">
                            {item.title}
                          </span>
                        </div>
                      </td>

                      {/* Excerpt */}
                      <td className="py-4 px-6 text-on-surface-variant max-w-xs">
                        <p className="line-clamp-2">{item.excerpt || "-"}</p>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isPublished
                              ? "bg-secondary-container text-on-secondary-container"
                              : "bg-surface-container-highest text-on-surface-variant"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isPublished ? "bg-secondary" : "bg-outline"
                            }`}
                          />
                          <span>{isPublished ? "Tayang (Published)" : "Draf"}</span>
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 text-on-surface-variant">
                        {new Date(item.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Preview Button */}
                          <button
                            type="button"
                            onClick={() => setPreviewNews(item)}
                            title="Pratinjau Artikel"
                            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              visibility
                            </span>
                          </button>

                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => openEditEditor(item)}
                            title="Edit Artikel"
                            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => setDeleteModalNews(item)}
                            title="Hapus Artikel"
                            className="p-1.5 rounded-lg text-error hover:bg-error-container hover:text-on-error-container transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Editor Form (Tambah / Edit) */}
      {editorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-surface rounded-2xl max-w-2xl w-full p-6 sm:p-8 border border-outline-variant/30 shadow-xl flex flex-col gap-5 my-8">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
              <h3 className="font-headline text-lg font-bold text-on-surface">
                {editId ? "Ubah Artikel Berita" : "Tulis Artikel Berita Baru"}
              </h3>
              <button
                type="button"
                onClick={() => setEditorModalOpen(false)}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveNews} className="flex flex-col gap-4">
              {/* Judul */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">Judul Artikel</label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan judul artikel..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="px-4 py-2.5 rounded-xl bg-surface text-xs border border-outline-variant/40 focus:ring-2 focus:ring-primary-container"
                />
              </div>

              {/* Upload Thumbnail */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-on-surface">
                  Gambar Thumbnail (Unggah File Lokal)
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-surface-container shrink-0 border border-outline-variant/40">
                    <Image
                      src={formData.thumbnail_path || "/images/news-1.jpg"}
                      alt="Thumbnail Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileUpload}
                      disabled={uploadLoading}
                      className="text-xs text-on-surface-variant file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-surface-container file:text-on-surface hover:file:bg-surface-container-high"
                    />
                    <span className="text-[10px] text-outline">
                      {uploadLoading ? "Mengunggah gambar..." : "Format JPG, PNG, WEBP (Maksimal 5MB)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ringkasan */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">Ringkasan Singkat</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ringkasan 1-2 kalimat untuk kartu depan..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="px-4 py-2.5 rounded-xl bg-surface text-xs border border-outline-variant/40 focus:ring-2 focus:ring-primary-container resize-none"
                />
              </div>

              {/* Konten Lengkap */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">Isi Artikel Lengkap</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Tuliskan naskah esai atau artikel berita selengkapnya..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="px-4 py-2.5 rounded-xl bg-surface text-xs border border-outline-variant/40 focus:ring-2 focus:ring-primary-container"
                />
              </div>

              {/* Status */}
              <div className="flex items-center gap-4 pt-1">
                <label className="text-xs font-semibold text-on-surface">Status Publikasi:</label>
                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="published"
                      checked={formData.status === "published"}
                      onChange={() => setFormData({ ...formData, status: "published" })}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="font-semibold text-secondary">Terbitkan (Published)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={formData.status === "draft"}
                      onChange={() => setFormData({ ...formData, status: "draft" })}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-outline">Simpan sebagai Draf</span>
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-outline-variant/30 mt-2">
                <button
                  type="button"
                  onClick={() => setEditorModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-sm"
                >
                  {actionLoading ? "Menyimpan..." : editId ? "Perbarui Artikel" : "Simpan & Publikasikan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Preview Artikel */}
      {previewNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-surface rounded-2xl max-w-xl w-full p-6 border border-outline-variant/30 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Pratinjau Artikel
              </span>
              <button
                type="button"
                onClick={() => setPreviewNews(null)}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="relative w-full h-56 rounded-xl overflow-hidden bg-surface-container">
              <Image
                src={previewNews.thumbnail_path || "/images/news-1.jpg"}
                alt={previewNews.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
              <span>Status: <strong className="capitalize">{previewNews.status}</strong></span>
              <span>•</span>
              <span>
                {new Date(previewNews.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <h2 className="font-headline text-xl font-bold text-on-surface leading-snug">
              {previewNews.title}
            </h2>

            <p className="text-xs italic text-on-surface-variant border-l-2 border-primary pl-3 py-1 bg-surface-container/30">
              {previewNews.excerpt}
            </p>

            <div className="text-xs text-on-surface leading-relaxed whitespace-pre-line pt-2">
              {previewNews.content}
            </div>

            <div className="flex justify-end pt-4 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={() => setPreviewNews(null)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-surface-container text-on-surface hover:bg-surface-container-high"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Hapus Artikel */}
      {deleteModalNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-surface rounded-2xl max-w-sm w-full p-6 border border-outline-variant/30 shadow-xl flex flex-col gap-4">
            <div className="w-12 h-12 rounded-full bg-error-container text-on-error-container flex items-center justify-center self-start">
              <span className="material-symbols-outlined text-[24px]">warning</span>
            </div>
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface">Hapus Artikel</h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                Apakah Anda yakin ingin menghapus artikel <strong>&quot;{deleteModalNews.title}&quot;</strong>?
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalNews(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleDeleteNews}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-error text-on-error hover:bg-error/90 transition-colors shadow-xs"
              >
                {actionLoading ? "Menghapus..." : "Ya, Hapus Artikel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

