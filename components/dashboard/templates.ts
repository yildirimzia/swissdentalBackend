export type TemplateOptionId = "default" | "benefits_for_patients";

export const TEMPLATE_OPTIONS: Array<{
  id: TemplateOptionId;
  label: string;
  description: string;
}> = [
  {
    id: "default",
    label: "Serbest içerik sayfası",
    description: "Serbest metin tabanlı içerikler hazırlayın ve yayınlayın.",
  },
  {
    id: "benefits_for_patients",
    label: "Hasta faydaları sayfası",
    description: "Hasta faydalarına özel hazır bloklarla hızlı sayfa hazırlayın.",
  },
];

export const TEMPLATE_LABEL_MAP: Record<TemplateOptionId, string> = {
  default: "Serbest içerik sayfası",
  benefits_for_patients: "Hasta faydaları sayfası",
};

export type BenefitsComponentType =
  | "hero"
  | "whyCeramic"
  | "introText"
  | "sectionImage"
  | "ceramicAdvantages"
  | "serviceBlock"
  | "slider"
  | "pioneeringWork"
  | "doctor";

export interface BenefitsComponent {
  id: BenefitsComponentType;
  label: string;
  description: string;
  icon: string;
  previewImage?: string;
  previewUrl?: string; // Önizleme için URL
}

export const BENEFITS_COMPONENTS: BenefitsComponent[] = [
  {
    id: "hero",
    label: "Hero Alanı",
    description: "Sayfanın üst kısmındaki ana görsel ve başlık alanı. Dikkat çekici giriş yapar.",
    icon: "🎯",
    previewUrl: "http://localhost:4000/preview/components#hero-preview",
  },
  {
    id: "whyCeramic",
    label: "Neden Seramik Kartları",
    description: "Seramik implantların özelliklerini ve avantajlarını gösteren kart listesi.",
    icon: "📋",
    previewUrl: "http://localhost:4000/preview/components#why-ceramic-preview",
  },
  {
    id: "introText",
    label: "Giriş Paragrafı",
    description: "Sayfanın ana tanıtım metni. Ürün veya hizmet hakkında genel bilgi verir.",
    icon: "📝",
    previewUrl: "http://localhost:4000/preview/components#intro-text-preview",
  },
  {
    id: "sectionImage",
    label: "Arka Plan Görseli",
    description: "Sayfaya görsel zenginlik katan büyük format görsel alanı.",
    icon: "🖼️",
    previewUrl: "http://localhost:4000/preview/components#section-image-preview",
  },
  {
    id: "ceramicAdvantages",
    label: "Seramik Avantajları",
    description: "Seramik implantların titanyuma üstünlüklerini anlatan numaralı kartlar.",
    icon: "⭐",
    previewUrl: "http://localhost:4000/preview/components#ceramic-advantages-preview",
  },
  {
    id: "serviceBlock",
    label: "Hizmet Bloğu",
    description: "Diş hekimlerine sunulan hizmetleri tanıtan görsel ve metin bloğu.",
    icon: "🏥",
    previewUrl: "http://localhost:4000/preview/components#service-block-preview",
  },
  {
    id: "slider",
    label: "Referans Slider",
    description: "Memnun hastaların deneyimlerini gösteren referans slider'ı.",
    icon: "💬",
    previewUrl: "http://localhost:4000/preview/components#slider-preview",
  },
  {
    id: "pioneeringWork",
    label: "Öncü Çalışma",
    description: "Swiss Biohealth Clinic ve öncü çalışmalarını tanıtan bölüm.",
    icon: "🚀",
    previewUrl: "http://localhost:4000/preview/components#pioneering-work-preview",
  },
  {
    id: "doctor",
    label: "Doktor Bilgisi",
    description: "Uzman doktor bilgilerini ve deneyimlerini gösteren profil bölümü.",
    icon: "👨‍⚕️",
    previewUrl: "http://localhost:4000/preview/components#doctor-preview",
  },
];
