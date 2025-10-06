import { NextResponse } from "next/server";
import { z } from "zod";
import {
  deletePage,
  getPageBySlug,
  updatePage,
} from "@/lib/storage/page-store";

const updateSchema = z
  .object({
    slug: z
      .string()
      .regex(/^[a-z0-9\-]+$/, "Only lowercase letters, numbers and dashes are allowed")
      .optional(),
    title: z.string().min(3, "Title must contain at least 3 characters").optional(),
    excerpt: z.string().optional(),
    heroTitle: z.string().optional(),
    heroSubtitle: z.string().optional(),
    heroImage: z.string().optional(),
    content: z
      .string()
      .optional()
      .transform((value) => (typeof value === "string" ? value.trim() : undefined)),
    status: z.enum(["draft", "published"]).optional(),
    template: z.enum(["default", "benefits_for_patients"]).optional(),
    templateData: z.any().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  })
  .refine(
    (value) => {
      if (!value.slug) {
        return true;
      }
      return value.slug.length >= 2;
    },
    { message: "Slug must contain at least 2 characters", path: ["slug"] },
  );

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) {
    return NextResponse.json({ message: "Page not found" }, { status: 404 });
  }

  return NextResponse.json({ page });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const body = await request.json();
    const parsed = updateSchema.parse(body);
    const { slug } = await params;
    const page = await updatePage(slug, parsed);
    return NextResponse.json({ page });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation failed", issues: error.flatten() },
        { status: 422 },
      );
    }

    const message = error instanceof Error ? error.message : "Unable to update page";
    const status = message === "Page not found" ? 404 : 400;
    return NextResponse.json({ message }, { status });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    await deletePage(slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete page";
    const status = message === "Page not found" ? 404 : 400;
    return NextResponse.json({ message }, { status });
  }
}
