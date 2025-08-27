import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, Users } from 'lucide-react';

interface GenderData {
  gender: string;
}

interface GenderStepProps {
  data: GenderData;
  updateData: (data: Partial<GenderData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const GenderStep: React.FC<GenderStepProps> = ({ data, updateData, onNext, onPrev }) => {
  const isValid = data.gender;

  const genderOptions = [
    { value: 'female', label: 'زن', icon: '👩', description: 'روتین‌های زیبایی و محصولات زنانه' },
    { value: 'male', label: 'مرد', icon: '👨', description: 'روتین‌های مراقبت و پیرایش مردانه' },
    { value: 'non-binary', label: 'غیردوجنسی', icon: '🌟', description: 'روتین‌های شخصی برای تمام هویت‌ها' },
    { value: 'prefer-not-to-say', label: 'تمایل به بیان ندارم', icon: '🤐', description: 'روتین‌های خنثی زیبایی و تندرستی' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-br from-brand-cream to-brand-tan rounded-2xl mx-auto flex items-center justify-center">
          <Users className="w-10 h-10 text-brand-primary" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">هویت جنسی</h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          این به ما کمک می‌کند تا روتین زیبایی و پیشنهادات محصولات شما را شخصی‌سازی کنیم
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {genderOptions.map((option) => (
            <Card
              key={option.value}
              className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:scale-[1.02] ${
                data.gender === option.value
                  ? 'border-2 border-brand-primary bg-gradient-to-br from-brand-cream to-brand-beige shadow-xl scale-[1.02]'
                  : 'border-2 border-brand-tan/30 hover:border-brand-primary/50 bg-white'
              }`}
              onClick={() => updateData({ gender: option.value })}
            >
              <div className="text-center space-y-3">
                <div className="text-4xl mb-2">{option.icon}</div>
                <div className="font-bold text-lg text-gray-900">{option.label}</div>
                <p className="text-sm text-gray-600">{option.description}</p>
                {data.gender === option.value && (
                  <div className="w-6 h-6 bg-brand-primary rounded-full mx-auto flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <Button
          onClick={onNext}
          disabled={!isValid}
          className={`flex-1 h-12 text-base font-bold rounded-xl transition-all duration-300 transform ${
            isValid 
              ? 'bg-gradient-to-r from-brand-primary to-brand-brown hover:from-brand-primary/90 hover:to-brand-brown/90 hover:scale-[1.02] shadow-xl hover:shadow-2xl text-white'
              : 'bg-gray-300 cursor-not-allowed text-gray-500'
          }`}
        >
          {isValid ? (
            <div className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5 rotate-180" />
              <span>ادامه</span>
            </div>
          ) : (
            'لطفاً یک گزینه انتخاب کنید'
          )}
        </Button>
        <Button 
          variant="outline" 
          onClick={onPrev} 
          className="flex-1 h-12 text-base font-semibold rounded-xl border-2 border-brand-tan/30 hover:border-brand-primary/50 transition-all duration-300"
        >
          <span>قبلی</span>
          <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
        </Button>
      </div>
    </div>
  );
};