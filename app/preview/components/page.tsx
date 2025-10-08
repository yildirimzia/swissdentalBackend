"use client";

import { useState, useEffect } from "react";

type ComponentType =
  | "hero"
  | "whyCeramic"
  | "introText"
  | "sectionImage"
  | "ceramicAdvantages"
  | "serviceBlock"
  | "slider"
  | "pioneeringWork"
  | "doctor";

const COMPONENT_INFO: Record<
  ComponentType,
  { label: string; description: string; icon: string }
> = {
  hero: {
    label: "Hero Alanı",
    description: "Sayfanın üst kısmındaki ana görsel ve başlık alanı",
    icon: "🎯",
  },
  whyCeramic: {
    label: "Neden Seramik Kartları",
    description: "Seramik implantların özelliklerini gösteren kartlar",
    icon: "📋",
  },
  introText: {
    label: "Giriş Paragrafı",
    description: "Ana tanıtım metni",
    icon: "📝",
  },
  sectionImage: {
    label: "Arka Plan Görseli",
    description: "Büyük format görsel alanı",
    icon: "🖼️",
  },
  ceramicAdvantages: {
    label: "Seramik Avantajları",
    description: "Titanyuma üstünlükleri anlatan numaralı kartlar",
    icon: "⭐",
  },
  serviceBlock: {
    label: "Hizmet Bloğu",
    description: "Diş hekimlerine sunulan hizmetler",
    icon: "🏥",
  },
  slider: {
    label: "Referans Slider",
    description: "Hasta deneyimlerini gösteren slider",
    icon: "💬",
  },
  pioneeringWork: {
    label: "Öncü Çalışma",
    description: "Swiss Biohealth Clinic tanıtımı",
    icon: "🚀",
  },
  doctor: {
    label: "Doktor Bilgisi",
    description: "Uzman doktor profili",
    icon: "👨‍⚕️",
  },
};

const COMPONENTS_ORDER: ComponentType[] = [
  "hero",
  "whyCeramic",
  "introText",
  "sectionImage",
  "ceramicAdvantages",
  "serviceBlock",
  "slider",
  "pioneeringWork",
  "doctor",
];

export default function ComponentPreviewPage() {
  const [activeComponent, setActiveComponent] = useState<ComponentType | null>(null);

  useEffect(() => {
    // Hash'ten component ID'sini al
    const hash = window.location.hash.replace("#", "").replace("-preview", "");
    if (hash && hash in COMPONENT_INFO) {
      setActiveComponent(hash as ComponentType);
    }

    // Hash değişikliklerini dinle
    const handleHashChange = () => {
      const newHash = window.location.hash.replace("#", "").replace("-preview", "");
      if (newHash && newHash in COMPONENT_INFO) {
        setActiveComponent(newHash as ComponentType);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Sadece hangi bileşen olduğunu göster */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-6 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                {activeComponent
                  ? `${COMPONENT_INFO[activeComponent].icon} ${COMPONENT_INFO[activeComponent].label}`
                  : "Bileşen Önizleme"}
              </h1>
              <p className="text-primary-100 text-sm">
                {activeComponent
                  ? COMPONENT_INFO[activeComponent].description
                  : "Önizlemek için bir bileşen seçin"}
              </p>
            </div>
            <button
              onClick={() => window.close()}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
            >
              ✕ Kapat
            </button>
          </div>
        </div>
      </div>

      {/* Component Preview - Sadece seçilen bileşen */}
      <div className="py-0">
        {activeComponent ? (
          <div className="bg-white">
            <ComponentPreview componentId={activeComponent} />
          </div>
        ) : (
          <div className="container mx-auto px-4 py-16">
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <div className="text-6xl mb-4">👆</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                Bir Bileşen Seçin
              </h3>
              <p className="text-gray-500">
                Admin panelinden önizleme butonuna tıklayın
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            SDS Swiss Dental Solutions © 2025
          </p>
        </div>
      </div>
    </div>
  );
}

function ComponentPreview({ componentId }: { componentId: ComponentType }) {
  // Her component için örnek tasarımlar
  const previews: Record<ComponentType, JSX.Element> = {
    hero: (
      <div className="relative bg-gradient-to-br from-primary-50 via-white to-primary-100 rounded-xl p-12 min-h-[400px] flex items-center">
        <div className="max-w-2xl">
          <span className="text-xs uppercase tracking-wider text-primary-600 font-semibold">
            HASTA FAYDALARI
          </span>
          <h1 className="text-5xl font-bold text-charcoal mt-4 mb-6">
            Seramik İmplantlar ile <span className="text-primary-600">Doğal Gülüşünüze</span>{" "}
            Kavuşun
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Metal içermeyen, biyolojik olarak uyumlu seramik implantlarla sağlıklı ve estetik
            çözümler sunuyoruz.
          </p>
          <div className="flex gap-4">
            <div className="px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold">
              Daha Fazla Bilgi
            </div>
            <div className="px-6 py-3 bg-white border-2 border-primary-500 text-primary-700 rounded-lg font-semibold">
              İletişime Geçin
            </div>
          </div>
        </div>
      </div>
    ),
    whyCeramic: (
      <section className="py-20 sm:py-52">
        <div className="container-dental max-w-[1320px] mx-auto">
          <p className="text-center text-mint tracking-[.2em] text-[12px] sm:text-[16px] font-[700] uppercase mb-12 leading-[.05em]">
            NEDEN SERAMİK?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-y-16 gap-x-10">
            {[
              {
                icon: "/images/benefits-for-patients/Heart.svg",
                title: "Biyouyumlu",
                desc: "SDS implantları çok kolay tolere edilir ve kemiğe güvenli bir şekilde entegre olur.",
                href: "https://pubmed.ncbi.nlm.nih.gov/37436947/",
                ctaLabel: "Görüntüle",
              },
              {
                icon: "/images/benefits-for-patients/Weight.svg",
                title: "Dayanıklı ve sağlam",
                desc: "Seramik implantlar artık stabilite ve uzun ömürlülük açısından titanyum implantları geride bırakmıştır.",
                href: "https://www.dginet.de/wp-content/uploads/sites/4/2024/02/20240130_LL_083-039_S3_Keramikimplantate_lang_2022_meta.pdf",
                ctaLabel: "Görüntüle",
              },
              {
                icon: "/images/benefits-for-patients/Zahn.svg",
                title: "Estetik",
                desc: "İmplantlarımız doğal olarak beyazdır. Güzel bir gülüş için estetik çözüm sunar.",
                href: "https://pubmed.ncbi.nlm.nih.gov/35606734/",
                ctaLabel: "Görüntüle",
              },
              {
                icon: "/images/benefits-for-patients/Rocket.svg",
                title: "Minimal radyasyon",
                desc: "Hammaddelerin özenle seçilmesi sayesinde, titanyuma kıyasla minimal radyasyon sağlar.",
                href: "https://www.dinmedia.de/de/norm/din-en-iso-13356/232848189",
                ctaLabel: "Görüntüle",
              },
            ].map((item, i) => (
              <article
                key={i}
                className="text-center flex flex-col items-center mx-auto max-w-[320px]"
              >
                <div className="mb-8 grid place-items-center">
                  <img
                    src={item.icon}
                    alt={item.title}
                    width={140}
                    height={140}
                    className="w-[235px] h-[175px] object-contain"
                  />
                </div>

                <h3 className="text-primary-600 text-[26px] sm:text-[28px] font-bold leading-[1.2]">
                  {item.title}
                </h3>

                <p className="mt-4 text-primary-600 text-[16px] font-extralight leading-7">
                  {item.desc}
                </p>

                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 px-6 py-2 border-2 border-primary-600 text-primary-600 rounded-full font-normal hover:bg-primary-50 transition-colors"
                >
                  {item.ctaLabel}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6"></path>
                    <path d="M11 13l9 -9"></path>
                    <path d="M15 4h5v5"></path>
                  </svg>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    ),
    introText: (
      <div className="prose max-w-none">
        <p className="text-lg text-gray-700 leading-relaxed">
          SDS ekibimiz seramik implant geliştirme alanında öncü olarak 20 yılı aşkın deneyime
          sahiptir. İsviçre Biohealth Kliniğimizde binlerce implantın başarılı kullanımı bize
          geniş bir deneyim kazandırmıştır. Bu deneyim yalnızca doğrudan optimal hasta bakımına
          katkı sağlamaz, aynı zamanda ürünlerimizin sürekli gelişimini de destekler.
        </p>
      </div>
    ),
    sectionImage: (
      <div className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🖼️</div>
            <p className="text-gray-500 font-medium">Büyük Format Görsel Alanı</p>
            <p className="text-sm text-gray-400 mt-2">Swiss Biohealth Clinic görseli burada</p>
          </div>
        </div>
      </div>
    ),
    ceramicAdvantages: (
      <div className="grid md:grid-cols-2 gap-6">
        {[
          {
            no: "1",
            title: "Bütüncül yaklaşım",
            subtitle: "Biyolojik diş hekimliği",
            desc: "SWISS BIOHEALTH konsepti, hastaya odaklanan bütüncül yaklaşım.",
          },
          {
            no: "2",
            title: "Daha kısa tedavi süresi",
            subtitle: "Hızlı iyileşme",
            desc: "Metal olmayan yapı sayesinde daha hızlı iyileşme süreci.",
          },
        ].map((card, i) => (
          <div key={i} className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-xl border border-primary-200">
            <div className="flex items-start gap-4">
              <div className="text-5xl font-bold text-primary-500">{card.no}.</div>
              <div>
                <h4 className="text-xl font-bold text-charcoal mb-1">{card.title}</h4>
                <p className="text-sm text-primary-600 font-semibold mb-2">{card.subtitle}</p>
                <p className="text-gray-600">{card.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
    serviceBlock: (
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white p-12 rounded-xl">
        <div className="max-w-2xl">
          <div className="text-5xl mb-4">🏥</div>
          <h3 className="text-3xl font-bold mb-4">Diş Hekimlerine Hizmetlerimiz</h3>
          <p className="text-primary-100 mb-6">
            Uzman ekibimiz ve gelişmiş teknolojimizle diş hekimlerine kapsamlı destek sağlıyoruz.
          </p>
          <div className="px-6 py-3 bg-white text-primary-700 rounded-lg font-semibold inline-block">
            Detaylı Bilgi
          </div>
        </div>
      </div>
    ),
    slider: (
      <div className="bg-gray-100 p-8 rounded-xl">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="text-5xl">💬</div>
            <div>
              <p className="text-gray-700 italic mb-4">
                "Seramik implant tedavisi sonrası kendimi çok daha iyi hissediyorum. Doğal ve
                estetik bir sonuç elde ettim."
              </p>
              <p className="font-semibold text-charcoal">— Memnun Hasta</p>
            </div>
          </div>
        </div>
      </div>
    ),
    pioneeringWork: (
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <div className="text-5xl mb-4">🚀</div>
          <h3 className="text-3xl font-bold text-charcoal mb-4">Öncü Çalışmalarımız</h3>
          <p className="text-gray-600 mb-6">
            Swiss Biohealth Clinic olarak seramik implant teknolojisinde öncü çalışmalar
            yürütüyoruz. 20 yılı aşkın deneyimimizle sektöre yön veriyoruz.
          </p>
          <div className="px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold inline-block">
            Daha Fazla
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-64 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-4xl mb-2">🏥</div>
            <p className="text-sm">Swiss Biohealth Clinic Görseli</p>
          </div>
        </div>
      </div>
    ),
    doctor: (
      <div className="bg-white p-8 rounded-xl border-2 border-gray-100">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center text-6xl flex-shrink-0">
            👨‍⚕️
          </div>
          <div>
            <h3 className="text-2xl font-bold text-charcoal mb-2">Dr. Uzman İsim</h3>
            <p className="text-primary-600 font-semibold mb-4">Seramik İmplant Uzmanı</p>
            <p className="text-gray-600 mb-4">
              20 yılı aşkın deneyime sahip seramik implant uzmanımız, yüzlerce başarılı tedavi
              gerçekleştirmiştir. Hasta memnuniyeti ve sağlık her şeyden önemlidir.
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
                Seramik İmplant
              </span>
              <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
                Biyolojik Diş Hekimliği
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
  };

  return previews[componentId];
}
