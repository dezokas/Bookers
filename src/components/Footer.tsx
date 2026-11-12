import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant/30">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12">
          {/* Brand & Mission */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm">
                <span className="material-symbols-outlined text-[18px]">menu_book</span>
              </div>
              <span className="font-headline text-2xl font-bold tracking-tight text-primary">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-sm text-on-surface-variant max-w-md leading-relaxed">
              Membawa semesta literasi berkualitas lebih dekat kepada pembaca Indonesia melalui kurasi
              buku pilihan, penerbitan independen, dan ruang baca inklusif.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              </a>
              <a
                href={siteConfig.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">business_center</span>
              </a>
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">smart_display</span>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h3 className="text-base font-bold text-on-surface">Tautan Navigasi</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-on-surface-variant">
              <li>
                <a href="#beranda" className="hover:text-primary transition-colors">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#tentang-kami" className="hover:text-primary transition-colors">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#layanan" className="hover:text-primary transition-colors">
                  Layanan &amp; Kurasi
                </a>
              </li>
              <li>
                <a href="#kabar-artikel" className="hover:text-primary transition-colors">
                  Kabar &amp; Artikel
                </a>
              </li>
              <li>
                <a href="#kontak" className="hover:text-primary transition-colors">
                  Kontak &amp; Lokasi
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <h3 className="text-base font-bold text-on-surface">Informasi Kontak</h3>
            <div className="flex flex-col gap-3 text-sm text-on-surface-variant">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                  schedule
                </span>
                <span>{siteConfig.contact.operatingHours}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                  location_on
                </span>
                <span>{siteConfig.contact.address}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                  mail
                </span>
                <span>{siteConfig.contact.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-4 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
          <p>© {new Date().getFullYear()} Bookers Indonesia. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-6">
            <a href="#kontak" className="hover:text-primary transition-colors">
              Kebijakan Privasi
            </a>
            <a href="#kontak" className="hover:text-primary transition-colors">
              Syarat &amp; Ketentuan
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

