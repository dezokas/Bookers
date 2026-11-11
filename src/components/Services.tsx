import { siteConfig } from "@/config/site";

export default function Services() {
  return (
    <section className="relative w-full bg-surface py-16 lg:py-24 scroll-mt-20" id="layanan">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-12 flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col items-start gap-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant border border-primary/20">
            <span className="material-symbols-outlined text-[16px]">design_services</span>
            <span className="text-xs font-bold uppercase tracking-wider">LAYANAN KAMI</span>
          </div>

          <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-bold text-on-surface leading-tight">
            Solusi Lengkap Dunia Buku untuk Pembaca, Penulis, &amp; Komunitas
          </h2>
          <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed">
            Mulai dari penikmat buku kasual hingga institusi pendidikan, kami menyiapkan ekosistem
            komprehensif untuk menyalakan gairah literasi Anda.
          </p>
        </div>

        {/* 6 Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteConfig.services.map((service, index) => {
            const isSecondary = index % 2 === 1;

            return (
              <div
                key={service.id}
                className="group p-8 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 flex flex-col justify-between gap-6 shadow-sm hover:shadow-md border border-outline-variant/30"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-xl bg-surface flex items-center justify-center shadow-sm ${
                        isSecondary ? "text-secondary" : "text-primary-container"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[26px]">
                        {service.icon}
                      </span>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        service.badgeType === "popular"
                          ? "bg-secondary-container text-on-secondary-container shadow-sm"
                          : "bg-surface text-on-surface-variant border border-outline-variant/30"
                      }`}
                    >
                      {service.badge}
                    </span>
                  </div>

                  <h3
                    className={`text-lg font-bold text-on-surface transition-colors ${
                      isSecondary ? "group-hover:text-secondary" : "group-hover:text-primary"
                    }`}
                  >
                    {service.title}
                  </h3>

                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <a
                  href={service.href}
                  className={`flex items-center gap-2 text-sm font-semibold transition-colors pt-2 ${
                    isSecondary
                      ? "text-secondary group-hover:text-on-secondary-container"
                      : "text-primary group-hover:text-primary-container"
                  }`}
                >
                  <span>{service.linkText}</span>
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1.5 transition-transform duration-200">
                    arrow_forward
                  </span>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

