// src/app/layout.tsx

import type { Metadata } from "next";
// دیگر نیازی به ایمپورت فونت از next/font/google نیست
// import { Inter } from "next/font/google"; 
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";

// این خط را حذف کنید
// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shaily Glow Guide",
  description: "Your AI assistant for skincare and haircare.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      {/* کلاس فونت را از تگ body حذف می‌کنیم تا از تنظیمات Tailwind استفاده شود */}
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}