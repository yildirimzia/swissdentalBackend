import { CmsPageStatus as PrismaCmsPageStatus, Page } from "@prisma/client";

export type CmsPageStatus = PrismaCmsPageStatus;
export type CmsPage = Page;

export interface CmsPageBase {
  slug: string;
  title: string;
  excerpt?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  content: string;
  status?: CmsPageStatus;
  seoTitle?: string;
  seoDescription?: string;
}

export type CmsPageCreateInput = CmsPageBase;

export type CmsPageUpdateInput = Partial<Omit<CmsPageBase, "slug" | "title" | "content">> & {
  slug?: string;
  title?: string;
  content?: string;
  status?: CmsPageStatus;
};
