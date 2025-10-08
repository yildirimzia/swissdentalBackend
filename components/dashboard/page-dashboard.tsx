"use client";

import {
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import useSWR from "swr";
import {
  useForm,
  useFieldArray,
  type UseFieldArrayReturn,
} from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  PlusIcon,
  ArrowPathIcon,
  PencilSquareIcon,
  TrashIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";
import { clsx } from "clsx";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import type { CmsPage } from "@/lib/types/page";
import {
  TEMPLATE_OPTIONS,
  TEMPLATE_LABEL_MAP,
  type TemplateOptionId,
} from "@/components/dashboard/templates";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type DashboardState = "idle" | "success" | "error";

const sanitize = (value: string | undefined | null) => (value ?? "").trim();

const navigationItems = [
  {
    id: "create",
    label: "Sayfa oluştur",
    href: "/create-page",
  },
] as const;

const benefitsItemSchema = z.object({
  icon: z.string().min(1, "İkon URL zorunludur"),
  title: z.string().min(1, "Başlık zorunludur"),
  desc: z.string().min(1, "Açıklama zorunludur"),
  href: z.string().min(1, "Bağlantı zorunludur"),
  ctaLabel: z.string().optional(),
});

const benefitsCardSchema = z.object({
  no: z.string().min(1, "Numara zorunludur"),
  title: z.string().min(1, "Başlık zorunludur"),
  subtitle: z.string().min(1, "Alt başlık zorunludur"),
  desc: z.string().min(1, "Açıklama zorunludur"),
});

const testimonialSchema = z.object({
  imgSrc: z.string().min(1, "Görsel URL zorunludur"),
  name: z.string().min(1, "İsim zorunludur"),
  country: z.string().min(1, "Ülke zorunludur"),
  quote: z.string().min(1, "Alıntı zorunludur"),
  cta: z.string().optional(),
  href: z.string().optional(),
});

const benefitsTemplateSchema = z.object({
  hero: z.object({
    eyebrow: z.string().min(1, "Hero etiketi zorunludur"),
    title: z.string().min(1, "Hero başlığı zorunludur"),
    description: z.string().min(1, "Hero açıklaması zorunludur"),
    buttonLabel: z.string().min(1, "Buton metni zorunludur"),
    buttonTarget: z.string().min(1, "Buton hedefi zorunludur"),
    imageUrl: z.string().min(1, "Hero görseli zorunludur"),
  }),
  whyCeramic: z.object({
    eyebrow: z.string().min(1, "Neden seramik etiketi zorunludur"),
    items: z.array(benefitsItemSchema).min(1, "En az bir özellik ekleyin"),
  }),
  introText: z.object({
    text: z.string().min(1, "Metin zorunludur"),
  }),
  sectionImage: z.object({
    imageUrl: z.string().min(1, "Görsel URL zorunludur"),
    alt: z.string().min(1, "Alternatif metin zorunludur"),
  }),
  ceramicAdvantages: z.object({
    eyebrow: z.string().min(1, "Eyebrow zorunludur"),
    title: z.string().min(1, "Başlık zorunludur"),
    highlight: z.string().min(1, "Vurgulu metin zorunludur"),
    intro: z.string().min(1, "Giriş metni zorunludur"),
    cards: z.array(benefitsCardSchema).min(1, "En az bir fayda kartı ekleyin"),
  }),
  serviceBlock: z.object({
    eyebrow: z.string().min(1, "Eyebrow zorunludur"),
    title: z.string().min(1, "Başlık zorunludur"),
    subtitle: z.string().min(1, "Alt başlık zorunludur"),
    description: z.string().min(1, "Açıklama zorunludur"),
    imageUrl: z.string().min(1, "Görsel URL zorunludur"),
    ctaLabel: z.string().min(1, "Buton metni zorunludur"),
    ctaHref: z.string().min(1, "Buton bağlantısı zorunludur"),
  }),
  slider: z.object({
    eyebrow: z.string().min(1, "Eyebrow zorunludur"),
    testimonials: z.array(testimonialSchema).min(1, "En az bir referans ekleyin"),
  }),
  pioneeringWork: z.object({
    eyebrow: z.string().min(1, "Eyebrow zorunludur"),
    title: z.string().min(1, "Başlık zorunludur"),
    subtitle: z.string().min(1, "Alt başlık zorunludur"),
    description: z.string().min(1, "Açıklama zorunludur"),
    imageUrl: z.string().min(1, "Görsel URL zorunludur"),
    ctaLabel: z.string().min(1, "Buton metni zorunludur"),
    ctaHref: z.string().min(1, "Buton bağlantısı zorunludur"),
  }),
  doctor: z.object({
    name: z.string().min(1, "İsim zorunludur"),
    title: z.string().min(1, "Unvan zorunludur"),
    description: z.string().min(1, "Açıklama zorunludur"),
    imageUrl: z.string().min(1, "Görsel URL zorunludur"),
  }),
});

type BenefitsTemplateData = z.infer<typeof benefitsTemplateSchema>;

const BENEFITS_TEMPLATE_DEFAULT: BenefitsTemplateData = {
  hero: {
    eyebrow: "FAYDALAR",
    title: "Biyolojik diş yerine geçen seramik implantlar",
    description:
      "Zirkonyadan yapılmış titanyum alternatifleri yüksek derecede uyumlu ve hijyenik kabul edilmektedir. Bu implantlar, optimal diş eti yapışmasını sağlar, doku stresini en aza indirir ve alerji veya intoleranslar için ideal hale getirir.",
    buttonLabel: "Tüm faydaları görüntüle",
    buttonTarget: "ceramic-advantages",
    imageUrl: "/images/benefits-for-patients/Patientin-Vorteile.png",
  },
  whyCeramic: {
    eyebrow: "NEDEN SERAMİK?",
    items: [
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
    ],
  },
  introText: {
    text: `SDS ekibimiz seramik implant geliştirme alanında öncü olarak 20 yılı aşkın deneyime sahiptir.
İsviçre Biohealth Kliniğimizde binlerce implantın başarılı kullanımı bize geniş bir deneyim kazandırmıştır.
Bu deneyim yalnızca doğrudan optimal hasta bakımına katkı sağlamaz, aynı zamanda ürünlerimizin sürekli gelişimini de destekler.
Yenilik ve en yüksek kaliteye olan bağlılığımız, seramik implantolojideki başarımızın temelini oluşturur.`,
  },
  sectionImage: {
    imageUrl: "/images/benefits-for-patients/Swiss-Biohealth-Clinic.jpg",
    alt: "Swiss Biohealth Clinic",
  },
  ceramicAdvantages: {
    eyebrow: "HASTALAR İÇİN FAYDALAR",
    title: "Seramik implantların",
    highlight: "titanyuma üstünlükleri",
    intro:
      "Seramik implantlar, yaygın olarak kullanılan titanyum implantlara en iyi alternatiftir. Titanyum implantlar intoleranslara yol açabilir ve organizmaya metal yükü bindirebilir. Estetik açıdan da seramik implantlar titanyum implantların önündedir; çünkü titanyum implantların griliği sıklıkla yansır.",
    cards: [
      {
        no: "1.",
        title: "Bütüncül yaklaşım",
        subtitle: "Biyolojik diş hekimliği",
        desc: "SWISS BIOHEALTH konsepti, hastaya ve sağlığına odaklanan bütüncül, biyolojik-tıbbi bir yaklaşımdır.",
      },
      {
        no: "2.",
        title: "Daha kısa tedavi süresi",
        subtitle: "Anında implantasyon",
        desc: "Yenilikçi tedavi, genellikle çekimden hemen sonra implant yerleştirilmesine imkân tanır.",
      },
      {
        no: "3.",
        title: "Estetik",
        subtitle: "Koyu kenarlar yok",
        desc: "SDS seramik implantların doğal diş rengi, diş eti hattında rahatsız edici gri kenarların oluşmasını engeller.",
      },
      {
        no: "4.",
        title: "Seramik daha sağlıklıdır",
        subtitle: "Tamamen metalsiz",
        desc: "Seramik biyouyumlu bir materyal olduğu için optimal uyumluluk sağlanır.",
      },
      {
        no: "5.",
        title: "Uygulamadan",
        subtitle: "Seramik implantolojisinin öncüleri",
        desc: "Seramik öncüsü Dr. Ulrich Volz tarafından kurulan SDS, seramik implantlar alanında yeniliğin lideridir.",
      },
      {
        no: "6.",
        title: "Minimal ağrı",
        subtitle: "Tedavi öncesi ve sonrası",
        desc: "Temel unsur, bağışıklık sistemini güçlendirmek ve yan etkilerden kaçınmak için doğal yollarla kemik iyileşmesini teşvik etmektir.",
      },
    ],
  },
  serviceBlock: {
    eyebrow: "DİŞ HEKİMLERİ İÇİN",
    title: "HİZMETLERİMİZ",
    subtitle: "Ürünlerimiz kadar özel bir hizmet",
    description:
      "SDS sadece bir ürün sağlayıcısı değildir. Her zaman yanınızdayız; değerli bilgiler sunar, eğitim etkinlikleri düzenler ve vakalarınızı planlamada sizi destekler.",
    imageUrl: "/images/benefits-for-patients/Beratungsgespraech.jpg",
    ctaLabel: "Şimdi bir SDS diş hekimi bulun",
    ctaHref: "mailto:info@swissdentalsolutions.com?subject=Request: Find dentist",
  },
  slider: {
    eyebrow: "MEMNUN HASTALAR",
    testimonials: [
      {
        imgSrc: "/images/benefits-for-patients/bergmann_johannes_600.jpg",
        name: "Johannes Bergmann",
        country: "Almanya",
        quote: "Ameliyattan sadece dört hafta sonra Engadin Kayak Maratonu'na katılabildim.",
        cta: "Devamını oku",
        href: "https://www.swiss-biohealth.com/en/testimonials/johannes-bergmann",
      },
      {
        imgSrc: "/images/benefits-for-patients/BerryMartha_600.jpg",
        name: "Martha Berry",
        country: "ABD",
        quote:
          "Bir yıldan uzun süre sonra ilk defa yeniden tenis müsabakasında oynamaya başladım. Tam zamanlı işe geri döndüm ve sosyal hayatıma tamamen geri döndüm.",
        cta: "Devamını oku",
        href: "https://www.swiss-biohealth.com/en/testimonials/martha-berry",
      },
      {
        imgSrc: "/images/benefits-for-patients/King-Dana-768x768.jpg",
        name: "Catherine Stewart",
        country: "İsviçre",
        quote:
          "Yeni dişlerim ve gülüşüm kesinlikle harika. Bu mükemmel gülüşü yaratmak için gösterilen hassasiyet ve özen gerçekten inanılmazdı.",
        cta: "Devamını oku",
        href: "https://www.swiss-biohealth.com/en/testimonials/catherine-stewart",
      },
    ],
  },
  pioneeringWork: {
    eyebrow: "ÖNCÜ ÇALIŞMA",
    title: "SWISS BIOHEALTH CLINIC",
    subtitle: "Öncü bir tıbbi felsefe",
    description:
      "Kreuzlingen’deki SWISS BIOHEALTH CLINIC, biyolojik diş hekimliği alanında mükemmeliyet merkezidir. Birinci sınıf tedaviler, modern teknolojiler ve bireysel odak sunar.",
    imageUrl: "/images/benefits-for-patients/Klinik.jpg",
    ctaLabel: "SWISS BIOHEALTH CLINIC",
    ctaHref: "https://www.swiss-biohealth.com/en",
  },
  doctor: {
    name: "Karl Ulrich Volz",
    title: "Dr. med. dent.",
    description:
      "SDS SWISS DENTAL SOLUTIONS AG ve SWISS BIOHEALTH CLINIC'in kurucusu olarak yaklaşık 30.000 seramik implant yerleştirmiştir ve seramik implantoloji alanında dünya lideridir.",
    imageUrl: "/images/product-lines/Dr-Ulrich-Volz.jpg",
  },
};

const deepClone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const mergeBenefitsTemplateData = (
  override?: Partial<BenefitsTemplateData> | null,
): BenefitsTemplateData => {
  const base = deepClone(BENEFITS_TEMPLATE_DEFAULT);
  if (!override) {
    return base;
  }

  base.hero = {
    ...base.hero,
    ...Object.fromEntries(
      Object.entries(override.hero ?? {}).map(([key, val]) => [key, sanitize(val as string)]),
    ),
  } as BenefitsTemplateData["hero"];

  base.whyCeramic = {
    eyebrow: sanitize(override.whyCeramic?.eyebrow ?? base.whyCeramic.eyebrow),
    items:
      override.whyCeramic?.items?.map((item, index) => ({
        icon: sanitize(item.icon ?? base.whyCeramic.items[index]?.icon ?? ""),
        title: sanitize(item.title ?? base.whyCeramic.items[index]?.title ?? ""),
        desc: sanitize(item.desc ?? base.whyCeramic.items[index]?.desc ?? ""),
        href: sanitize(item.href ?? base.whyCeramic.items[index]?.href ?? ""),
        ctaLabel: sanitize(item.ctaLabel ?? base.whyCeramic.items[index]?.ctaLabel ?? ""),
      })) ?? base.whyCeramic.items,
  };

  base.introText = {
    text: sanitize(override.introText?.text ?? base.introText.text),
  };

  base.sectionImage = {
    imageUrl: sanitize(override.sectionImage?.imageUrl ?? base.sectionImage.imageUrl),
    alt: sanitize(override.sectionImage?.alt ?? base.sectionImage.alt),
  };

  base.ceramicAdvantages = {
    eyebrow: sanitize(override.ceramicAdvantages?.eyebrow ?? base.ceramicAdvantages.eyebrow),
    title: sanitize(override.ceramicAdvantages?.title ?? base.ceramicAdvantages.title),
    highlight: sanitize(override.ceramicAdvantages?.highlight ?? base.ceramicAdvantages.highlight),
    intro: sanitize(override.ceramicAdvantages?.intro ?? base.ceramicAdvantages.intro),
    cards:
      override.ceramicAdvantages?.cards?.map((card, index) => ({
        no: sanitize(card.no ?? base.ceramicAdvantages.cards[index]?.no ?? ""),
        title: sanitize(card.title ?? base.ceramicAdvantages.cards[index]?.title ?? ""),
        subtitle: sanitize(card.subtitle ?? base.ceramicAdvantages.cards[index]?.subtitle ?? ""),
        desc: sanitize(card.desc ?? base.ceramicAdvantages.cards[index]?.desc ?? ""),
      })) ?? base.ceramicAdvantages.cards,
  };

  base.serviceBlock = {
    eyebrow: sanitize(override.serviceBlock?.eyebrow ?? base.serviceBlock.eyebrow),
    title: sanitize(override.serviceBlock?.title ?? base.serviceBlock.title),
    subtitle: sanitize(override.serviceBlock?.subtitle ?? base.serviceBlock.subtitle),
    description: sanitize(override.serviceBlock?.description ?? base.serviceBlock.description),
    imageUrl: sanitize(override.serviceBlock?.imageUrl ?? base.serviceBlock.imageUrl),
    ctaLabel: sanitize(override.serviceBlock?.ctaLabel ?? base.serviceBlock.ctaLabel),
    ctaHref: sanitize(override.serviceBlock?.ctaHref ?? base.serviceBlock.ctaHref),
  };

  base.slider = {
    eyebrow: sanitize(override.slider?.eyebrow ?? base.slider.eyebrow),
    testimonials:
      override.slider?.testimonials?.map((item, index) => ({
        imgSrc: sanitize(item.imgSrc ?? base.slider.testimonials[index]?.imgSrc ?? ""),
        name: sanitize(item.name ?? base.slider.testimonials[index]?.name ?? ""),
        country: sanitize(item.country ?? base.slider.testimonials[index]?.country ?? ""),
        quote: sanitize(item.quote ?? base.slider.testimonials[index]?.quote ?? ""),
        cta: sanitize(item.cta ?? base.slider.testimonials[index]?.cta ?? ""),
        href: sanitize(item.href ?? base.slider.testimonials[index]?.href ?? ""),
      })) ?? base.slider.testimonials,
  };

  base.pioneeringWork = {
    eyebrow: sanitize(override.pioneeringWork?.eyebrow ?? base.pioneeringWork.eyebrow),
    title: sanitize(override.pioneeringWork?.title ?? base.pioneeringWork.title),
    subtitle: sanitize(override.pioneeringWork?.subtitle ?? base.pioneeringWork.subtitle),
    description: sanitize(override.pioneeringWork?.description ?? base.pioneeringWork.description),
    imageUrl: sanitize(override.pioneeringWork?.imageUrl ?? base.pioneeringWork.imageUrl),
    ctaLabel: sanitize(override.pioneeringWork?.ctaLabel ?? base.pioneeringWork.ctaLabel),
    ctaHref: sanitize(override.pioneeringWork?.ctaHref ?? base.pioneeringWork.ctaHref),
  };

  base.doctor = {
    name: sanitize(override.doctor?.name ?? base.doctor.name),
    title: sanitize(override.doctor?.title ?? base.doctor.title),
    description: sanitize(override.doctor?.description ?? base.doctor.description),
    imageUrl: sanitize(override.doctor?.imageUrl ?? base.doctor.imageUrl),
  };

  return base;
};

const formSchema = z.object({
  slug: z
    .string()
    .min(2, "Minimum 2 karakter")
    .regex(/^[a-z0-9-]+$/, "Sadece küçük harf, rakam ve tire kullanılabilir"),
  title: z.string().min(3, "Başlık en az 3 karakter olmalı"),
  excerpt: z.string().optional(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroImage: z.string().optional(),
  content: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  template: z.enum(["default", "benefits_for_patients"]).default("default"),
  benefitsTemplate: benefitsTemplateSchema.optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

type BenefitsArrayControls = {
  whyCeramicItems: UseFieldArrayReturn<FormSchema, "benefitsTemplate.whyCeramic.items", "id">;
  ceramicCards: UseFieldArrayReturn<FormSchema, "benefitsTemplate.ceramicAdvantages.cards", "id">;
  testimonials: UseFieldArrayReturn<FormSchema, "benefitsTemplate.slider.testimonials", "id">;
};

const createDefaultValues = (template: TemplateOptionId = "default"): FormSchema => {
  const base: FormSchema = {
    slug: "",
    title: "",
    excerpt: "",
    heroTitle: "",
    heroSubtitle: "",
    heroImage: "",
    content: "",
    status: "draft",
    template,
    benefitsTemplate: deepClone(BENEFITS_TEMPLATE_DEFAULT),
    seoTitle: "",
    seoDescription: "",
  };
  return base;
};

function BenefitsTemplateEditor({
  form,
  arrays,
}: {
  form: ReturnType<typeof useForm<FormSchema>>;
  arrays: BenefitsArrayControls;
}) {
  const benefitsTemplate = form.watch("benefitsTemplate");

  if (!benefitsTemplate) {
    return null;
  }

  return (
    <Card className="space-y-8 p-6 border-2 border-primary-100">
      <header className="space-y-2 pb-4 border-b border-primary-100">
        <h3 className="text-lg font-bold text-charcoal flex items-center gap-2">
          🏥 Hasta faydaları şablonu
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Aşağıdaki alanlar seçtiğiniz şablonun bileşenlerini doldurur. Tüm girdiler yayınlandığında doğrudan frontend'e aktarılır.
        </p>
      </header>

      <section className="space-y-4 p-5 rounded-2xl bg-gradient-to-br from-mint-pale/30 to-white border border-primary-100">
        <h4 className="text-sm font-bold text-primary-700 flex items-center gap-2 pb-2 border-b border-primary-100">
          🎯 Hero Alanı
        </h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="hero-eyebrow">Üst etiket</Label>
            <Input id="hero-eyebrow" {...form.register("benefitsTemplate.hero.eyebrow")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-button-label">Buton metni</Label>
            <Input id="hero-button-label" {...form.register("benefitsTemplate.hero.buttonLabel")} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="hero-title">Başlık</Label>
            <Input id="hero-title" {...form.register("benefitsTemplate.hero.title")} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="hero-description">Açıklama</Label>
            <Textarea id="hero-description" rows={3} {...form.register("benefitsTemplate.hero.description")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-button-target">Buton hedefi (anchor)</Label>
            <Input id="hero-button-target" {...form.register("benefitsTemplate.hero.buttonTarget")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-image-url">Görsel URL</Label>
            <Input id="hero-image-url" {...form.register("benefitsTemplate.hero.imageUrl")} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h4 className="text-sm font-semibold text-primary-700">Neden seramik kartları</h4>
            <p className="text-xs text-gray-500">Kart ekleyip kaldırabilir ve ikon / bağlantı bilgilerini düzenleyebilirsiniz.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() =>
              arrays.whyCeramicItems.append({
                icon: "",
                title: "",
                desc: "",
                href: "",
                ctaLabel: "",
              })
            }
          >
            <PlusIcon className="h-4 w-4" /> Kart ekle
          </Button>
        </div>

        <div className="space-y-4">
          {arrays.whyCeramicItems.fields.map((field, index) => (
            <div key={field.id} className="group rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50/50 p-5 shadow-sm hover:border-primary-300 hover:shadow-medium transition-all duration-300 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <p className="text-sm font-bold text-primary-700 flex items-center gap-2">
                  📋 Kart #{index + 1}
                </p>
                {arrays.whyCeramicItems.fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-error-600 hover:text-error-700"
                    onClick={() => arrays.whyCeramicItems.remove(index)}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Başlık</Label>
                  <Input {...form.register(`benefitsTemplate.whyCeramic.items.${index}.title`)} />
                </div>
                <div className="space-y-2">
                  <Label>İkon URL</Label>
                  <Input {...form.register(`benefitsTemplate.whyCeramic.items.${index}.icon`)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Açıklama</Label>
                  <Textarea rows={2} {...form.register(`benefitsTemplate.whyCeramic.items.${index}.desc`)} />
                </div>
                <div className="space-y-2">
                  <Label>Bağlantı</Label>
                  <Input {...form.register(`benefitsTemplate.whyCeramic.items.${index}.href`)} />
                </div>
                <div className="space-y-2">
                  <Label>Buton metni</Label>
                  <Input {...form.register(`benefitsTemplate.whyCeramic.items.${index}.ctaLabel`)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h4 className="text-sm font-semibold text-primary-700">Giriş paragrafı</h4>
        <Textarea rows={4} {...form.register("benefitsTemplate.introText.text")} />
      </section>

      <section className="space-y-4">
        <h4 className="text-sm font-semibold text-primary-700">Arka plan görseli</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Görsel URL</Label>
            <Input {...form.register("benefitsTemplate.sectionImage.imageUrl")} />
          </div>
          <div className="space-y-2">
            <Label>Alternatif metin</Label>
            <Input {...form.register("benefitsTemplate.sectionImage.alt")} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h4 className="text-sm font-semibold text-primary-700">Seramik avantajları</h4>
            <p className="text-xs text-gray-500">Başlık ve kartları düzenleyin.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() =>
              arrays.ceramicCards.append({ no: `${arrays.ceramicCards.fields.length + 1}.`, title: "", subtitle: "", desc: "" })
            }
          >
            <PlusIcon className="h-4 w-4" /> Kart ekle
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Eyebrow</Label>
            <Input {...form.register("benefitsTemplate.ceramicAdvantages.eyebrow")} />
          </div>
          <div className="space-y-2">
            <Label>Vurgulu metin</Label>
            <Input {...form.register("benefitsTemplate.ceramicAdvantages.highlight")} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Başlık</Label>
            <Input {...form.register("benefitsTemplate.ceramicAdvantages.title")} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Açıklama</Label>
            <Textarea rows={3} {...form.register("benefitsTemplate.ceramicAdvantages.intro")} />
          </div>
        </div>
        <div className="space-y-4">
          {arrays.ceramicCards.fields.map((field, index) => (
            <div key={field.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-inner-soft space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-primary-700">Kart #{index + 1}</p>
                {arrays.ceramicCards.fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-error-600 hover:text-error-700"
                    onClick={() => arrays.ceramicCards.remove(index)}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Numara</Label>
                  <Input {...form.register(`benefitsTemplate.ceramicAdvantages.cards.${index}.no`)} />
                </div>
                <div className="space-y-2">
                  <Label>Başlık</Label>
                  <Input {...form.register(`benefitsTemplate.ceramicAdvantages.cards.${index}.title`)} />
                </div>
                <div className="space-y-2">
                  <Label>Alt başlık</Label>
                  <Input {...form.register(`benefitsTemplate.ceramicAdvantages.cards.${index}.subtitle`)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Açıklama</Label>
                  <Textarea rows={2} {...form.register(`benefitsTemplate.ceramicAdvantages.cards.${index}.desc`)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h4 className="text-sm font-semibold text-primary-700">Hizmet bloğu</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Eyebrow</Label>
            <Input {...form.register("benefitsTemplate.serviceBlock.eyebrow")} />
          </div>
          <div className="space-y-2">
            <Label>Başlık</Label>
            <Input {...form.register("benefitsTemplate.serviceBlock.title")} />
          </div>
          <div className="space-y-2">
            <Label>Alt başlık</Label>
            <Input {...form.register("benefitsTemplate.serviceBlock.subtitle")} />
          </div>
          <div className="space-y-2">
            <Label>Görsel URL</Label>
            <Input {...form.register("benefitsTemplate.serviceBlock.imageUrl")} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Açıklama</Label>
            <Textarea rows={3} {...form.register("benefitsTemplate.serviceBlock.description")} />
          </div>
          <div className="space-y-2">
            <Label>Buton metni</Label>
            <Input {...form.register("benefitsTemplate.serviceBlock.ctaLabel")} />
          </div>
          <div className="space-y-2">
            <Label>Buton bağlantısı</Label>
            <Input {...form.register("benefitsTemplate.serviceBlock.ctaHref")} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h4 className="text-sm font-semibold text-primary-700">Referans slider</h4>
            <p className="text-xs text-gray-500">Hastaların deneyimlerini buradan düzenleyin.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() =>
              arrays.testimonials.append({
                imgSrc: "",
                name: "",
                country: "",
                quote: "",
                cta: "",
                href: "",
              })
            }
          >
            <PlusIcon className="h-4 w-4" /> Referans ekle
          </Button>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Eyebrow</Label>
            <Input {...form.register("benefitsTemplate.slider.eyebrow")} />
          </div>
          {arrays.testimonials.fields.map((field, index) => (
            <div key={field.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-inner-soft space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-primary-700">Referans #{index + 1}</p>
                {arrays.testimonials.fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-error-600 hover:text-error-700"
                    onClick={() => arrays.testimonials.remove(index)}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>İsim</Label>
                  <Input {...form.register(`benefitsTemplate.slider.testimonials.${index}.name`)} />
                </div>
                <div className="space-y-2">
                  <Label>Ülke</Label>
                  <Input {...form.register(`benefitsTemplate.slider.testimonials.${index}.country`)} />
                </div>
                <div className="space-y-2">
                  <Label>Görsel URL</Label>
                  <Input {...form.register(`benefitsTemplate.slider.testimonials.${index}.imgSrc`)} />
                </div>
                <div className="space-y-2">
                  <Label>Buton metni</Label>
                  <Input {...form.register(`benefitsTemplate.slider.testimonials.${index}.cta`)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Alıntı</Label>
                  <Textarea rows={2} {...form.register(`benefitsTemplate.slider.testimonials.${index}.quote`)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Bağlantı</Label>
                  <Input {...form.register(`benefitsTemplate.slider.testimonials.${index}.href`)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h4 className="text-sm font-semibold text-primary-700">Öncü çalışma</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Eyebrow</Label>
            <Input {...form.register("benefitsTemplate.pioneeringWork.eyebrow")} />
          </div>
          <div className="space-y-2">
            <Label>Başlık</Label>
            <Input {...form.register("benefitsTemplate.pioneeringWork.title")} />
          </div>
          <div className="space-y-2">
            <Label>Alt başlık</Label>
            <Input {...form.register("benefitsTemplate.pioneeringWork.subtitle")} />
          </div>
          <div className="space-y-2">
            <Label>Görsel URL</Label>
            <Input {...form.register("benefitsTemplate.pioneeringWork.imageUrl")} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Açıklama</Label>
            <Textarea rows={3} {...form.register("benefitsTemplate.pioneeringWork.description")} />
          </div>
          <div className="space-y-2">
            <Label>Buton metni</Label>
            <Input {...form.register("benefitsTemplate.pioneeringWork.ctaLabel")} />
          </div>
          <div className="space-y-2">
            <Label>Buton bağlantısı</Label>
            <Input {...form.register("benefitsTemplate.pioneeringWork.ctaHref")} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h4 className="text-sm font-semibold text-primary-700">Doktor bilgisi</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>İsim</Label>
            <Input {...form.register("benefitsTemplate.doctor.name")} />
          </div>
          <div className="space-y-2">
            <Label>Unvan</Label>
            <Input {...form.register("benefitsTemplate.doctor.title")} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Açıklama</Label>
            <Textarea rows={3} {...form.register("benefitsTemplate.doctor.description")} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Görsel URL</Label>
            <Input {...form.register("benefitsTemplate.doctor.imageUrl")} />
          </div>
        </div>
      </section>
    </Card>
  );
}

export default function PageDashboard() {
  const { data, isLoading, mutate } = useSWR<{ pages: CmsPage[] }>("/api/pages", fetcher, {
    revalidateOnFocus: false,
  });
  const router = useRouter();
  const pathname = usePathname();
  const [selectedPage, setSelectedPage] = useState<CmsPage | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [statusState, setStatusState] = useState<DashboardState>("idle");
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: createDefaultValues(),
  });

  const currentTemplate = form.watch("template") as TemplateOptionId;

  const whyCeramicItems = useFieldArray({
    control: form.control,
    name: "benefitsTemplate.whyCeramic.items",
  });
  const ceramicCards = useFieldArray({
    control: form.control,
    name: "benefitsTemplate.ceramicAdvantages.cards",
  });
  const testimonials = useFieldArray({
    control: form.control,
    name: "benefitsTemplate.slider.testimonials",
  });

  const arrays: BenefitsArrayControls = {
    whyCeramicItems,
    ceramicCards,
    testimonials,
  };

  const resetFeedback = () => {
    setStatusState("idle");
    setMessage(null);
  };

  const resetForm = (template: TemplateOptionId = "default") => {
    form.reset(createDefaultValues(template));
  };

  const handleNavigate = (href: string) => {
    if (pathname !== href) {
      router.push(href);
    }
    setSelectedPage(null);
    resetFeedback();
    resetForm();
  };

  useEffect(() => {
    if (selectedPage) {
      const template = selectedPage.template ?? "default";
      form.reset({
        slug: selectedPage.slug,
        title: selectedPage.title,
        excerpt: selectedPage.excerpt ?? "",
        heroTitle: selectedPage.heroTitle ?? "",
        heroSubtitle: selectedPage.heroSubtitle ?? "",
        heroImage: selectedPage.heroImage ?? "",
        content: selectedPage.content ?? "",
        status: selectedPage.status,
        template: template as TemplateOptionId,
        benefitsTemplate:
          template === "benefits_for_patients"
            ? mergeBenefitsTemplateData(selectedPage.templateData as Partial<BenefitsTemplateData> | null)
            : deepClone(BENEFITS_TEMPLATE_DEFAULT),
        seoTitle: selectedPage.seoTitle ?? "",
        seoDescription: selectedPage.seoDescription ?? "",
      });
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPage]);

  const publishedCount = useMemo(
    () => data?.pages.filter((page) => page.status === "published").length ?? 0,
    [data],
  );
  const draftCount = useMemo(
    () => data?.pages.filter((page) => page.status === "draft").length ?? 0,
    [data],
  );

  const handleTemplateChange = (template: TemplateOptionId) => {
    form.setValue("template", template);
    if (template === "benefits_for_patients") {
      form.setValue("benefitsTemplate", deepClone(BENEFITS_TEMPLATE_DEFAULT));
    }
  };

  const handleSubmit = form.handleSubmit((values) => {
    resetFeedback();
    const method = selectedPage ? "PUT" : "POST";
    const url = selectedPage ? `/api/pages/${selectedPage.slug}` : "/api/pages";

    const payload: Record<string, unknown> = {
      slug: values.slug,
      title: values.title,
      excerpt: sanitize(values.excerpt),
      heroTitle: sanitize(values.heroTitle),
      heroSubtitle: sanitize(values.heroSubtitle),
      heroImage: values.heroImage,
      content: values.content,
      status: values.status,
      seoTitle: sanitize(values.seoTitle),
      seoDescription: sanitize(values.seoDescription),
      template: values.template,
    };

    if (values.template === "benefits_for_patients") {
      if (!values.benefitsTemplate) {
        setStatusState("error");
        setMessage("Şablon alanlarını doldurun.");
        return;
      }
      payload.templateData = mergeBenefitsTemplateData(values.benefitsTemplate);
    } else {
      payload.templateData = null;
    }

    startTransition(async () => {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setStatusState("error");
        setMessage(body.message ?? "Bir hata oluştu");
        return;
      }

      await mutate();
      setStatusState("success");
      setMessage(selectedPage ? "Sayfa güncellendi" : "Yeni sayfa oluşturuldu");
      if (!selectedPage) {
        resetForm(values.template);
      }
    });
  });

  const handleDelete = async (page: CmsPage) => {
    resetFeedback();
    const confirmation = window.confirm(
      `"${page.title}" sayfasını silmek istediğinizden emin misiniz?`,
    );
    if (!confirmation) return;

    const response = await fetch(`/api/pages/${page.slug}`, { method: "DELETE" });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setStatusState("error");
      setMessage(payload.message ?? "Sayfa silinemedi");
      return;
    }

    await mutate();
    setStatusState("success");
    setMessage("Sayfa silindi");
    if (selectedPage?.id === page.id) {
      setSelectedPage(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-mint-pale via-white to-primary-50">
      <aside className="relative hidden w-80 flex-col justify-between bg-gradient-to-b from-mint-dark to-charcoal-dark text-white xl:flex shadow-strong">
        <div className="flex flex-1 flex-col gap-8 p-8">
          <div className="rounded-3xl bg-white/10 backdrop-blur-sm px-6 py-8 border border-white/20 shadow-dental transition-all duration-300 hover:bg-white/15">
            <h1 className="text-xl font-bold leading-snug bg-gradient-to-r from-white to-mint-pale bg-clip-text text-transparent">Swiss Dental Solutions</h1>
            <p className="mt-4 text-sm text-white/90 leading-relaxed">
              İçeriklerinizi tek noktadan yönetin, yayınlayın ve anında web sitesine yansıtın.
            </p>
            <Button
              type="button"
              onClick={() => handleNavigate("/create-page")}
              className="mt-6 w-full justify-center rounded-2xl bg-white text-primary-600 shadow-medium hover:bg-mint-pale hover:shadow-dental hover:scale-105"
              variant="ghost"
            >
              <PlusIcon className="h-5 w-5" />
              Sayfa oluştur
            </Button>
          </div>

          <nav className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-white/70 font-semibold">Gezinme</p>
            {navigationItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.href)}
                className={clsx(
                  "group flex w-full items-center justify-between rounded-2xl px-5 py-3.5 text-left text-sm transition-all duration-300",
                  pathname === item.href
                    ? "bg-white/25 text-white shadow-dental border border-white/30 scale-105"
                    : "bg-white/8 text-white/80 hover:bg-white/15 hover:text-white hover:scale-102 border border-white/10",
                )}
              >
                <span className="font-semibold">{item.label}</span>
                <span className={clsx(
                  "text-lg transition-transform duration-300",
                  pathname === item.href ? "translate-x-1" : "group-hover:translate-x-1"
                )}>{"›"}</span>
              </button>
            ))}
          </nav>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-white/70 font-semibold">Şablonlar</p>
            <div className="space-y-3">
              {TEMPLATE_OPTIONS.map((option) => (
                <div
                  key={option.id}
                  className="group rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-4 shadow-soft hover:shadow-dental hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:scale-102"
                >
                  <p className="text-sm font-bold text-white group-hover:text-mint-pale transition-colors">{option.label}</p>
                  <p className="mt-1.5 text-xs text-white/80 leading-relaxed">{option.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 bg-white/5 p-6 text-xs text-white/70 backdrop-blur-sm">
          <p className="leading-relaxed">💡 Şablon verilerini düzenlerken alanları boş bırakmanız durumunda varsayılan içerik kullanılır.</p>
        </div>
      </aside>

      <div className="flex-1 px-4 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <div className="relative overflow-hidden flex flex-col gap-6 rounded-3xl bg-gradient-to-br from-mint via-primary-500 to-primary-600 p-8 text-white shadow-strong border border-primary-400/20 md:flex-row md:items-center md:justify-between">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-mint-light/10 rounded-full blur-2xl translate-y-16 -translate-x-16"></div>
            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20">
                <span className="w-2 h-2 bg-success-400 rounded-full animate-pulse"></span>
                <p className="text-xs uppercase tracking-[0.2em] text-white/90 font-semibold">Swiss Dental CMS</p>
              </div>
              <h2 className="text-3xl font-bold md:text-4xl bg-gradient-to-r from-white to-mint-pale bg-clip-text text-transparent">İçerik Yönetim Paneli</h2>
              <p className="max-w-2xl text-sm md:text-base text-white/90 leading-relaxed">
                Yeni sayfalar oluşturun, içerikleri düzenleyin ve sitenizi dakikalar içinde güncelleyin.
              </p>
            </div>
            <div className="grid gap-4 text-sm relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-[0.3em] text-white/80 font-semibold">📊 Durum</span>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <Badge tone="success" className="shadow-medium">✓ Yayında: {publishedCount}</Badge>
                <Badge tone="gray" className="shadow-medium">📝 Taslak: {draftCount}</Badge>
                <Badge className="shadow-medium">📄 Toplam: {data?.pages.length ?? 0}</Badge>
              </div>
            </div>
          </div>

          {message && (
            <Card
              className={clsx(
                "rounded-2xl border text-sm font-medium",
                statusState === "success"
                  ? "border-success-200 bg-success-50/80 text-success-800"
                  : statusState === "error"
                  ? "border-error-200 bg-error-50/80 text-error-700"
                  : "border-gray-200 bg-white",
              )}
            >
              {message}
            </Card>
          )}

          <div className="grid gap-6 xl:grid-cols-[1fr_1.65fr]">
            <Card className="space-y-6 p-6 xl:p-8 shadow-medium animate-fade-in">
                <header className="flex flex-col gap-3 pb-4 border-b border-gray-100 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-charcoal flex items-center gap-2">
                      📚 Sayfalar
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Taslak ve yayındaki tüm sayfalarınızı buradan yönetebilirsiniz.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2 shrink-0"
                    onClick={() => {
                      setSelectedPage(null);
                      resetForm();
                    }}
                  >
                    <PlusIcon className="h-5 w-5" />
                    Yeni Sayfa
                  </Button>
                </header>

                <div className="space-y-4">
                  {isLoading && (
                    <div className="flex items-center justify-center gap-3 p-8 rounded-2xl bg-gradient-to-r from-primary-50 to-mint-pale/30">
                      <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
                      <p className="text-sm text-primary-700 font-medium">Sayfalar yükleniyor...</p>
                    </div>
                  )}
                  {!isLoading && (data?.pages.length ?? 0) === 0 && (
                    <div className="rounded-2xl border-2 border-dashed border-primary-300 bg-gradient-to-br from-primary-50 via-mint-pale/30 to-white p-10 text-center shadow-soft">
                      <div className="text-4xl mb-3">📄</div>
                      <p className="text-sm text-primary-800 font-semibold mb-1">Henüz sayfa oluşturulmamış</p>
                      <p className="text-xs text-primary-600">Sağdaki panelden ilk içeriğinizi oluşturun.</p>
                    </div>
                  )}
                  {data?.pages.map((page) => (
                    <div
                      key={page.id}
                      className="group flex flex-col gap-4 rounded-2xl border-2 border-gray-100 bg-gradient-to-br from-white to-gray-50/30 p-5 shadow-soft transition-all duration-300 hover:border-primary-300 hover:shadow-dental hover:scale-102 md:flex-row md:items-center"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="text-lg font-semibold text-charcoal">{page.title}</h4>
                          <Badge tone={page.status === "published" ? "success" : "gray"}>
                            {page.status === "published" ? "Yayında" : "Taslak"}
                          </Badge>
                          <Badge tone="gray">{TEMPLATE_LABEL_MAP[page.template as TemplateOptionId]}</Badge>
                        </div>
                        <p className="text-sm text-gray-500">/{page.slug}</p>
                        {page.excerpt && (
                          <p className="text-sm text-gray-600">{page.excerpt}</p>
                        )}
                        <p className="text-xs text-gray-400">
                          Güncelleme: {new Date(page.updatedAt).toLocaleString("tr-TR")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => setSelectedPage(page)}
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                          Düzenle
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="gap-2 text-error-600 hover:bg-error-50"
                          onClick={() => handleDelete(page)}
                        >
                          <TrashIcon className="h-5 w-5" />
                          Sil
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

            <Card className="space-y-8 p-6 xl:p-9 shadow-medium animate-fade-in">
                <header className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-lg font-bold text-charcoal flex items-center gap-2">
                      {selectedPage ? "✏️ Sayfayı Düzenle" : "✨ Yeni Sayfa Oluştur"}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Slug alanına yazdığınız değer frontend projesinde <code className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded text-xs font-mono">/slug</code> olarak yayınlanır.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-gray-600 hover:text-primary-600 shrink-0"
                    onClick={() => {
                      setSelectedPage(null);
                      resetForm();
                    }}
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                    Sıfırla
                  </Button>
                </header>

                <form className="space-y-8" onSubmit={handleSubmit}>
                  <section className="space-y-4 rounded-2xl border-2 border-gray-100 bg-gradient-to-br from-white to-mint-pale/10 shadow-sm p-4 md:p-6 transition-all duration-300 hover:border-primary-200 hover:shadow-medium">
                    <header className="space-y-1 pb-3 border-b border-gray-100">
                      <h4 className="text-sm font-bold text-primary-700 flex items-center gap-2">
                        📝 Temel bilgiler
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Slug alanı sayfanın URL'sini belirler. Başlık kart listesinde görünür.
                      </p>
                    </header>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" placeholder="ornek-sayfa" {...form.register("slug")} />
                        {form.formState.errors.slug && (
                          <p className="text-xs text-error-600">{form.formState.errors.slug.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">Başlık</Label>
                        <Input id="title" placeholder="Sayfa başlığı" {...form.register("title")} />
                        {form.formState.errors.title && (
                          <p className="text-xs text-error-600">{form.formState.errors.title.message}</p>
                        )}
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="excerpt">Kısa açıklama (opsiyonel)</Label>
                        <Textarea
                          id="excerpt"
                          rows={2}
                          placeholder="Sayfa kartında gösterilebilecek kısa tanım"
                          {...form.register("excerpt")}
                        />
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4 rounded-2xl border-2 border-gray-100 bg-gradient-to-br from-white to-primary-50/20 shadow-sm p-4 md:p-6 transition-all duration-300 hover:border-primary-200 hover:shadow-medium">
                    <header className="space-y-1 pb-3 border-b border-gray-100">
                      <h4 className="text-sm font-bold text-primary-700 flex items-center gap-2">
                        🔍 SEO & yayın
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Şablon seçimi tasarımı belirler. Yayın durumu "Yayında" olduğunda frontend'de görünür.
                      </p>
                    </header>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="seoTitle">SEO Başlığı</Label>
                        <Input id="seoTitle" placeholder="SEO title" {...form.register("seoTitle")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="seoDescription">SEO Açıklaması</Label>
                        <Textarea
                          id="seoDescription"
                          rows={2}
                          placeholder="Meta description"
                          {...form.register("seoDescription")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="template">Sayfa şablonu</Label>
                        <div className="relative">
                          <select
                            id="template"
                            value={currentTemplate}
                            onChange={(event) => handleTemplateChange(event.target.value as TemplateOptionId)}
                            className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-charcoal shadow-inner-soft focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
                          >
                            {TEMPLATE_OPTIONS.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Yayın durumu</Label>
                        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-charcoal">Yayında mı?</p>
                            <p className="text-xs text-gray-500">
                              Aktif olduğunda sayfa frontend’de otomatik olarak görünür.
                            </p>
                          </div>
                          <Switch
                            checked={form.watch("status") === "published"}
                            onChange={(checked) => form.setValue("status", checked ? "published" : "draft")}
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  {currentTemplate === "benefits_for_patients" && (
                    <BenefitsTemplateEditor form={form} arrays={arrays} />
                  )}

                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-primary-50 to-mint-pale/50 border border-primary-200/50 p-5 shadow-soft">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">💾</span>
                      <div>
                        <p className="text-sm font-semibold text-primary-800">
                          Kaydetmeye hazır mısınız?
                        </p>
                        <p className="text-xs text-primary-600 mt-0.5">
                          İçerikleri kontrol edin. Taslak olarak bırakabilir ya da yayımlayabilirsiniz.
                        </p>
                      </div>
                    </div>
                    <Button type="submit" className="gap-2 shrink-0 shadow-medium" disabled={isPending}>
                      {isPending ? (
                        <>
                          <ArrowPathIcon className="h-5 w-5 animate-spin" />
                          Kaydediliyor...
                        </>
                      ) : (
                        <>
                          <PlusIcon className="h-5 w-5" />
                          {selectedPage ? "Sayfayı güncelle" : "Sayfayı oluştur"}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
