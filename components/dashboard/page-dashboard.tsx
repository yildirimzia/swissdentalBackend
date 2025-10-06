"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusIcon, ArrowPathIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import type { CmsPage } from "@/lib/types/page";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const formSchema = z.object({
  slug: z
    .string()
    .min(2, "Minimum 2 karakter")
    .regex(/^[a-z0-9\-]+$/, "Sadece küçük harf, rakam ve tire kullanılabilir"),
  title: z.string().min(3, "Başlık en az 3 karakter olmalı"),
  excerpt: z.string().optional(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroImage: z
    .string()
    .url("Lütfen geçerli bir görsel URL'si girin")
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined)),
  content: z
    .string()
    .min(10, "İçerik en az 10 karakter olmalı")
    .transform((value) => value.trim()),
  status: z.enum(["draft", "published"]).default("draft"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

type DashboardState = "idle" | "success" | "error";

export default function PageDashboard() {
  const { data, isLoading, mutate } = useSWR<{ pages: CmsPage[] }>("/api/pages", fetcher, {
    revalidateOnFocus: false,
  });
  const [selectedPage, setSelectedPage] = useState<CmsPage | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [statusState, setStatusState] = useState<DashboardState>("idle");
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: "",
      title: "",
      excerpt: "",
      heroTitle: "",
      heroSubtitle: "",
      heroImage: "",
      content: "",
      status: "draft",
      seoTitle: "",
      seoDescription: "",
    },
  });

  useEffect(() => {
    if (selectedPage) {
      form.reset({
        slug: selectedPage.slug,
        title: selectedPage.title,
        excerpt: selectedPage.excerpt ?? "",
        heroTitle: selectedPage.heroTitle ?? "",
        heroSubtitle: selectedPage.heroSubtitle ?? "",
        heroImage: selectedPage.heroImage ?? "",
        content: selectedPage.content,
        status: selectedPage.status,
        seoTitle: selectedPage.seoTitle ?? "",
        seoDescription: selectedPage.seoDescription ?? "",
      });
    } else {
      form.reset({
        slug: "",
        title: "",
        excerpt: "",
        heroTitle: "",
        heroSubtitle: "",
        heroImage: "",
        content: "",
        status: "draft",
        seoTitle: "",
        seoDescription: "",
      });
    }
  }, [selectedPage, form]);

  const publishedCount = useMemo(
    () => data?.pages.filter((page) => page.status === "published").length ?? 0,
    [data],
  );
  const draftCount = useMemo(
    () => data?.pages.filter((page) => page.status === "draft").length ?? 0,
    [data],
  );

  const resetFeedback = () => {
    setStatusState("idle");
    setMessage(null);
  };

  const handleSubmit = form.handleSubmit((values) => {
    resetFeedback();
    const method = selectedPage ? "PUT" : "POST";
    const url = selectedPage ? `/api/pages/${selectedPage.slug}` : "/api/pages";

    startTransition(async () => {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        setStatusState("error");
        setMessage(payload.message ?? "Bir hata oluştu");
        return;
      }

      await mutate();
      setStatusState("success");
      setMessage(selectedPage ? "Sayfa güncellendi" : "Yeni sayfa oluşturuldu");
      if (!selectedPage) {
        form.reset({
          slug: "",
          title: "",
          excerpt: "",
          heroTitle: "",
          heroSubtitle: "",
          heroImage: "",
          content: "",
          status: "draft",
          seoTitle: "",
          seoDescription: "",
        });
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
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-mint to-primary-600 p-10 text-white shadow-strong">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-white/80">Swiss Dental CMS</p>
            <h1 className="mt-3 text-4xl font-semibold">İçerik Yönetim Paneli</h1>
            <p className="mt-4 max-w-2xl text-white/80">
              Yeni sayfalar oluşturun, içerikleri düzenleyin ve sitenizi dakikalar içinde güncelleyin.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <Badge tone="success">Yayında: {publishedCount}</Badge>
              <Badge tone="gray">Taslak: {draftCount}</Badge>
              <Badge>Toplam Sayfa: {data?.pages.length ?? 0}</Badge>
            </div>
          </div>
          <div className="grid gap-3 text-right">
            <span className="text-sm uppercase tracking-[0.3em] text-white/70">Anlık Yayınlama</span>
            <p className="text-lg font-medium text-white/90">
              Frontend projesine doğrudan bağlanan hızlı API.
            </p>
          </div>
        </div>
        <div className="absolute inset-y-0 right-0 w-1/2 rounded-l-full bg-white/10 blur-3xl" />
      </div>

      {message && (
        <Card
          className={
            statusState === "success"
              ? "border border-success-200 bg-success-50/80 text-success-800"
              : statusState === "error"
              ? "border border-error-200 bg-error-50/80 text-error-700"
              : ""
          }
        >
          <p className="text-sm font-medium">{message}</p>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="space-y-6">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-charcoal">Sayfalar</h2>
              <p className="text-sm text-gray-500">
                Taslak ve yayındaki tüm sayfalarınızı buradan yönetebilirsiniz.
              </p>
            </div>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                setSelectedPage(null);
                form.reset({
                  slug: "",
                  title: "",
                  excerpt: "",
                  heroTitle: "",
                  heroSubtitle: "",
                  heroImage: "",
                  content: "",
                  status: "draft",
                  seoTitle: "",
                  seoDescription: "",
                });
              }}
            >
              <PlusIcon className="h-5 w-5" />
              Yeni Sayfa
            </Button>
          </header>

          <div className="space-y-4">
            {isLoading && (
              <p className="text-sm text-gray-500">Sayfalar yükleniyor...</p>
            )}
            {!isLoading && (data?.pages.length ?? 0) === 0 && (
              <div className="rounded-2xl border border-dashed border-primary-200 bg-primary-50/50 p-10 text-center text-sm text-primary-800">
                Henüz sayfa oluşturulmamış. Sağdaki panelden ilk içeriğinizi oluşturun.
              </div>
            )}
            {data?.pages.map((page) => (
              <div
                key={page.id}
                className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-soft transition hover:border-primary-200 hover:shadow-medium md:flex-row md:items-center"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-charcoal">{page.title}</h3>
                    <Badge tone={page.status === "published" ? "success" : "gray"}>
                      {page.status === "published" ? "Yayında" : "Taslak"}
                    </Badge>
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
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setSelectedPage(page)}
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                    Düzenle
                  </Button>
                  <Button
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

        <Card className="space-y-6">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-charcoal">
                {selectedPage ? "Sayfayı Düzenle" : "Yeni Sayfa Oluştur"}
              </h2>
              <p className="text-sm text-gray-500">
                Slug alanına yazdığınız değer frontend projesinde `/slug` olarak yayınlanır.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-gray-600 hover:text-charcoal"
              onClick={() => {
                if (selectedPage) {
                  setSelectedPage(null);
                } else {
                  form.reset({
                    slug: "",
                    title: "",
                    excerpt: "",
                    heroTitle: "",
                    heroSubtitle: "",
                    heroImage: "",
                    content: "",
                    status: "draft",
                    seoTitle: "",
                    seoDescription: "",
                  });
                }
              }}
            >
              <ArrowPathIcon className="h-5 w-5" />
              Sıfırla
            </Button>
          </header>

          <form className="space-y-5" onSubmit={handleSubmit}>
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
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="excerpt">Kısa Açıklama</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Sayfa kartında görünecek kısa açıklama"
                  rows={3}
                  {...form.register("excerpt")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroImage">Hero Görsel URL</Label>
                <Input
                  id="heroImage"
                  placeholder="https://..."
                  {...form.register("heroImage")}
                />
                {form.formState.errors.heroImage && (
                  <p className="text-xs text-error-600">{form.formState.errors.heroImage.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="heroTitle">Hero Başlık</Label>
                <Input id="heroTitle" placeholder="Hero başlığı" {...form.register("heroTitle")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroSubtitle">Hero Alt Başlık</Label>
                <Input
                  id="heroSubtitle"
                  placeholder="Kısa açıklama"
                  {...form.register("heroSubtitle")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">İçerik</Label>
              <Textarea
                id="content"
                rows={12}
                placeholder={`Markdown destekli içerik.\n\nÖr: ## Başlık\nParagraf metni...`}
                {...form.register("content")}
              />
              {form.formState.errors.content && (
                <p className="text-xs text-error-600">{form.formState.errors.content.message}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Başlığı</Label>
                <Input id="seoTitle" placeholder="SEO Title" {...form.register("seoTitle")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO Açıklaması</Label>
                <Textarea
                  id="seoDescription"
                  rows={3}
                  placeholder="Meta description"
                  {...form.register("seoDescription")}
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <div>
                <p className="text-sm font-semibold text-charcoal">Yayında mı?</p>
                <p className="text-xs text-gray-500">
                  Yayında olan sayfalar frontend projesinde otomatik olarak görünür.
                </p>
              </div>
              <Switch
                checked={form.watch("status") === "published"}
                onChange={(checked) => form.setValue("status", checked ? "published" : "draft")}
              />
            </div>

            <Button type="submit" className="w-full gap-2" disabled={isPending}>
              <PlusIcon className="h-5 w-5" />
              {selectedPage ? "Sayfayı güncelle" : "Sayfayı oluştur"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
