import { Suspense } from "react";
import PageDashboard from "@/components/dashboard/page-dashboard";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="min-h-screen bg-mint-pale">
      <Suspense fallback={<p className="text-sm text-gray-500">Panel yükleniyor...</p>}>
        <PageDashboard />
      </Suspense>
    </main>
  );
}
