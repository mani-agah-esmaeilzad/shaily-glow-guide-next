'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileSetupStep } from './profile-setup-step';
import { SkinAnalysisStep } from './skin-analysis-step';
import { MobilePasswordStep } from './mobile-password-step';
import { OnboardingData } from '@/types'; // ایمپورت از فایل مرکزی

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData & { mobile: string; password: string }) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [data, setData] = useState<OnboardingData>({
    firstName: '',
    lastName: '',
    avatarUrl: '',
    gender: '',
    age: '',
    comedones: '',
    redPimples: '',
    fineLines: '',
    foreheadNose: '',
    sideNose: '',
    cheeks: '',
  });

  const totalSteps = 3;

  const updateData = (newData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push('/');
    }
  };

  const handleMobilePasswordSubmit = (authData: { mobile: string; password: string }) => {
    setIsLoading(true);
    const finalData = { ...data, ...authData };
    onComplete(finalData);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <ProfileSetupStep data={data} updateData={updateData} onNext={nextStep} />;
      case 2:
        return <SkinAnalysisStep data={data} updateData={updateData} onNext={nextStep} onPrev={prevStep} />;
      case 3:
        return <MobilePasswordStep onNext={handleMobilePasswordSubmit} onPrev={prevStep} isLoading={isLoading} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-brand-cream to-brand-beige p-4" style={{ direction: 'rtl' }}>
      <div className="w-full max-w-3xl mx-auto flex flex-col flex-1">
        <div className="text-center mb-4 md:mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-brown rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-lg"></div>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">پروفایل پوست شما</h1>
          <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto">
            به چند سوال پاسخ دهید تا بهترین روتین را برای شما طراحی کنیم.
          </p>
        </div>

        <div className="mb-4 md:mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-brand-primary">{Math.round((currentStep / totalSteps) * 100)}% کامل شده</span>
            <span className="text-sm font-semibold text-gray-600">مرحله {currentStep} از {totalSteps}</span>
          </div>
          <div className="w-full bg-brand-tan/30 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-brand-primary to-brand-brown h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white/95 rounded-3xl shadow-2xl border border-brand-tan/20 overflow-hidden backdrop-blur-sm flex-1 flex flex-col">
          <div className="p-4 md:p-8 flex-1 flex flex-col">
            {renderCurrentStep()}
          </div>
        </div>
      </div>
    </div>
  );
};
