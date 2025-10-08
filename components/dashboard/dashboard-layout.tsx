"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import {
  PlusIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

type MenuItem = {
  id: string;
  label: string;
  href: string;
  icon: string;
  submenu?: {
    id: string;
    label: string;
    href: string;
  }[];
};

const navigationItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Ana Sayfa",
    href: "/",
    icon: "📊",
  },
  {
    id: "create",
    label: "Sayfa Yönetimi",
    href: "/create-page",
    icon: "📝",
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const handleNavigate = (href: string) => {
    if (pathname !== href) {
      router.push(href);
    }
    setMobileMenuOpen(false);
  };

  const toggleSubmenu = (itemId: string) => {
    setOpenSubmenu(openSubmenu === itemId ? null : itemId);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-mint-pale via-white to-primary-50">
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 xl:hidden">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-white shadow-medium hover:shadow-dental"
        >
          {mobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6 text-primary-600" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-primary-600" />
          )}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-charcoal/50 backdrop-blur-sm xl:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 left-0 z-40 h-screen bg-gradient-to-b from-mint-dark to-charcoal-dark text-white shadow-strong transition-all duration-300 flex flex-col justify-between",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0",
          sidebarOpen ? "w-80" : "w-20"
        )}
      >
        <div className="flex flex-1 flex-col gap-8 p-8 overflow-y-auto">
          {/* Header */}
          <div className="rounded-3xl bg-white/10 backdrop-blur-sm px-6 py-8 border border-white/20 shadow-dental transition-all duration-300 hover:bg-white/15">
            {sidebarOpen && (
              <>
                <h1 className="text-xl font-bold leading-snug bg-gradient-to-r from-white to-mint-pale bg-clip-text text-transparent">
                  Swiss Dental Solutions
                </h1>
                <p className="mt-4 text-sm text-white/90 leading-relaxed">
                  İçeriklerinizi tek noktadan yönetin, yayınlayın ve anında web sitesine yansıtın.
                </p>
              </>
            )}
            {!sidebarOpen && (
              <div className="flex justify-center">
                <span className="text-2xl">🦷</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="space-y-3">
            {sidebarOpen && (
              <p className="text-xs uppercase tracking-[0.35em] text-white/70 font-semibold">Gezinme</p>
            )}
            {navigationItems.map((item) => (
              <div key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (item.submenu) {
                      toggleSubmenu(item.id);
                    } else {
                      handleNavigate(item.href);
                    }
                  }}
                  className={clsx(
                    "group flex w-full items-center justify-between rounded-2xl px-5 py-3.5 text-left text-sm transition-all duration-300",
                    pathname === item.href
                      ? "bg-white/25 text-white shadow-dental border border-white/30 scale-105"
                      : "bg-white/8 text-white/80 hover:bg-white/15 hover:text-white hover:scale-102 border border-white/10"
                  )}
                >
                  <span className="flex items-center gap-3">
                    {sidebarOpen ? (
                      <>
                        <span className="text-lg">{item.icon}</span>
                        <span className="font-semibold">{item.label}</span>
                      </>
                    ) : (
                      <span className="text-lg">{item.icon}</span>
                    )}
                  </span>
                  {sidebarOpen && (
                    <>
                      {item.submenu ? (
                        <ChevronDownIcon
                          className={clsx(
                            "h-4 w-4 transition-transform duration-300",
                            openSubmenu === item.id ? "rotate-180" : ""
                          )}
                        />
                      ) : (
                        <span
                          className={clsx(
                            "text-lg transition-transform duration-300",
                            pathname === item.href ? "translate-x-1" : "group-hover:translate-x-1"
                          )}
                        >
                          {"›"}
                        </span>
                      )}
                    </>
                  )}
                </button>

                {/* Submenu */}
                {item.submenu && sidebarOpen && openSubmenu === item.id && (
                  <div className="mt-2 ml-4 space-y-2">
                    {item.submenu.map((subitem) => (
                      <button
                        key={subitem.id}
                        type="button"
                        onClick={() => handleNavigate(subitem.href)}
                        className="group flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-left text-sm transition-all duration-300 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/5"
                      >
                        <span className="text-xs">•</span>
                        <span className="text-sm">{subitem.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer with Toggle Button */}
        <div className="border-t border-white/20 bg-white/5 backdrop-blur-sm">
          <div className="p-4">
            <Button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/20"
              variant="ghost"
            >
              {sidebarOpen ? (
                <>
                  <span className="text-sm">«</span>
                  <span className="text-xs">Daralt</span>
                </>
              ) : (
                <span className="text-lg">»</span>
              )}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={clsx(
          "flex-1 transition-all duration-300 flex flex-col",
          sidebarOpen ? "xl:ml-80" : "xl:ml-20"
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-4 sm:px-8">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-bold text-charcoal">
                Swiss Dental Solutions
              </h2>
              <span className="text-xs px-3 py-1 rounded-full bg-primary-100 text-primary-700 font-semibold">
                Admin Panel
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors">
                <span className="text-2xl">👤</span>
                <span className="hidden sm:block text-sm font-medium text-gray-700">Admin</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
