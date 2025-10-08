import { Suspense } from "react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import PageDashboard from "@/components/dashboard/page-dashboard";

export const dynamic = "force-dynamic";

export default function CreatePage() {
  return (
    <DashboardLayout>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-sm text-gray-500">Panel yükleniyor...</p>
        </div>
      }>
        <PageDashboard />
      </Suspense>
    </DashboardLayout>
  );
}
