import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ReactNode } from "react";
import Providers from "@/components/providers";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Swiss Dental Solutions CMS",
  description:
    "Admin platform for managing the Swiss Dental Solutions content ecosystem.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.variable} bg-cream text-charcoal`}> 
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-primary-50 via-cream to-white">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
