import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "@/lib/prisma";
import {
  CmsPage,
  CmsPageCreateInput,
  CmsPageUpdateInput,
} from "@/lib/types/page";

function normalizeSlug(slug: string) {
  return slug.trim().toLowerCase();
}

function sanitizeOptional(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

function sanitizeNullable(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

function mapInputToCreateData(input: CmsPageCreateInput): Prisma.PageCreateInput {
  return {
    slug: normalizeSlug(input.slug),
    title: input.title.trim(),
    excerpt: sanitizeOptional(input.excerpt),
    heroTitle: sanitizeOptional(input.heroTitle),
    heroSubtitle: sanitizeOptional(input.heroSubtitle),
    heroImage: sanitizeOptional(input.heroImage),
    content: input.content.trim(),
    status: input.status ?? "draft",
    seoTitle: sanitizeOptional(input.seoTitle),
    seoDescription: sanitizeOptional(input.seoDescription),
  };
}

function mapInputToUpdateData(input: CmsPageUpdateInput): Prisma.PageUpdateInput {
  const data: Prisma.PageUpdateInput = {};

  if (input.slug !== undefined) {
    data.slug = normalizeSlug(input.slug);
  }
  if (input.title !== undefined) {
    data.title = input.title.trim();
  }
  if (input.content !== undefined) {
    data.content = input.content.trim();
  }

  if (input.status !== undefined) {
    data.status = input.status;
  }

  if (input.excerpt !== undefined) {
    data.excerpt = sanitizeNullable(input.excerpt);
  }
  if (input.heroTitle !== undefined) {
    data.heroTitle = sanitizeNullable(input.heroTitle);
  }
  if (input.heroSubtitle !== undefined) {
    data.heroSubtitle = sanitizeNullable(input.heroSubtitle);
  }
  if (input.heroImage !== undefined) {
    data.heroImage = sanitizeNullable(input.heroImage);
  }
  if (input.seoTitle !== undefined) {
    data.seoTitle = sanitizeNullable(input.seoTitle);
  }
  if (input.seoDescription !== undefined) {
    data.seoDescription = sanitizeNullable(input.seoDescription);
  }

  return data;
}

export async function getPages(): Promise<CmsPage[]> {
  return prisma.page.findMany({
    orderBy: { updatedAt: "desc" },
  });
}

export async function getPublishedPages(): Promise<CmsPage[]> {
  return prisma.page.findMany({
    where: { status: "published" },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getPageBySlug(slug: string): Promise<CmsPage | null> {
  return prisma.page.findUnique({
    where: { slug: normalizeSlug(slug) },
  });
}

export async function createPage(input: CmsPageCreateInput): Promise<CmsPage> {
  try {
    const data = mapInputToCreateData(input);
    return await prisma.page.create({ data });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("Slug already exists. Choose a unique slug.");
    }
    throw error instanceof Error
      ? error
      : new Error("Unable to create page due to an unexpected error");
  }
}

export async function updatePage(
  slug: string,
  input: CmsPageUpdateInput,
): Promise<CmsPage> {
  const normalized = normalizeSlug(slug);
  const data = mapInputToUpdateData(input);

  try {
    return await prisma.page.update({
      where: { slug: normalized },
      data,
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("Page not found");
      }
      if (error.code === "P2002") {
        throw new Error("Slug already exists. Choose a unique slug.");
      }
    }
    throw error instanceof Error
      ? error
      : new Error("Unable to update page due to an unexpected error");
  }
}

export async function deletePage(slug: string): Promise<void> {
  try {
    await prisma.page.delete({ where: { slug: normalizeSlug(slug) } });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new Error("Page not found");
    }
    throw error instanceof Error
      ? error
      : new Error("Unable to delete page due to an unexpected error");
  }
}
