'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Bot, Clock, Droplet, Star } from 'lucide-react';

const rejuvenationPrompts = [
    {
        icon: <Clock className="h-6 w-6 text-purple-500" />,
        title: 'بهترین روتین ضد پیری',
        prompt: 'یک روتین کامل روز و شب با قوی‌ترین ترکیبات ضد پیری و جوان‌ساز برایم طراحی کن.',
        description: 'تمرکز بر کاهش چروک‌ها و افزایش سفتی و الاستیسیته پوست.'
    },
    {
        icon: <Droplet className="h-6 w-6 text-sky-500" />,
        title: 'معرفی بهترین ترکیبات جوان‌ساز',
        prompt: 'مهم‌ترین و موثرترین ترکیبات فعال (active ingredients) برای جوان‌سازی پوست کدامند و هرکدام چه کاری انجام می‌دهند؟',
        description: 'آشنایی با قهرمانان دنیای ضد پیری مانند رتینول، پپتیدها و آنتی‌اکسیدان‌ها.'
    },
    {
        icon: <Star className="h-6 w-6 text-yellow-500" />,
        title: 'روتین پیشگیری از چروک',
        prompt: 'من در دهه بیست زندگی‌ام هستم و می‌خواهم از الان از پیری پوستم جلوگیری کنم. یک روتین پیشگیرانه موثر به من پیشنهاد بده.',
        description: 'راهکارهای هوشمندانه برای به تعویق انداختن علائم پیری از سنین پایین.'
    },
];

export const RejuvenationPrompts = () => {
    const router = useRouter();

    const handlePromptClick = (prompt: string) => {
        router.push(`/?prompt=${encodeURIComponent(prompt)}`);
    };

    return (
        <div className="space-y-4">
            {rejuvenationPrompts.map((item, index) => (
                <Card key={index} className="transition-all hover:shadow-lg hover:border-purple-500/30">
                    <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                {item.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-800">{item.title}</h3>
                                <p className="text-sm text-gray-500 hidden md:block">{item.description}</p>
                            </div>
                        </div>
                        <Button onClick={() => handlePromptClick(item.prompt)} className="w-full md:w-auto md:mr-auto flex-shrink-0 bg-purple-600 hover:bg-purple-700">
                            <Bot className="h-4 w-4 ml-2" />
                            از شایلی بپرس
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};