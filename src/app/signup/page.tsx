'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow';
import { WelcomePage } from '@/components/welcome-page';

interface OnboardingData {
  name: string;
  age: string;
  job: string;
  gender: string;
  skinType: string;
  skinConcerns: string[];
  hairType: string;
  hairConcerns: string[];
  currentSkinRoutine: string;
  currentHairRoutine: string;
}

const SignupPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState<'welcome' | 'onboarding'>('welcome');
  
  const handleOnboardingComplete = async (finalUserData: OnboardingData & { mobile: string; password: string }) => {

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalUserData),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'خطایی در ثبت‌نام رخ داد.');
      }

      const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobile: finalUserData.mobile, password: finalUserData.password }),
      });
      const loginResult = await loginResponse.json();
      if (!loginResponse.ok) {
          throw new Error('ثبت‌نام موفق بود اما ورود خودکار با خطا مواجه شد.');
      }

      login(loginResult.user); // به‌روزرسانی فوری وضعیت کاربر
      router.push('/');

    } catch (err: any) {
      console.error('Signup error:', err.message);
      // Handle error - could show a toast or redirect back to welcome
    }
  };

  if (step === 'welcome') {
    return <WelcomePage onContinue={() => setStep('onboarding')} />;
  }

  return <OnboardingFlow onComplete={handleOnboardingComplete} />;
};

export default SignupPage;
