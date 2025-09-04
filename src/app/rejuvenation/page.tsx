'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { RejuvenationPrompts } from '@/components/rejuvenation-prompts'; // کامپوننت جدید

const RejuvenationPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 p-4 md:p-8" dir="rtl">
            <div className="max-w-3xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-purple-800">مشاوره جوان‌سازی</h1>
                        <p className="text-gray-600 mt-2">راهکارهای علمی و شخصی‌سازی شده برای حفظ جوانی و شادابی پوستتان را از شایلی بخواهید.</p>
                    </div>
                    <Link href="/">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 ml-2" />
                            بازگشت به داشبورد
                        </Button>
                    </Link>
                </header>

                <main>
                    <RejuvenationPrompts />
                </main>
            </div>
        </div>
    );
};

export default RejuvenationPage;