// src/app/page.tsx

'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
// کامپوننت جدید را ایمپورت کنید
import { LandingPage } from '@/components/landing-page';
import { Dashboard } from '@/app/dashboard/Dashboard';
import { useRouter } from 'next/navigation';

const IndexPage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/signup'); // کاربر را به صفحه ثبت‌نام هدایت می‌کنیم
  };

  if (isLoading) {
    // می‌توانید یک کامپوننت لودینگ زیبا اینجا نمایش دهید
    return (
      <div className="min-h-screen flex items-center justify-center">
        {/* Loader Component Here */}
      </div>
    );
  }

  // اگر کاربر وارد شده باشد، داشبورد را نمایش بده
  if (user) {
    return <Dashboard profile={user} />;
  }

  // در غیر این صورت، صفحه فرود کامل را نمایش بده
  return <LandingPage onGetStarted={handleGetStarted} />;
};

export default IndexPage;