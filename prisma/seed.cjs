const { PrismaClient, CmsPageStatus, CmsPageTemplate } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const timestamp = new Date("2024-01-01T00:00:00.000Z");

  await prisma.page.upsert({
    where: { slug: "test" },
    update: {},
    create: {
      slug: "test",
      title: "Test Page",
      excerpt: "Preview of a dynamically created page from CMS.",
      heroTitle: "Welcome to Test Page",
      heroSubtitle: "This page is fully managed via the Swiss Dental CMS.",
      heroImage:
        "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=1920&q=80",
      content:
        "## Dynamic Content\n\nThis is placeholder content for the test page. You can update it from the CMS dashboard.\n\n- Manage sections effortlessly\n- Preview your copy instantly\n- Publish when ready",
      status: CmsPageStatus.published,
      template: CmsPageTemplate.default,
      seoTitle: "Swiss Dental | Test Page",
      seoDescription: "An example dynamic page served by the Swiss Dental CMS.",
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  });

  console.log("Seed completed. Test page ensured.");
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
