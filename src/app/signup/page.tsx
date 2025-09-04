'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow';
import { WelcomePage } from '@/components/welcome-page';
import { OnboardingData } from '@/types';

const SignupPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState<'welcome' | 'onboarding'>('welcome');

  const handleOnboardingComplete = async (finalUserData: OnboardingData & { mobile: string; password: string }) => {
    try {
      // Step 1: Register the user
      const signupResponse = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalUserData),
      });
      if (!signupResponse.ok) {
        const result = await signupResponse.json();
        throw new Error(result.error || 'خطایی در ثبت‌نام رخ داد.');
      }

      // Step 2: Log the user in
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: finalUserData.mobile, password: finalUserData.password }),
      });
      const loginResult = await loginResponse.json();
      if (!loginResponse.ok) {
        throw new Error('ثبت‌نام موفق بود اما ورود خودکار با خطا مواجه شد.');
      }

      // Step 3: Update auth context and redirect
      login(loginResult.user);
      router.push('/');

    } catch (err: any) {
      console.error('Signup process error:', err.message);
      // Here you can add a toast notification to show the error to the user
    }
  };

  if (step === 'welcome') {
    return <WelcomePage onContinue={() => setStep('onboarding')} />;
  }

  return <OnboardingFlow onComplete={handleOnboardingComplete} />;
};

export default SignupPage;
