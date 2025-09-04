'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface FeedCard {
    type: string;
    title: string;
    content: string;
    icon: string;
}

const DiscoveryFeedPage = () => {
    const { user } = useAuth();
    const [feed, setFeed] = useState<FeedCard[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchFeed = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/discover-feed/${user.id}`);
            if (res.ok) {
                const data = await res.json();
                setFeed(data);
            } else {
                setFeed([]); // در صورت خطا، فید را خالی کن
            }
        } catch (error) {
            console.error("Failed to fetch feed:", error);
            setFeed([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchFeed();
        } else {
            setIsLoading(false);
        }
    }, [user]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-cream">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-brand-primary mx-auto" />
                    <p className="mt-4 text-gray-600">شایلی در حال آماده کردن فید شخصی شماست...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-brand-cream">
                <p className="mb-4">برای مشاهده این صفحه باید وارد شوید.</p>
                <Link href="/login"><Button>صفحه ورود</Button></Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-cream to-brand-beige p-4 md:p-8" dir="rtl">
            <div className="max-w-2xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-brand-primary">کشف روز</h1>
                        <p className="text-gray-500 mt-2">نکات روزانه و شخصی‌سازی شده برای شما</p>
                    </div>
                    <Link href="/">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 ml-2" />
                            بازگشت
                        </Button>
                    </Link>
                </header>

                <div className="text-center mb-6">
                    <Button onClick={fetchFeed} disabled={isLoading}>
                        <RefreshCw className={`h-4 w-4 ml-2 ${isLoading ? 'animate-spin' : ''}`} />
                        دریافت نکات جدید
                    </Button>
                </div>

                {feed.length === 0 && !isLoading ? (
                    <div className="text-center py-16 border-2 border-dashed rounded-xl">
                        <h3 className="text-xl font-semibold text-gray-700">خطا در دریافت فید</h3>
                        <p className="text-gray-500 mt-2">متاسفانه مشکلی در تولید محتوای هوشمند پیش آمد. لطفا دوباره تلاش کنید.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {feed.map((card, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardContent className="p-6 flex items-start gap-4">
                                        <div className="text-4xl">{card.icon}</div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-brand-primary mb-1">{card.title}</h3>
                                            <p className="text-gray-700 leading-relaxed">{card.content}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscoveryFeedPage;