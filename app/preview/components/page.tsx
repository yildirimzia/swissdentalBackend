"use client";

import { useState, useEffect } from "react";

import Button from "./Button";

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

  // Kebab-case'i camelCase'e çevir
  const kebabToCamel = (str: string) => {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  };

  useEffect(() => {
    // Hash'ten component ID'sini al
    const hash = window.location.hash.replace("#", "").replace("-preview", "");
    const camelCaseHash = kebabToCamel(hash);
    
    if (camelCaseHash && camelCaseHash in COMPONENT_INFO) {
      setActiveComponent(camelCaseHash as ComponentType);
    }

    // Hash değişikliklerini dinle
    const handleHashChange = () => {
      const newHash = window.location.hash.replace("#", "").replace("-preview", "");
      const camelCaseNewHash = kebabToCamel(newHash);
      
      if (camelCaseNewHash && camelCaseNewHash in COMPONENT_INFO) {
        setActiveComponent(camelCaseNewHash as ComponentType);
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
      <section>
        <div className="lg:max-w-[1380px] 2xl:max-w-[1620px] grid grid-cols-1 lg:grid-cols-[40%_60%] items-center ml-auto">
          <div className="flex flex-col justify-start p-6 order-2 lg:order-1">
            <p className="text-mint font-[300] text-[16px] tracking-[.05em] uppercase mb-4 relative flex items-center">
              <span className="hidden sm:inline-block w-[100px] h-[1px] bg-mint mr-4" />
              FAYDALAR
            </p>

            <h2 className="text-primary-600 text-[26px] sm:text-[40px] font-[500] sm:font-[400] leading-[1.2] mb-6">
              Biyolojik diş yerine geçen seramik implantlar
            </h2>

            <p className="text-primary-600 text-[16px] font-[300] max-w-[420px] mb-8">
              Zirkonyadan yapılmış titanyum alternatifleri yüksek derecede uyumlu ve hijyenik kabul edilmektedir. Bu implantlar, optimal diş eti yapışmasını sağlar, doku stresini en aza indirir ve alerji veya intoleranslar için ideal hale getirir.
            </p>

            <Button 
              variant="customOutline" 
              size="custom16" 
              rounded="rounded-full"
              className="!shadow-none mt-8 !font-[400]"
              iconPosition="right"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M5 12l14 0"></path>
                  <path d="M13 18l6 -6"></path>
                  <path d="M13 6l6 6"></path>
                </svg>
              }
            >
              Tüm faydaları görüntüle
            </Button>
          </div>

          <div
            className="order-1 lg:order-2 block h-[546px] bg-cover sm:bg-auto sm:h-[920px] w-full bg-no-repeat bg-bottom"
            style={{ backgroundImage: "url(/images/benefits-for-patients/Patientin-Vorteile.png)" }}
          ></div>
        </div>
      </section>
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
                  className="mt-6 w-fit"
                >
                  <Button
                    variant="customOutline"
                    size="custom16"
                    rounded="rounded-full"
                    className="!font-[400]"
                    iconPosition="right"
                    icon={
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
                    }
                  >
                    {item.ctaLabel}
                  </Button>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    ),
    introText: (
      <section>
        <div className="transition-all duration-1000 ease-out opacity-100 translate-y-0">
          <div className="sm:p-24 p-16 space-y-2 max-w-[55rem] mx-auto sm:px-4 px-6 text-left">
            <p className="leading-[1.4] tracking-[-.96px] font-extralight text-primary-600 mx-auto max-w-prose text-[clamp(20px,calc(-37.2307692308px_+_.0576923077_*_100vw),32px)] whitespace-pre-line">
              SDS ekibimiz seramik implant geliştirme alanında öncü olarak 20 yılı aşkın deneyime sahiptir.
              İsviçre Biohealth Kliniğimizde binlerce implantın başarılı kullanımı bize geniş bir deneyim kazandırmıştır.
              Bu deneyim yalnızca doğrudan optimal hasta bakımına katkı sağlamaz, aynı zamanda ürünlerimizin sürekli gelişimini de destekler.
              Yenilik ve en yüksek kaliteye olan bağlılığımız, seramik implantolojideki başarımızın temelini oluşturur.
            </p>
          </div>
        </div>
      </section>
    ),
    sectionImage: (
      <section className="relative flex justify-center w-full overflow-hidden mx-auto">
        <img
          src="/images/benefits-for-patients/Swiss-Biohealth-Clinic.jpg"
          alt="Swiss Biohealth Clinic"
          className="object-cover z-1 p-6 sm:p-0 max-w-[1272px] h-auto"
        />
        <div className="absolute inset-0">
          <div className="h-1/2" />
          <div className="h-1/2 bg-white" />
        </div>
      </section>
    ),
    ceramicAdvantages: (
      <section id="ceramic-advantages" className="bg-[linear-gradient(to_bottom,#FFFFFF_0%,#FEFEFE_25%,#FDFDFD_50%,#FCFCFC_75%,#FBFBFB_100%)] pb-24">
        <div className="container-dental max-w-[1320px] px-6 sm:px-8 mx-auto py-20">
          <p className="text-center text-mint sm:text-[16px] font-[400] uppercase">
            HASTALAR İÇİN FAYDALAR
          </p>

          <h2 className="mt-4 text-center text-primary-600 font-bold leading-[1.15] text-[26px] sm:text-[40px]">
            Seramik implantların titanyuma üstünlükleri
            <span className="text-primary-600 font-[400]"><br />Seramik implantların titanyuma üstünlükleri</span>
          </h2>

          <p className="mx-auto mt-6 max-w-[615px] text-center text-primary-600 text-[16px] leading-7 font-[400]">
            Seramik implantlar, yaygın olarak kullanılan titanyum implantlara en iyi alternatiftir. Titanyum implantlar intoleranslara yol açabilir ve organizmaya metal yükü bindirebilir. Estetik açıdan da seramik implantlar titanyum implantların önündedir; çünkü titanyum implantların griliği sıklıkla yansır.
          </p>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-14">
            {[
              { no: "1.", title: "Bütüncül yaklaşım", subtitle: "Biyolojik diş hekimliği", desc: "SWISS BIOHEALTH konsepti, hastaya ve sağlığına odaklanan bütüncül, biyolojik-tıbbi bir yaklaşımdır." },
              { no: "2.", title: "Daha kısa tedavi süresi", subtitle: "Anında implantasyon", desc: "Yenilikçi tedavi, genellikle çekimden hemen sonra implant yerleştirilmesine imkân tanır. Hızlı, nazik ve çoğu zaman kemik grefti veya antibiyotik gerektirmeden." },
              { no: "3.", title: "Estetik", subtitle: "Koyu kenarlar yok", desc: "SDS seramik implantların doğal diş rengi, diş eti hattında rahatsız edici gri kenarların oluşmasını engeller." },
            ].map((card) => (
              <article key={card.no} className="text-center">
                <div className="text-mint text-[64px] sm:text-[72px] leading-none font-light mb-2">{card.no}</div>
                <h3 className="text-primary-600 text-[26px] sm:text-[32px] font-bold leading-[1.2]">{card.title}</h3>
                <div className="mt-2 text-primary-500 text-[15px] font-[400]">{card.subtitle}</div>
                <p className="mt-5 text-primary-600 text-[16px] leading-7 font-extralight max-w-[520px] mx-auto">{card.desc}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-14">
            {[
              { no: "4.", title: "Seramik daha sağlıklıdır", subtitle: "Tamamen metalsiz", desc: "Ağız boşluğunda metal kullanımı tüm vücudu olumsuz etkileyebilir. Seramik biyouyumlu bir materyal olduğu için optimal uyumluluk sağlanır." },
              { no: "5.", title: "Uygulamadan", subtitle: "Seramik implantolojisinin öncüleri", desc: "Seramik öncüsü Dr. Ulrich Volz tarafından kurulan SDS, seramik implantlar alanında yeniliğin lideridir." },
              { no: "6.", title: "Minimal ağrı", subtitle: "Tedavi öncesi ve sonrası", desc: "Temel unsur, bağışıklık sistemini güçlendirmek ve yan etkilerden kaçınmak için doğal yollarla kemik iyileşmesini teşvik etmektir." },
            ].map((card) => (
              <article key={card.no} className="text-center">
                <div className="text-mint text-[64px] sm:text-[72px] leading-none font-light mb-2">{card.no}</div>
                <h3 className="text-primary-600 text-[26px] sm:text-[32px] font-bold leading-[1.2]">{card.title}</h3>
                <div className="mt-2 text-primary-500 text-[15px] font-[400]">{card.subtitle}</div>
                <p className="mt-5 text-primary-600 text-[16px] leading-7 font-extralight max-w-[520px] mx-auto">{card.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    ),
    serviceBlock: (
      <section className="bg-white overflow-visible">
        <div className="lg:max-w-[1380px] 2xl:max-w-[1620px] grid grid-cols-1 lg:grid-cols-[40%_60%] items-center ml-auto">
          <div className="flex flex-col justify-start p-6 order-2 lg:order-1">
            <p className="text-mint font-[400] text-[16px] tracking-[.05em] uppercase mb-4 relative flex items-center">
              <span className="hidden sm:inline-block w-[100px] h-[1px] bg-mint mr-4" />
              DİŞ HEKİMLERİ İÇİN
            </p>

            <h1 className="text-primary-600 text-[32px] sm:text-[43px] font-[700] leading-[1.2]">
              HİZMETLERİMİZ
            </h1>

            <h2 className="text-primary-600 text-[26px] sm:text-[40px] font-[500] sm:font-[400] leading-[1.2] mb-6">
              Ürünlerimiz kadar özel bir hizmet
            </h2>

            <p className="text-primary-600 text-[16px] font-[300] max-w-[420px] mb-8">
              SDS sadece bir ürün sağlayıcısı değildir. Her zaman yanınızdayız; değerli bilgiler sunar, eğitim etkinlikleri düzenler ve vakalarınızı planlamada sizi aktif olarak destekler.
            </p>

            <Button
              variant="primary"
              size="lg"
              rounded="rounded-[100px]"
              className="text-[16px] font-[400]"
              iconPosition="right"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M5 12l14 0"></path>
                  <path d="M13 18l6 -6"></path>
                  <path d="M13 6l6 6"></path>
                </svg>
              }
            >
              Şimdi bir SDS diş hekimi bulun
            </Button>
          </div>

          <div
            className="order-1 lg:order-2 block w-full bg-no-repeat bg-cover h-[546px] sm:h-[920px]"
            style={{ backgroundImage: "url(/images/benefits-for-patients/Beratungsgespraech.jpg)" }}
          ></div>
        </div>
      </section>
    ),
    slider: (
      <section className="relative bg-[#f6f6f6] py-10 md:py-20 sm:pb-44 overflow-hidden pb-32">
        <div className="pt-24 md:pt-32">
          <div className="relative max-w-[1500px] mx-auto px-4 sm:px-6">
            <h2 className="text-center text-[16px] text-teal-600 font-[300] uppercase mb-10">
              MEMNUN HASTALAR
            </h2>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                { 
                  name: "Johannes Bergmann", 
                  country: "Almanya", 
                  quote: "Ameliyattan sadece dört hafta sonra Engadin Kayak Maratonu'na katılabildim.",
                  href: "https://www.swiss-biohealth.com/en/testimonials/johannes-bergmann"
                },
                { 
                  name: "Martha Berry", 
                  country: "ABD", 
                  quote: "Bir yıldan uzun süre sonra ilk defa yeniden tenis müsabakasında oynamaya başladım. Tam zamanlı işe geri döndüm ve sosyal hayatıma tamamen geri döndüm.",
                  href: "https://www.swiss-biohealth.com/en/testimonials/martha-berry"
                },
              ].map((item, i) => (
                <article key={i} className="bg-white p-6 pt-12 rounded-3xl shadow-lg">
                  <div className="flex flex-col gap-2 text-left">
                    <h3 className="text-primary-600 text-[20px] sm:text-[24px] font-semibold uppercase tracking-[0.2em]">
                      {item.name}
                    </h3>
                    <span className="text-primary-500 text-sm uppercase tracking-[0.3em]">
                      {item.country}
                    </span>
                    <p className="mt-4 text-primary-600 text-[16px] leading-7 font-light min-h-[120px]">
                      {item.quote}
                    </p>
                    <a 
                      href={item.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-6 w-fit"
                    >
                      <Button
                        variant="customOutline"
                        size="custom16"
                        rounded="rounded-full"
                        className="!font-[400]"
                        iconPosition="right"
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6"></path>
                            <path d="M11 13l9 -9"></path>
                            <path d="M15 4h5v5"></path>
                          </svg>
                        }
                      >
                        Devamını oku
                      </Button>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
    pioneeringWork: (
      <section className="bg-white sm:mt-[200px] mt-[50px] overflow-visible">
        <div className="lg:max-w-[1380px] 2xl:max-w-[1620px] grid grid-cols-1 lg:grid-cols-[40%_60%] items-center ml-auto">
          <div className="flex flex-col justify-start p-6 order-2 lg:order-1">
            <p className="text-mint font-[400] text-[16px] tracking-[.05em] uppercase mb-4 relative flex items-center">
              <span className="hidden sm:inline-block w-[100px] h-[1px] bg-mint mr-4" />
              ÖNCÜ ÇALIŞMA
            </p>

            <h1 className="text-primary-600 text-[32px] sm:text-[48px] font-[700] leading-[1.2]">
              SWISS BIOHEALTH CLINIC
            </h1>

            <h2 className="text-primary-600 text-[26px] sm:text-[40px] font-[500] sm:font-[400] leading-[1.2] mb-6">
              Öncü bir tıbbi felsefe
            </h2>

            <p className="text-primary-600 text-[16px] font-[300] max-w-[420px] mb-8 whitespace-pre-line">
              Kreuzlingen'deki SWISS BIOHEALTH CLINIC, biyolojik diş hekimliği alanında mükemmeliyet merkezinizdir. Birinci sınıf diş tedavileri, modern teknolojiler, sağlığınıza bireysel odak, mükemmel hizmet ve sürekli eğitim ile en iyi sonuçları sunuyoruz.
            </p>

            <a 
              href="https://www.swiss-biohealth.com/en" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button
                variant="primary"
                size="lg"
                rounded="rounded-[100px]"
                className="text-[16px] font-[400]"
                iconPosition="right"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M5 12l14 0"></path>
                    <path d="M13 18l6 -6"></path>
                    <path d="M13 6l6 6"></path>
                  </svg>
                }
              >
                SWISS BIOHEALTH CLINIC
              </Button>
            </a>
          </div>

          <div
            className="order-1 lg:order-2 block w-full bg-no-repeat bg-cover h-[546px] sm:h-[920px]"
            style={{ backgroundImage: "url(/images/benefits-for-patients/Klinik.jpg)" }}
          ></div>
        </div>
      </section>
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
