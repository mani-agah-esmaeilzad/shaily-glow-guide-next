'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, GlassWater, Sun, Moon, Zap, Shield, Leaf, Wind } from 'lucide-react';

// **لیست جدید و گسترش‌یافته روتین‌های پرطرفدار**
const popularPrompts = [
    {
        icon: <GlassWater className="h-6 w-6 text-blue-500" />,
        title: 'روتین پوست شیشه‌ای کره‌ای (Glass Skin)',
        prompt: 'یک روتین کامل و دقیق، مرحله به مرحله، برای رسیدن به پوست شیشه‌ای کره‌ای به من پیشنهاد بده.',
        description: 'برای دستیابی به پوستی شفاف، درخشان و عمیقا آبرسانی شده.'
    },
    {
        icon: <Sun className="h-6 w-6 text-orange-500" />,
        title: 'روتین ضد لک و روشن کننده',
        prompt: 'بهترین روتین صبح و شب برای مبارزه با لک‌های تیره و روشن شدن کلی رنگ پوست چیست؟',
        description: 'تمرکز بر روی محو کردن لک‌های موجود و جلوگیری از ایجاد لک جدید.'
    },
    {
        icon: <Moon className="h-6 w-6 text-purple-500" />,
        title: 'روتین قدرتمند ضد چروک شبانه',
        prompt: 'یک روتین شبانه قدرتمند برای کاهش خطوط ریز صورت و جلوگیری از پیری پوست برایم بساز.',
        description: 'با استفاده از قوی‌ترین ترکیبات ضدپیری برای بازسازی پوست در طول شب.'
    },
    {
        icon: <Zap className="h-6 w-6 text-yellow-500" />,
        title: 'روتین فوری ضد جوش اورژانسی',
        prompt: 'یک روتین اورژانسی برای وقتی که یک جوش بزرگ و ملتهب روی صورتم زده پیشنهاد بده تا سریع‌تر خشک بشه.',
        description: 'راهکارهای سریع و موثر برای آرام کردن و درمان جوش‌های ناگهانی.'
    },
    {
        icon: <Shield className="h-6 w-6 text-green-600" />,
        title: 'روتین ترمیم سد دفاعی پوست',
        prompt: 'پوست من حساس و تحریک شده. یک روتین ملایم برای ترمیم سد دفاعی پوستم پیشنهاد کن.',
        description: 'برای پوست‌های حساس، قرمز و آسیب‌دیده که نیاز به آرامش و بازسازی دارند.'
    },
    {
        icon: <Leaf className="h-6 w-6 text-teal-500" />,
        title: 'روتین مینیمال (کمترین محصول، بیشترین اثر)',
        prompt: 'من وقت زیادی ندارم. یک روتین پوستی مینیمال اما موثر با کمترین تعداد محصول ممکن برایم طراحی کن.',
        description: 'یک برنامه ساده و سریع برای کسانی که به دنبال سادگی و کارایی هستند.'
    },
    {
        icon: <Wind className="h-6 w-6 text-gray-500" />,
        title: 'روتین پاکسازی منافذ و کنترل چربی',
        prompt: 'یک روتین برای پاکسازی عمیق منافذ پوست و کنترل چربی در ناحیه T-zone صورتم می‌خواهم.',
        description: 'ایده‌آل برای پوست‌های چرب و مختلط که با منافذ باز و جوش سرسیاه درگیرند.'
    },
    {
        icon: <Sparkles className="h-6 w-6 text-pink-500" />,
        title: 'روتین درخشش فوری قبل از مهمانی',
        prompt: 'برای امشب یک برنامه مراقبتی سریع می‌خواهم که پوست صورتم را برای آرایش آماده و درخشان کند.',
        description: 'یک آماده‌سازی سریع برای داشتن پوستی سرحال و شفاف در مناسبت‌های خاص.'
    },
];

export const TrendingPrompts = () => {
    const router = useRouter();

    const handlePromptClick = (prompt: string) => {
        // Redirect to the dashboard with the prompt in the URL
        router.push(`/?prompt=${encodeURIComponent(prompt)}`);
    };

    return (
        <div className="space-y-4">
            {popularPrompts.map((item, index) => (
                <Card key={index} className="transition-all hover:shadow-lg hover:border-brand-primary/30">
                    <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                {item.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-800">{item.title}</h3>
                                <p className="text-sm text-gray-500 hidden md:block">{item.description}</p>
                            </div>
                        </div>
                        <Button onClick={() => handlePromptClick(item.prompt)} className="w-full md:w-auto md:mr-auto flex-shrink-0">
                            <Sparkles className="h-4 w-4 ml-2" />
                            از شایلی بپرس
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};