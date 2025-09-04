'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AvatarDisplay } from '@/components/ui/avatar-display';
import { Badge } from '@/components/ui/badge';
import type { UserProfile } from '@/types';
import { ScrollArea } from './ui/scroll-area';

interface UserProfileModalProps {
  user: UserProfile;
}

// تابعی برای ترجمه مقادیر به فارسی خوانا
const translateValue = (key: keyof UserProfile, value: string) => {
  const translations: Record<string, Record<string, string>> = {
    age: {
      '12-18': '۱۲ تا ۱۸ سال',
      '19-25': '۱۹ تا ۲۵ سال',
      '26-35': '۲۶ تا ۳۵ سال',
      '36-45': '۳۶ تا ۴۵ سال',
      '46-55': '۴۶ تا ۵۵ سال',
      '55+': 'بالای ۵۵ سال'
    },
    gender: {
      'female': 'خانم',
      'male': 'آقا'
    },
    comedones: {
      'less-5': 'کمتر از ۵ عدد',
      '5-10': 'حدود ۵ تا ۱۰ عدد',
      'more-10': 'بیشتر از ۱۰ عدد'
    },
    redPimples: {
      '0-2': '۰ تا ۲ عدد',
      '3-5': '۳ تا ۵ عدد',
      'more-5': 'بیشتر از ۵ عدد'
    },
    fineLines: {
      'none': 'هیچ خط ظریفی مشاهده نمی‌شود',
      'few-visible': 'چند خط ظریف و قابل مشاهده',
      'deep-prominent': 'خطوط عمیق و برجسته'
    },
    foreheadNose: {
      'oily': 'چرب',
      'dry': 'خشک',
      'normal': 'طبیعی'
    },
    sideNose: {
      'oily': 'چرب',
      'dry': 'خشک',
      'normal': 'طبیعی'
    },
    cheeks: {
      'oily': 'چرب',
      'dry': 'خشک',
      'normal': 'طبیعی'
    }
  };
  return translations[key]?.[value] || value;
};

const ProfileDetailItem: React.FC<{ label: string; value?: string | string[] }> = ({ label, value }) => {
  if (!value || value.length === 0) return null;
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
      <p className="text-sm text-gray-500">{label}:</p>
      {Array.isArray(value) ? (
        <div className="flex flex-wrap gap-1 justify-end">
          {value.map(item => <Badge key={item} variant="secondary">{item}</Badge>)}
        </div>
      ) : (
        <p className="font-medium text-sm text-gray-800">{value}</p>
      )}
    </div>
  );
};

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ user }) => {
  const profileDetails = [
    { label: 'بازه سنی', value: translateValue('age', user.age) },
    { label: 'جنسیت', value: translateValue('gender', user.gender) },
  ];

  const skinAnalysisDetails = [
    { label: 'کومدون‌ها', value: translateValue('comedones', user.comedones) },
    { label: 'جوش‌های قرمز', value: translateValue('redPimples', user.redPimples) },
    { label: 'خطوط ظریف', value: translateValue('fineLines', user.fineLines) },
    { label: 'وضعیت پیشانی و بینی', value: translateValue('foreheadNose', user.foreheadNose) },
    { label: 'وضعیت کناره‌های بینی', value: translateValue('sideNose', user.sideNose) },
    { label: 'وضعیت گونه‌ها', value: translateValue('cheeks', user.cheeks) },
    { label: 'نوع کلی پوست', value: user.skinType },
    { label: 'نگرانی‌های پوستی', value: user.skinConcerns },
  ];
  
  const hairAnalysisDetails = [
      { label: 'نوع مو', value: user.hairType },
      { label: 'نگرانی‌های مو', value: user.hairConcerns },
  ];

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader className="flex flex-col items-center text-center -mt-16">
        <AvatarDisplay gender={user.gender} name={user.name} size="xl" className="mb-4 border-4 border-white shadow-lg" />
        <DialogTitle className="text-2xl font-bold">{user.name}</DialogTitle>
        <DialogDescription>{user.mobile}</DialogDescription>
      </DialogHeader>
      
      <ScrollArea className="max-h-[60vh] mt-4 pr-4">
        <div className="space-y-6">
          <div>
            <h3 className="font-bold mb-2 text-brand-primary">اطلاعات پایه</h3>
            {profileDetails.map(item => <ProfileDetailItem key={item.label} {...item} />)}
          </div>
          <div>
            <h3 className="font-bold mb-2 text-brand-primary">آنالیز پوست</h3>
            {skinAnalysisDetails.map(item => <ProfileDetailItem key={item.label} {...item} />)}
          </div>
          <div>
            <h3 className="font-bold mb-2 text-brand-primary">اطلاعات مو</h3>
            {hairAnalysisDetails.map(item => <ProfileDetailItem key={item.label} {...item} />)}
          </div>
        </div>
      </ScrollArea>
    </DialogContent>
  );
};