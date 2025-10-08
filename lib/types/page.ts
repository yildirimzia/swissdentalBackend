import {
  CmsPageStatus as PrismaCmsPageStatus,
  CmsPageTemplate as PrismaCmsPageTemplate,
  Page,
  Prisma,
} from "@prisma/client";

export type CmsPageStatus = PrismaCmsPageStatus;
export type CmsPageTemplate = PrismaCmsPageTemplate;
export type CmsPage = Page;

export interface CmsPageCreateInput {
  slug: string;
  title: string;
  excerpt?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  content: string;
  status?: CmsPageStatus;
  template?: CmsPageTemplate;
  templateData?: Prisma.JsonValue;
  selectedComponents?: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export type CmsPageUpdateInput = Partial<
  Omit<CmsPageCreateInput, "slug" | "title" | "content">
> & {
  slug?: string;
  title?: string;
  content?: string;
  status?: CmsPageStatus;
  template?: CmsPageTemplate;
  templateData?: Prisma.JsonValue;
  selectedComponents?: string[];
};
