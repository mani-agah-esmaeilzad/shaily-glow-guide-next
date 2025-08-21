'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { HeroSection } from '@/components/hero-section';
import { Dashboard } from '@/app/dashboard/Dashboard'; // مسیر کامپوننت داشبورد را به‌روز کنید
import { useRouter } from 'next/navigation';

const IndexPage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    // کاربر را به صفحه ورود هدایت می‌کند
    router.push('/login');
  };

  // تا زمانی که وضعیت احراز هویت در حال بررسی است، چیزی نمایش داده نمی‌شود
  // (لودر اصلی در AuthProvider قرار دارد)
  if (isLoading) {
    return null;
  }

  // اگر کاربر وارد شده باشد، داشبورد را نمایش بده
  if (user) {
    return <Dashboard profile={user} />;
  }

  // در غیر این صورت، صفحه اصلی را نمایش بده
  return <HeroSection onGetStarted={handleGetStarted} />;
};

export default IndexPage;
