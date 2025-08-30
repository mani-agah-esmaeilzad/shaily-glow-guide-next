import React, { useState } from 'react';
import { ProgressSteps } from '@/components/ui/progress-steps';
import { BasicInfoStep } from './basic-info-step';
import { GenderStep } from './gender-step';
import { SkinTypeStep } from './skin-type-step';
import { HairTypeStep } from './hair-type-step';
import { CurrentRoutineStep } from './current-routine-step';
import { ReviewStep } from './review-step';
import { MobilePasswordStep } from './mobile-password-step';

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

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData & { mobile: string; password: string }) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    age: '',
    job: '',
    gender: '',
    skinType: '',
    skinConcerns: [],
    hairType: '',
    hairConcerns: [],
    currentSkinRoutine: '',
    currentHairRoutine: ''
  });

  const totalSteps = 7;

  const updateData = (newData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleMobilePasswordSubmit = (authData: { mobile: string; password: string }) => {
    setIsLoading(true);
    const finalData = { ...data, ...authData };
    onComplete(finalData);
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep data={data} updateData={updateData} onNext={nextStep} />;
      case 2:
        return <GenderStep data={data} updateData={updateData} onNext={nextStep} onPrev={prevStep} />;
      case 3:
        return <SkinTypeStep data={data} updateData={updateData} onNext={nextStep} onPrev={prevStep} />;
      case 4:
        return <HairTypeStep data={data} updateData={updateData} onNext={nextStep} onPrev={prevStep} />;
      case 5:
        return <CurrentRoutineStep data={data} updateData={updateData} onNext={nextStep} onPrev={prevStep} />;
      case 6:
        return <ReviewStep data={data} onNext={nextStep} onPrev={prevStep} />;
      case 7:
        return <MobilePasswordStep onNext={handleMobilePasswordSubmit} onPrev={prevStep} isLoading={isLoading} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-cream to-brand-beige py-8 px-4" style={{ direction: 'rtl' }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-brown rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-lg"></div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">بیایید با هم آشنا شویم</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            کمک کنید تا روتین زیبایی شخصی مناسب نیازها و سبک زندگی یکتای شما بسازیم
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-brand-primary">{Math.round((currentStep / totalSteps) * 100)}% کامل شده</span>
            <span className="text-sm font-semibold text-gray-600">مرحله {currentStep} از {totalSteps}</span>
          </div>
          <div className="w-full bg-brand-tan/30 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-brand-primary to-brand-brown h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/95 rounded-3xl shadow-2xl border border-brand-tan/20 overflow-hidden backdrop-blur-sm">
          <div className="p-8 md:p-12">
            {renderCurrentStep()}
          </div>
        </div>
        
        {/* Help Text */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            اطلاعات شما امن است و فقط برای شخصی‌سازی تجربه شما استفاده خواهد شد
          </p>
        </div>
      </div>
    </div>
  );
};