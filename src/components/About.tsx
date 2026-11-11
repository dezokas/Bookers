import Image from "next/image";
import { siteConfig } from "@/config/site";

export default function About() {
  return (
    <section className="relative w-full bg-surface-container-low py-16 lg:py-24 scroll-mt-20" id="tentang-kami">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-12 flex flex-col gap-14">
        {/* Section Tag & Heading */}
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-container text-on-secondary-container w-fit border border-secondary/20">
            <span className="material-symbols-outlined text-[16px]">auto_stories</span>
            <span className="text-xs font-bold uppercase tracking-wider">TENTANG BOOKERS</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <h2 className="lg:col-span-7 font-headline text-2xl sm:text-3xl lg:text-4xl font-bold text-on-surface leading-tight">
              Lebih dari Sekadar Toko Buku, Kami Rumah Bagi Para Penikmat Kata
            </h2>
            <p className="lg:col-span-5 text-base sm:text-lg text-on-surface-variant leading-relaxed">
              {siteConfig.about.story}
            </p>
          </div>
        </div>

        {/* Supporting Photo & Quote Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Photo */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden shadow-sm relative group bg-surface border border-outline-variant/30 flex flex-col">
            <div className="relative w-full h-[320px] sm:h-[400px] overflow-hidden bg-surface-container">
              <Image
                src="/images/about-team.jpg"
                alt="Tim Editor dan Kurator Sastra Bookers Mengulas Naskah"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>
            <div className="p-4 bg-surface flex items-center gap-3 text-on-surface-variant text-xs sm:text-sm">
              <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">
                photo_camera
              </span>
              <p>
                Tim editor &amp; kurator Bookers saat sesi telaah naskah literatur Nusantara di Studio
                Redaksi Senopati.
              </p>
            </div>
          </div>

          {/* Distinct Values / Stats Box */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6 p-8 lg:p-10 rounded-2xl bg-surface shadow-sm border border-outline-variant/30">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Manifesto Redaksional
              </span>
              <blockquote className="font-headline text-lg sm:text-xl text-on-surface italic leading-relaxed">
                {siteConfig.about.quote}
              </blockquote>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-6 bg-surface-container-low/70 p-6 rounded-xl border border-outline-variant/20">
              {siteConfig.about.stats.map((stat, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span
                    className={`font-headline text-2xl sm:text-3xl font-bold ${
                      i % 2 === 0 ? "text-primary-container" : "text-secondary"
                    }`}
                  >
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-sm text-on-surface-variant font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3 Key Strengths Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {siteConfig.about.strengths.map((item, index) => {
            const isPrimary = item.theme === "primary";
            const isSecondary = item.theme === "secondary";

            return (
              <div
                key={index}
                className="p-8 rounded-2xl bg-surface flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow border border-outline-variant/30"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isPrimary
                      ? "bg-primary-fixed text-on-primary-fixed-variant"
                      : isSecondary
                      ? "bg-secondary-container text-on-secondary-container"
                      : "bg-tertiary-container/30 text-tertiary"
                  }`}
                >
                  <span className="material-symbols-outlined text-[26px]">{item.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-on-surface">{item.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

