import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="px-4 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          {/* Header */}
          <div className="relative overflow-hidden flex flex-col gap-6 rounded-3xl bg-gradient-to-br from-mint via-primary-500 to-primary-600 p-8 text-white shadow-strong border border-primary-400/20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-mint-light/10 rounded-full blur-2xl translate-y-16 -translate-x-16"></div>
            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20">
                <span className="w-2 h-2 bg-success-400 rounded-full animate-pulse"></span>
                <p className="text-xs uppercase tracking-[0.2em] text-white/90 font-semibold">Swiss Dental CMS</p>
              </div>
              <h2 className="text-3xl font-bold md:text-4xl bg-gradient-to-r from-white to-mint-pale bg-clip-text text-transparent">
                Admin Dashboard
              </h2>
              <p className="max-w-2xl text-sm md:text-base text-white/90 leading-relaxed">
                Hoş geldiniz! Sol menüden sayfalar arasında gezinebilir, içerikleri yönetebilirsiniz.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6 space-y-4 hover:shadow-dental transition-all duration-300 hover:scale-102">
              <div className="flex items-center justify-between">
                <div className="text-3xl">📝</div>
                <Badge tone="success">Aktif</Badge>
              </div>
              <h3 className="text-lg font-bold text-charcoal">Sayfa Yönetimi</h3>
              <p className="text-sm text-gray-600">
                CMS sayfalarını oluşturun ve düzenleyin
              </p>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-dental transition-all duration-300 hover:scale-102">
              <div className="flex items-center justify-between">
                <div className="text-3xl">📊</div>
                <Badge tone="gray">Yakında</Badge>
              </div>
              <h3 className="text-lg font-bold text-charcoal">İstatistikler</h3>
              <p className="text-sm text-gray-600">
                Site verilerini ve analitikleri görüntüleyin
              </p>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-dental transition-all duration-300 hover:scale-102">
              <div className="flex items-center justify-between">
                <div className="text-3xl">⚙️</div>
                <Badge tone="gray">Yakında</Badge>
              </div>
              <h3 className="text-lg font-bold text-charcoal">Ayarlar</h3>
              <p className="text-sm text-gray-600">
                Sistem ayarlarını yapılandırın
              </p>
            </Card>
          </div>

          {/* Info Section */}
          <Card className="p-8 bg-gradient-to-br from-primary-50 to-mint-pale/30">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-charcoal flex items-center gap-2">
                💡 Hızlı Başlangıç
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">•</span>
                  <span>Sol menüden <strong>Sayfa Yönetimi</strong> seçerek yeni sayfalar oluşturabilirsiniz</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">•</span>
                  <span>Sayfaları taslak olarak kaydedip daha sonra yayınlayabilirsiniz</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">•</span>
                  <span>Farklı şablonlar kullanarak zengin içerikler oluşturabilirsiniz</span>
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
