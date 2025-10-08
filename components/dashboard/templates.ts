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
