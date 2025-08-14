import type { Metadata } from "next";
import { Inter } from "next/font/google"; // فونت Inter را از next/font/google وارد کنید
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";

// فونت را با تنظیمات مورد نظر نمونه‌سازی کنید
const inter = Inter({ subsets: ["latin"] });

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
      {/* کلاس تولید شده توسط next/font را به تگ body اضافه کنید */}
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
