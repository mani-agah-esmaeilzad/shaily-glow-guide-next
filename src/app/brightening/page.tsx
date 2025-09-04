'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BrighteningPrompts } from '@/components/brightening-prompts'; // کامپوننت جدید

const BrighteningPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 p-4 md:p-8" dir="rtl">
            <div className="max-w-3xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-orange-700">روشن‌کننده پوست</h1>
                        <p className="text-gray-600 mt-2">راهکارهای علمی برای پوستی شفاف، درخشان و یکدست را از شایلی بخواهید.</p>
                    </div>
                    <Link href="/">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 ml-2" />
                            بازگشت به داشبورد
                        </Button>
                    </Link>
                </header>

                <main>
                    <BrighteningPrompts />
                </main>
            </div>
        </div>
    );
};

export default BrighteningPage;