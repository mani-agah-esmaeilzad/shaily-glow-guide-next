'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Sun, Leaf, Sparkles } from 'lucide-react';

const brighteningPrompts = [
  {
    icon: <Sun className="h-6 w-6 text-orange-500" />,
    title: 'روتین کامل روشن‌کننده',
    prompt: 'یک روتین کامل روز و شب برای از بین بردن کدری پوست و افزایش شفافیت و درخشندگی آن به من پیشنهاد بده.',
    description: 'تمرکز بر محو کردن لک‌های تیره و یکدست کردن رنگ پوست.'
  },
  {
    icon: <Sparkles className="h-6 w-6 text-yellow-400" />,
    title: 'معرفی ویتامین C و نیاسینامید',
    prompt: 'دو تا از بهترین ترکیبات برای روشن شدن پوست، یعنی ویتامین C و نیاسینامید را به زبان ساده معرفی کن و بگو چطور باید از آنها استفاده کنم؟',
    description: 'آشنایی با دو قهرمان اصلی دنیای محصولات روشن‌کننده پوست.'
  },
  {
    icon: <Leaf className="h-6 w-6 text-green-500" />,
    title: 'راهکارهای طبیعی برای شفافیت پوست',
    prompt: 'به جز محصولات، چه راهکارهای طبیعی و خانگی یا تغییرات در سبک زندگی برای روشن و شفاف شدن پوستم وجود دارد؟',
    description: 'نکات کاربردی از تغذیه و ماسک‌های خانگی برای درخشش طبیعی پوست.'
  },
];

export const BrighteningPrompts = () => {
  const router = useRouter();

  const handlePromptClick = (prompt: string) => {
    router.push(`/?prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <div className="space-y-4">
      {brighteningPrompts.map((item, index) => (
        <Card key={index} className="transition-all hover:shadow-lg hover:border-orange-500/30">
          <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-500 hidden md:block">{item.description}</p>
              </div>
            </div>
            <Button onClick={() => handlePromptClick(item.prompt)} className="w-full md:w-auto md:mr-auto flex-shrink-0 bg-orange-500 hover:bg-orange-600">
              <Bot className="h-4 w-4 ml-2" />
              از شایلی بپرس
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};