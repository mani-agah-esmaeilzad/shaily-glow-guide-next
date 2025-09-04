'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Wind, Droplets, Scissors } from 'lucide-react';

const hairCarePrompts = [
    {
        icon: <Wind className="h-6 w-6 text-gray-500" />,
        title: 'روتین ضد ریزش مو',
        prompt: 'یک روتین کامل و موثر برای کنترل و کاهش ریزش مو به همراه معرفی ترکیبات مفید برایم طراحی کن.',
        description: 'تمرکز بر تقویت ریشه مو و جلوگیری از ریزش بیش از حد.'
    },
    {
        icon: <Droplets className="h-6 w-6 text-blue-400" />,
        title: 'روتین موهای خشک و آسیب‌دیده',
        prompt: 'موی من به خاطر رنگ و دکلره خشک و شکننده شده. یک روتین آبرسان و ترمیم‌کننده قوی به من پیشنهاد بده.',
        description: 'راهکارهایی برای بازگرداندن نرمی، رطوبت و درخشش به موهای آسیب‌dideh.'
    },
    {
        icon: <Scissors className="h-6 w-6 text-red-500" />,
        title: 'راهکارهای افزایش رشد مو',
        prompt: 'چه راهکارهایی (محصولات، ماسک‌های خانگی، ویتامین‌ها) برای افزایش سرعت رشد مو وجود دارد؟',
        description: 'نکات کاربردی برای تقویت فولیکول‌ها و داشتن موهایی بلندتر و سالم‌تر.'
    },
];

export const HairCarePrompts = () => {
    const router = useRouter();

    const handlePromptClick = (prompt: string) => {
        router.push(`/?prompt=${encodeURIComponent(prompt)}`);
    };

    return (
        <div className="space-y-4">
            {hairCarePrompts.map((item, index) => (
                <Card key={index} className="transition-all hover:shadow-lg hover:border-blue-500/30">
                    <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                {item.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-800">{item.title}</h3>
                                <p className="text-sm text-gray-500 hidden md:block">{item.description}</p>
                            </div>
                        </div>
                        <Button onClick={() => handlePromptClick(item.prompt)} className="w-full md:w-auto md:mr-auto flex-shrink-0 bg-blue-500 hover:bg-blue-600">
                            <Bot className="h-4 w-4 ml-2" />
                            از شایلی بپرس
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};