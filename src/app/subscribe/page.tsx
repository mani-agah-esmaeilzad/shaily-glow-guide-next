'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const plans = [
    {
        name: 'پایه',
        price: 'رایگان',
        features: ['روتین شخصی‌سازی شده', 'چت محدود با شایلی', 'گزارش روزانه'],
    },
    {
        name: 'حرفه‌ای',
        price: '۱۲۰ هزار تومان',
        priceSuffix: '/ ماهانه',
        features: ['تمام ویژگی‌های پایه', 'چت نامحدود با شایلی', 'گزارش هفتگی هوشمند', 'قفسه مجازی محصولات'],
        popular: true,
    },
    {
        name: 'ویژه',
        price: '۳۵۰ هزار تومان',
        priceSuffix: '/ سه ماهه',
        features: ['تمام ویژگی‌های حرفه‌ای', 'مشاوره با متخصصین', 'تحلیل پیشرفته پوست'],
    },
];

const SubscribePage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-cream to-brand-beige p-4 md:p-8" dir="rtl">
            <div className="max-w-5xl mx-auto">
                <header className="flex items-center justify-end mb-8">
                    <Link href="/">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 ml-2" />
                            بازگشت به داشبورد
                        </Button>
                    </Link>
                </header>

                <main className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-brand-primary">پلن اشتراک خود را انتخاب کنید</h1>
                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">با اشتراک حرفه‌ای، به تمام قابلیت‌های شگفت‌انگیز شایلی دسترسی پیدا کنید و مسیر سلامتی پوست خود را متحول کنید.</p>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                        {plans.map((plan) => (
                            <Card key={plan.name} className={`text-right transition-all duration-300 ${plan.popular ? 'border-2 border-brand-primary shadow-2xl scale-105' : 'shadow-lg'}`}>
                                <CardHeader>
                                    {plan.popular && <div className="text-sm font-bold text-brand-primary mb-2">پرطرفدارترین</div>}
                                    <CardTitle className="text-3xl font-bold">{plan.name}</CardTitle>
                                    <CardDescription className="text-2xl font-extrabold text-gray-800 mt-2">
                                        {plan.price}
                                        {plan.priceSuffix && <span className="text-base font-medium text-gray-500">{plan.priceSuffix}</span>}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3 my-6">
                                        {plan.features.map(feature => (
                                            <li key={feature} className="flex items-center gap-3">
                                                <Check className="h-5 w-5 text-green-500" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button size="lg" className={`w-full ${plan.popular ? '' : 'bg-gray-800'}`}>
                                        انتخاب پلن
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SubscribePage;