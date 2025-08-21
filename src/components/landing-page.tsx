// src/components/landing-page.tsx

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Bot, Zap, Star, ArrowLeft } from 'lucide-react';

interface LandingPageProps {
    onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    return (
        <div className="bg-background text-foreground">
            {/* Navigation Bar */}
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-primary">شایلی</h2>
                <Button variant="ghost" onClick={() => window.location.href = '/login'}>
                    ورود
                </Button>
            </nav>

            {/* Hero Section */}
            <header className="container mx-auto px-6 pt-24 pb-32 text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                    راهنمای هوشمند شما برای <br />
                    <span className="text-primary">پوست و موی درخشان</span>
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
                    با شایلی، روتین‌های مراقبتی خود را بر اساس علم و با کمک هوش مصنوعی شخصی‌سازی کنید و به بهترین نسخه از زیبایی خود دست یابید.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Button size="lg" className="px-8 py-6 text-lg font-semibold" onClick={onGetStarted}>
                        شروع رایگان <ArrowLeft className="mr-2 h-5 w-5" />
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6">
                {/* How it Works Section */}
                <section className="py-24">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold">چطور کار می‌کند؟</h2>
                        <p className="mt-4 text-muted-foreground text-lg">در سه مرحله ساده، مسیر زیبایی خود را آغاز کنید.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="space-y-4">
                            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">۱</div>
                            <h3 className="text-2xl font-semibold">پروفایل خود را بسازید</h3>
                            <p className="text-muted-foreground">به چند سوال ساده درباره نوع پوست، مو و نگرانی‌های خود پاسخ دهید.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">۲</div>
                            <h3 className="text-2xl font-semibold">روتین شخصی خود را دریافت کنید</h3>
                            <p className="text-muted-foreground">هوش مصنوعی شایلی یک برنامه مراقبتی روزانه مخصوص شما طراحی می‌کند.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">۳</div>
                            <h3 className="text-2xl font-semibold">پیشرفت خود را دنبال کنید</h3>
                            <p className="text-muted-foreground">با انجام روتین‌ها و دریافت بازخورد، شاهد تغییرات مثبت باشید.</p>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative w-full h-80 md:h-[500px] rounded-2xl overflow-hidden">
                        <Image
                            src="/hero-image-main.jpg" // آدرس تصویر جدید
                            alt="AI analysis of skin"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Bot />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">تحلیل هوشمند</h3>
                                <p className="mt-2 text-muted-foreground">شایلی با تحلیل اطلاعات شما، محصولاتی را پیشنهاد می‌دهد که دقیقاً برای شما مناسب هستند.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Zap />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">یادآوری‌های هوشمند</h3>
                                <p className="mt-2 text-muted-foreground">دیگر هیچ مرحله‌ای از روتین خود را فراموش نکنید. ما به موقع به شما یادآوری می‌کنیم.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Star />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">محتوای آموزشی</h3>
                                <p className="mt-2 text-muted-foreground">به مقالات و ویدیوهای آموزشی دسترسی پیدا کنید که توسط متخصصان تهیه شده‌اند.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-24">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold">تجربه کاربران ما</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="p-6 bg-slate-50/50">
                            <CardContent className="space-y-4">
                                <p>"شایلی زندگی من رو تغییر داد! پوستم هیچوقت اینقدر شفاف و سالم نبوده."</p>
                                <div className="flex items-center gap-4">
                                    <div className="relative h-12 w-12 rounded-full overflow-hidden">
                                        <Image src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop" alt="User 1" layout="fill" objectFit="cover" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">سارا محمدی</p>
                                        <p className="text-sm text-muted-foreground">کاربر از تهران</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="p-6 bg-slate-50/50">
                            <CardContent className="space-y-4">
                                <p>"بالاخره تونستم ریزش موهام رو کنترل کنم. روتینی که شایلی پیشنهاد داد فوق‌العاده بود."</p>
                                <div className="flex items-center gap-4">
                                    <div className="relative h-12 w-12 rounded-full overflow-hidden">
                                        <Image src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop" alt="User 2" layout="fill" objectFit="cover" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">علی رضایی</p>
                                        <p className="text-sm text-muted-foreground">کاربر از اصفهان</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="p-6 bg-slate-50/50">
                            <CardContent className="space-y-4">
                                <p>"بهترین بخش شایلی، مشاور هوش مصنوعیشه. هر سوالی داشتم سریع جواب گرفتم."</p>
                                <div className="flex items-center gap-4">
                                    <div className="relative h-12 w-12 rounded-full overflow-hidden">
                                        <Image src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop" alt="User 3" layout="fill" objectFit="cover" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">مریم احمدی</p>
                                        <p className="text-sm text-muted-foreground">کاربر از شیراز</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="bg-primary/90 text-primary-foreground rounded-2xl my-24 p-12 md:p-20 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold">آماده‌ای برای تحول؟</h2>
                    <p className="mt-4 max-w-xl mx-auto text-lg opacity-90">
                        همین امروز به هزاران کاربر راضی شایلی بپیوندید و اولین قدم را برای داشتن پوست و موی سالم‌تر بردارید.
                    </p>
                    <div className="mt-8">
                        <Button size="lg" variant="secondary" className="px-8 py-6 text-lg font-semibold" onClick={onGetStarted}>
                            رایگان شروع کن
                        </Button>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="container mx-auto px-6 py-8 text-center text-muted-foreground">
                <p>&copy; ۲۰۲۴ شایلی. تمام حقوق محفوظ است.</p>
            </footer>
        </div>
    );
};