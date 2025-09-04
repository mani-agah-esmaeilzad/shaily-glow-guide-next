'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { HairCarePrompts } from '@/components/hair-care-prompts'; // کامپوننت جدید

const HairCarePage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-4 md:p-8" dir="rtl">
            <div className="max-w-3xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-blue-800">مراقبت از مو</h1>
                        <p className="text-gray-600 mt-2">راهنمای کامل و شخصی‌سازی شده برای داشتن موهایی سالم، پرپشت و درخشان.</p>
                    </div>
                    <Link href="/">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 ml-2" />
                            بازگشت به داشبورد
                        </Button>
                    </Link>
                </header>

                <main>
                    <HairCarePrompts />
                </main>
            </div>
        </div>
    );
};

export default HairCarePage;