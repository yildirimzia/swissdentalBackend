import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createPage,
  getPages,
  getPublishedPages,
} from "@/lib/storage/page-store";

const pageSchema = z.object({
  slug: z
    .string()
    .min(2, "Slug must contain at least 2 characters")
    .regex(/^[a-z0-9\-]+$/, "Only lowercase letters, numbers and dashes are allowed"),
  title: z.string().min(3, "Title must contain at least 3 characters"),
  excerpt: z.string().optional(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroImage: z.string().optional(),
  content: z
    .string()
    .optional()
    .transform((value) => (typeof value === "string" ? value.trim() : "")),
  status: z.enum(["draft", "published"]).default("draft"),
  template: z.enum(["default", "benefits_for_patients"]).default("default"),
  templateData: z.any().optional(),
  selectedComponents: z.array(z.string()).optional().default([]),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    if (status === "published") {
      const pages = await getPublishedPages();
      return NextResponse.json({ pages });
    }

    const pages = await getPages();
    return NextResponse.json({ pages });
  } catch (error) {
    return NextResponse.json(
      { message: "Unable to load pages" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('📝 POST /api/pages - Request body:', JSON.stringify(body, null, 2));
    console.log('📝 selectedComponents in body:', body.selectedComponents);
    
    const parsed = pageSchema.parse(body);
    console.log('✅ Parsed data:', JSON.stringify(parsed, null, 2));
    console.log('✅ selectedComponents after parse:', parsed.selectedComponents);
    
    const page = await createPage(parsed);
    console.log('💾 Created page:', JSON.stringify(page, null, 2));
    console.log('💾 selectedComponents in created page:', page.selectedComponents);
    
    return NextResponse.json({ page }, { status: 201 });
  } catch (error) {
    console.error('❌ Error in POST /api/pages:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation failed", issues: error.flatten() },
        { status: 422 },
      );
    }

    const message = error instanceof Error ? error.message : "Unable to create page";
    return NextResponse.json({ message }, { status: 400 });
  }
}
