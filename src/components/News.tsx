"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { NewsRecord } from "@/lib/types";

export default function News() {
  const [articles, setArticles] = useState<any[]>(siteConfig.news);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.news && data.news.length > 0) {
          // Format dari database menjadi bentuk yang serasi dengan UI
          const mapped = data.news.map((n: NewsRecord, idx: number) => ({
            id: n.id,
            title: n.title,
            slug: n.slug,
            excerpt: n.excerpt,
            content: n.content,
            category: idx % 2 === 0 ? "Resensi Buku" : "Kabar Komunitas",
            date: new Date(n.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            readTime: "5 mnt baca",
            thumbnail: n.thumbnail_path || "/images/news-1.jpg",
          }));
          setArticles(mapped);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative w-full bg-surface-container-low py-16 lg:py-24 scroll-mt-20" id="kabar-artikel">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-12 flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col items-start gap-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-container text-on-secondary-container border border-secondary/20">
            <span className="material-symbols-outlined text-[16px]">newspaper</span>
            <span className="text-xs font-bold uppercase tracking-wider">KABAR &amp; ARTIKEL</span>
          </div>

          <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-bold text-on-surface leading-tight">
            Wawasan, Resensi, &amp; Cerita Seputar Sastra Terkini
          </h2>
          <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed">
            Kumpulan esai reflektif, rangkuman peristiwa komunitas buku, serta catatan praktis
            penulisan naskah langsung dari meja dewan redaksi Bookers.
          </p>
        </div>

        {/* 3 Editorial Article Cards (Real-time from Database) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((item, index) => {
            const isCategorySecondary = index !== 1;

            return (
              <article
                key={item.id}
                className="flex flex-col bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group border border-outline-variant/30"
              >
                {/* Thumbnail */}
                <div className="w-full h-52 overflow-hidden bg-surface-container relative">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                        isCategorySecondary
                          ? "bg-secondary-container text-on-secondary-container"
                          : "bg-primary-fixed text-on-primary-fixed-variant"
                      }`}
                    >
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Article Info */}
                <div className="p-6 flex flex-col flex-1 justify-between gap-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-on-surface-variant text-xs">
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                      <span>{item.date}</span>
                      <span>•</span>
                      <span>{item.readTime}</span>
                    </div>

                    <h3 className="font-headline text-lg font-bold text-on-surface group-hover:text-primary transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-sm text-on-surface-variant line-clamp-3 leading-relaxed">
                      {item.excerpt}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedArticle(item)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary-container hover:text-primary transition-colors pt-2 text-left"
                  >
                    <span>Baca Selengkapnya</span>
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Center Button CTA */}
        <div className="flex justify-center pt-4">
          <a
            href="#kontak"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-semibold bg-surface text-on-surface hover:bg-surface-container hover:text-primary transition-all shadow-sm border border-outline-variant/30"
          >
            <span>Lihat Semua Artikel &amp; Esai</span>
            <span className="material-symbols-outlined text-[18px]">feed</span>
          </a>
        </div>
      </div>

      {/* Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-surface rounded-2xl max-w-2xl w-full p-6 sm:p-8 border border-outline-variant/30 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                {selectedArticle.category}
              </span>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="relative w-full h-64 rounded-xl overflow-hidden bg-surface-container">
              <Image
                src={selectedArticle.thumbnail}
                alt={selectedArticle.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <span>{selectedArticle.date}</span>
              <span>•</span>
              <span>{selectedArticle.readTime}</span>
            </div>

            <h2 className="font-headline text-2xl font-bold text-on-surface leading-tight">
              {selectedArticle.title}
            </h2>

            <div className="text-sm italic text-on-surface-variant border-l-3 border-primary-container pl-3 py-1 bg-surface-container-low/60 rounded-r-lg">
              {selectedArticle.excerpt}
            </div>

            <div className="text-sm text-on-surface leading-relaxed whitespace-pre-line pt-2">
              {selectedArticle.content || selectedArticle.excerpt}
            </div>

            <div className="flex justify-end pt-4 border-t border-outline-variant/30 mt-2">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-primary text-on-primary hover:bg-primary-container transition-all"
              >
                Tutup Bacaan
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
