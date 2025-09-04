'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { TrendingPrompts } from '@/components/trending-prompts';

const TrendingRoutinesPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-cream to-brand-beige p-4 md:p-8" dir="rtl">
            <div className="max-w-3xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-brand-primary">روتین‌های پرطرفدار</h1>
                        <p className="text-gray-500 mt-2">محبوب‌ترین روتین‌ها را کشف کرده و از شایلی بخواهید آن‌ها را برای شما شخصی‌سازی کند.</p>
                    </div>
                    <Link href="/">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 ml-2" />
                            بازگشت به داشبورد
                        </Button>
                    </Link>
                </header>

                <main>
                    <TrendingPrompts />
                </main>
            </div>
        </div>
    );
};

export default TrendingRoutinesPage;