// src/components/landing-page.tsx - Complete redesign with new color theme

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, Sparkles, Heart, Shield, Bot, Users, Star, Droplets, Sun, Send } from "lucide-react"

interface LandingPageProps {
    onGetStarted: () => void;
}

const suggestedQueries = [
    'بهترین روتین مراقبت از پوست چرب چیست؟',
    'چگونه از ریزش مو جلوگیری کنم؟',
    'کرم ضد آفتاب مناسب پوست حساس',
    'روش‌های طبیعی برای درمان جوش صورت'
];

const typingAnimationQueries = [
    'بهترین روتین مراقبت از پوست چرب چیست؟',
    'چگونه از ریزش مو جلوگیری کنم؟',
    'کرم ضد آفتاب مناسب پوست حساس پیشنهاد دهید',
    'روش‌های طبیعی برای درمان جوش صورت',
    'چه مواد فعالی برای ضد پیری مناسب است؟',
    'روتین مراقبت از موهای خشک و آسیب دیده',
    'بهترین ماسک طبیعی برای پوست خشک',
    'چگونه لک‌های پوستی را از بین ببرم؟'
];

const TYPING_SPEED = 70;
const DELETING_SPEED = 30;
const PAUSE_DURATION = 1000;

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    const [inputValue, setInputValue] = useState('');
    const [displayedValue, setDisplayedValue] = useState('');
    const [currentQueryIndex, setCurrentQueryIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        if (inputValue) {
            setDisplayedValue('');
            setCharIndex(0);
            setIsTyping(true);
            return;
        }

        const currentQuery = typingAnimationQueries[currentQueryIndex];

        if (isTyping) {
            if (charIndex < currentQuery.length) {
                const timeout = setTimeout(() => {
                    setDisplayedValue(currentQuery.substring(0, charIndex + 1));
                    setCharIndex(charIndex + 1);
                }, TYPING_SPEED);
                return () => clearTimeout(timeout);
            } else {
                setTimeout(() => setIsTyping(false), PAUSE_DURATION);
            }
        } else {
            if (charIndex > 0) {
                const timeout = setTimeout(() => {
                    setDisplayedValue(currentQuery.substring(0, charIndex - 1));
                    setCharIndex(charIndex - 1);
                }, DELETING_SPEED);
                return () => clearTimeout(timeout);
            } else {
                setIsTyping(true);
                setCurrentQueryIndex((prevIndex) => (prevIndex + 1) % typingAnimationQueries.length);
            }
        }
    }, [charIndex, isTyping, currentQueryIndex, inputValue]);

    return (
        <div className="min-h-screen font-vazir" dir="rtl" style={{ background: 'var(--warm-beige)' }}>
            {/* Navigation Bar */}
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-hero)' }}>
                        <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold" style={{ color: 'var(--sage-green)' }}>شایلی</h2>
                </div>
                <Button 
                    variant="ghost" 
                    className="font-medium transition-all duration-300 hover:scale-105" 
                    style={{ color: 'var(--sage-green)' }}
                    onClick={() => window.location.href = '/login'}
                >
                    ورود
                </Button>
            </nav>

            {/* Hero Section - New Color Theme */}
            <div id="home" className="relative min-h-screen flex items-center justify-center px-6 py-12 overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--warm-beige) 0%, var(--cream-light) 50%, var(--peach-beige) 100%)' }}>
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ background: 'var(--sage-green)' }}></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ background: 'var(--dusty-rose)', animationDelay: '1s' }}></div>
                    <div className="absolute top-40 left-40 w-60 h-60 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float" style={{ background: 'var(--peach-beige)', animationDelay: '2s' }}></div>
                </div>

                {/* Floating icons */}
                <div className="absolute top-20 left-20 animate-float">
                    <div className="w-12 h-12 glass backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-soft">
                        <Heart className="h-6 w-6" style={{ color: 'var(--dusty-rose)' }} />
                    </div>
                </div>
                <div className="absolute top-32 right-32 animate-float" style={{ animationDelay: '1s' }}>
                    <div className="w-10 h-10 glass backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-soft">
                        <Droplets className="h-5 w-5" style={{ color: 'var(--sage-green)' }} />
                    </div>
                </div>
                <div className="absolute bottom-32 left-32 animate-float" style={{ animationDelay: '2s' }}>
                    <div className="w-8 h-8 glass backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-soft">
                        <Sun className="h-4 w-4" style={{ color: 'var(--peach-beige)' }} />
                    </div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto text-center">
                    {/* Main Headline */}
                    <div className="animate-slide-in-up">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            <span style={{ color: 'var(--sage-green)' }}>شایلی:</span>
                            <br />
                            <span className="gradient-text">راهنمای هوشمند زیبایی</span>
                            <br />
                            <span style={{ color: 'var(--dusty-rose)' }} className="text-3xl md:text-4xl font-medium">
                                برای پوست و موی سالم
                            </span>
                        </h1>
                    </div>

                    {/* Advanced AI Chat Input */}
                    <div className="animate-slide-in-up relative max-w-4xl mx-auto mb-12" style={{ animationDelay: '0.4s' }}>
                        <div className="relative group">
                            {/* Glowing background effect */}
                            <div className="absolute inset-0 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 animate-pulse" style={{ background: 'linear-gradient(90deg, var(--sage-green)/20, var(--dusty-rose)/20, var(--peach-beige)/20)' }}></div>
                            
                            {/* Main input container */}
                            <div className="relative glass backdrop-blur-xl border border-white/20 rounded-3xl p-2 shadow-2xl transition-all duration-500 group-hover:scale-105" style={{ boxShadow: '0 25px 50px -12px var(--sage-green)/25' }}>
                                <div className="flex items-center gap-4 p-4">
                                    {/* Main input field */}
                                    <div className="flex-1 relative">
                                        <textarea
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder={inputValue ? "" : displayedValue}
                                            className="w-full bg-transparent text-lg font-medium placeholder:text-muted-foreground/70 focus:outline-none resize-none py-3 text-right"
                                            rows={1}
                                            style={{ 
                                                minHeight: '24px',
                                                maxHeight: '120px',
                                                transition: 'height 0.2s ease-out',
                                                direction: 'rtl'
                                            }}
                                        />
                                        
                                        {/* Character counter */}
                                        {inputValue && (
                                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
                                                {inputValue.length}/2000
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Send button */}
                                    <Button 
                                        onClick={onGetStarted}
                                        size="lg" 
                                        className="text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                                        style={{ background: 'var(--gradient-hero)' }}
                                    >
                                        <span className="ml-2">شروع گفتگو</span>
                                        <Send className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </div>
                            </div>
                            
                            {/* Floating tech elements */}
                            <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full animate-bounce opacity-80" style={{ background: 'var(--gradient-hero)' }}></div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full animate-bounce opacity-80" style={{ background: 'linear-gradient(45deg, var(--sage-green), var(--dusty-rose))', animationDelay: '0.5s' }}></div>
                            <div className="absolute -bottom-3 left-1/4 w-4 h-4 rounded-full animate-bounce opacity-80" style={{ background: 'linear-gradient(45deg, var(--peach-beige), var(--sage-green))', animationDelay: '1s' }}></div>
                            
                            {/* Neural network lines */}
                            <div className="absolute inset-0 pointer-events-none">
                                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="rgba(153, 176, 148, 0.3)" />
                                            <stop offset="50%" stopColor="rgba(190, 147, 130, 0.3)" />
                                            <stop offset="100%" stopColor="rgba(240, 208, 190, 0.3)" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M10,50 Q25,20 50,50 T90,50" stroke="url(#neuralGradient)" strokeWidth="0.5" fill="none" opacity="0.6">
                                        <animate attributeName="d" dur="3s" repeatCount="indefinite" values="M10,50 Q25,20 50,50 T90,50;M10,50 Q25,80 50,50 T90,50;M10,50 Q25,20 50,50 T90,50"/>
                                    </path>
                                    <path d="M10,30 Q25,60 50,30 T90,30" stroke="url(#neuralGradient)" strokeWidth="0.5" fill="none" opacity="0.4">
                                        <animate attributeName="d" dur="4s" repeatCount="indefinite" values="M10,30 Q25,60 50,30 T90,30;M10,30 Q25,0 50,30 T90,30;M10,30 Q25,60 50,30 T90,30"/>
                                    </path>
                                </svg>
                            </div>
                        </div>
                        
                        {/* Tech features */}
                        <div className="flex justify-center items-center gap-6 mt-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--sage-green)' }}></div>
                                <span>هوش مصنوعی پیشرفته</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--dusty-rose)' }}></div>
                                <span>مشاوره تخصصی</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--peach-beige)' }}></div>
                                <span>پشتیبانی ۲۴/۷</span>
                            </div>
                        </div>
                    </div>

                    {/* Suggested Queries */}
                    <div className="animate-slide-in-up flex flex-wrap justify-center gap-4 mb-16" style={{ animationDelay: '0.6s' }}>
                        {suggestedQueries.map((query, index) => (
                            <Button
                                key={index}
                                variant="outline"
                                onClick={() => setInputValue(query)}
                                className="btn-secondary text-sm hover:shadow-glow transition-all duration-300"
                                style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                            >
                                {query}
                            </Button>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="animate-slide-in-up grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto" style={{ animationDelay: '0.8s' }}>
                        <div className="glass rounded-2xl p-6 card-hover">
                            <div className="text-3xl font-bold gradient-text mb-2">۱۰۰۰+</div>
                            <div className="text-muted-foreground">محصول زیبایی</div>
                        </div>
                        <div className="glass rounded-2xl p-6 card-hover">
                            <div className="text-3xl font-bold gradient-text mb-2">۵۰۰+</div>
                            <div className="text-muted-foreground">روتین شخصی</div>
                        </div>
                        <div className="glass rounded-2xl p-6 card-hover">
                            <div className="text-3xl font-bold gradient-text mb-2">۹۹٪</div>
                            <div className="text-muted-foreground">رضایت کاربران</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-6">
                {/* How it Works Section with Dadnoos styling */}
                <section className="py-24">
                    <div className="text-center mb-16 animate-slide-in-up">
                        <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--sage-green)' }}>چطور کار می‌کند؟</h2>
                        <p className="mt-4 text-lg text-muted-foreground">در سه مرحله ساده، مسیر زیبایی خود را آغاز کنید.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="space-y-4 animate-slide-in-up card-hover" style={{ animationDelay: '0.1s' }}>
                            <div className="mx-auto h-16 w-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-glow" style={{ background: 'var(--gradient-hero)' }}>۱</div>
                            <h3 className="text-2xl font-semibold" style={{ color: 'var(--sage-green)' }}>پروفایل خود را بسازید</h3>
                            <p className="text-muted-foreground">به چند سوال ساده درباره نوع پوست، مو و نگرانی‌های خود پاسخ دهید.</p>
                        </div>
                        <div className="space-y-4 animate-slide-in-up card-hover" style={{ animationDelay: '0.2s' }}>
                            <div className="mx-auto h-16 w-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-glow" style={{ background: 'var(--gradient-hero)' }}>۲</div>
                            <h3 className="text-2xl font-semibold" style={{ color: 'var(--sage-green)' }}>روتین شخصی خود را دریافت کنید</h3>
                            <p className="text-muted-foreground">هوش مصنوعی شایلی یک برنامه مراقبتی روزانه مخصوص شما طراحی می‌کند.</p>
                        </div>
                        <div className="space-y-4 animate-slide-in-up card-hover" style={{ animationDelay: '0.3s' }}>
                            <div className="mx-auto h-16 w-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-glow" style={{ background: 'var(--gradient-hero)' }}>۳</div>
                            <h3 className="text-2xl font-semibold" style={{ color: 'var(--sage-green)' }}>پیشرفت خود را دنبال کنید</h3>
                            <p className="text-muted-foreground">با انجام روتین‌ها و دریافت بازخورد، شاهد تغییرات مثبت باشید.</p>
                        </div>
                    </div>
                </section>

                {/* Features Section - Complete Dadnoos Style */}
                <div id="features" className="relative py-24 overflow-hidden">
                    {/* Background decorative elements */}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(153, 176, 148, 0.05) 0%, rgba(255, 255, 255, 1) 50%, rgba(190, 147, 130, 0.05) 100%)' }}></div>
                    <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(153, 176, 148, 0.2), transparent)' }}></div>
                    <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(190, 147, 130, 0.2), transparent)' }}></div>
                    
                    {/* Floating elements */}
                    <div className="absolute top-20 left-10 w-20 h-20 rounded-full opacity-20 animate-float" style={{ background: 'rgba(153, 176, 148, 0.2)' }}></div>
                    <div className="absolute bottom-20 right-10 w-16 h-16 rounded-full opacity-20 animate-float" style={{ background: 'rgba(190, 147, 130, 0.2)', animationDelay: '1s' }}></div>

                    <div className="relative z-10 max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <div className="animate-slide-in-up">
                                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                    <span className="gradient-text">چگونه کار می‌کند؟</span>
                                </h2>
                                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                    فرآیند ساده و هوشمند دریافت مشاوره زیبایی
                                </p>
                            </div>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="group animate-slide-in-up" style={{ animationDelay: '0s' }}>
                                <div className="relative">
                                    <div className="glass rounded-3xl p-8 h-full card-hover border border-white/20">
                                        <div className="relative mb-6">
                                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300 transform group-hover:scale-110" style={{ background: 'var(--gradient-hero)' }}>
                                                <Heart className="h-8 w-8 text-white" />
                                            </div>
                                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-soft">
                                                <span className="text-sm font-bold gradient-text">۱</span>
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-xl font-bold text-foreground mb-4 group-hover:gradient-text transition-all duration-300">
                                            سوال خود را مطرح کنید
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed mb-6">
                                            هر سوال مربوط به پوست و مو که داشته باشید را به زبان ساده بپرسید
                                        </p>
                                        
                                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-2" style={{ color: 'var(--sage-green)' }}>
                                            <span className="text-sm font-medium">شروع کنید</span>
                                        </div>
                                    </div>
                                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 transform -translate-y-1/2" style={{ background: 'linear-gradient(90deg, rgba(153, 176, 148, 0.2), transparent)' }}></div>
                                </div>
                            </div>

                            <div className="group animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                                <div className="relative">
                                    <div className="glass rounded-3xl p-8 h-full card-hover border border-white/20">
                                        <div className="relative mb-6">
                                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300 transform group-hover:scale-110" style={{ background: 'linear-gradient(135deg, var(--sage-green), var(--dusty-rose))' }}>
                                                <Sparkles className="h-8 w-8 text-white" />
                                            </div>
                                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-soft">
                                                <span className="text-sm font-bold gradient-text">۲</span>
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-xl font-bold text-foreground mb-4 group-hover:gradient-text transition-all duration-300">
                                            شایلی اطلاعات را تحلیل می‌کند
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed mb-6">
                                            سیستم هوش مصنوعی ما اطلاعات شما را بررسی و بهترین راه‌حل‌ها را پیدا می‌کند
                                        </p>
                                        
                                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-2" style={{ color: 'var(--sage-green)' }}>
                                            <span className="text-sm font-medium">شروع کنید</span>
                                        </div>
                                    </div>
                                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 transform -translate-y-1/2" style={{ background: 'linear-gradient(90deg, rgba(153, 176, 148, 0.2), transparent)' }}></div>
                                </div>
                            </div>

                            <div className="group animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
                                <div className="relative">
                                    <div className="glass rounded-3xl p-8 h-full card-hover border border-white/20">
                                        <div className="relative mb-6">
                                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300 transform group-hover:scale-110" style={{ background: 'linear-gradient(135deg, var(--dusty-rose), var(--sage-green))' }}>
                                                <Star className="h-8 w-8 text-white" />
                                            </div>
                                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-soft">
                                                <span className="text-sm font-bold gradient-text">۳</span>
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-xl font-bold text-foreground mb-4 group-hover:gradient-text transition-all duration-300">
                                            پاسخ دقیق و کامل دریافت کنید
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed mb-6">
                                            مشاوره تخصصی همراه با پیشنهاد محصولات و روتین‌های مناسب
                                        </p>
                                        
                                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-2" style={{ color: 'var(--sage-green)' }}>
                                            <span className="text-sm font-medium">شروع کنید</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom CTA */}
                        <div className="text-center mt-16 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
                            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-soft border border-white/20">
                                <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: 'var(--sage-green)' }}></div>
                                <span className="text-muted-foreground font-medium">آماده شروع هستید؟</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Testimonials Section - Dadnoos Style */}
                <section className="relative py-24 overflow-hidden">
                    {/* Background elements */}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, var(--warm-beige) 0%, rgba(255, 255, 255, 1) 50%, var(--cream-light) 100%)' }}></div>
                    <div className="absolute top-10 left-10 w-32 h-32 rounded-full animate-float opacity-60" style={{ background: 'rgba(153, 176, 148, 0.1)' }}></div>
                    <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full animate-float opacity-60" style={{ background: 'rgba(190, 147, 130, 0.1)', animationDelay: '1s' }}></div>

                    <div className="relative z-10 max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16 animate-slide-in-up">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                <span style={{ color: 'var(--sage-green)' }}>تجربه کاربران ما</span>
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                داستان‌های موفقیت کاربرانی که با شایلی زیبایی خود را کشف کردند
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
                                <div className="glass rounded-3xl p-8 card-hover border border-white/20 h-full">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="relative h-16 w-16 rounded-full overflow-hidden shadow-soft">
                                            <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(153, 176, 148, 0.2), rgba(190, 147, 130, 0.2))' }}>
                                                <Users className="h-8 w-8" style={{ color: 'var(--sage-green)' }} />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground">سارا محمدی</p>
                                            <p className="text-sm text-muted-foreground">کاربر از تهران</p>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed mb-6">
                                        "شایلی زندگی من رو تغییر داد! پوستم هیچوقت اینقدر شفاف و سالم نبوده. روتینی که پیشنهاد داد دقیقاً همون چیزی بود که نیاز داشتم."
                                    </p>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4" style={{ fill: 'var(--sage-green)', color: 'var(--sage-green)' }} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                                <div className="glass rounded-3xl p-8 card-hover border border-white/20 h-full">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="relative h-16 w-16 rounded-full overflow-hidden shadow-soft">
                                            <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(190, 147, 130, 0.2), rgba(240, 208, 190, 0.2))' }}>
                                                <Users className="h-8 w-8" style={{ color: 'var(--dusty-rose)' }} />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground">علی رضایی</p>
                                            <p className="text-sm text-muted-foreground">کاربر از اصفهان</p>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed mb-6">
                                        "بالاخره تونستم ریزش موهام رو کنترل کنم. روتینی که شایلی پیشنهاد داد فوق‌العاده بود و نتایجش خیلی سریع معلوم شد."
                                    </p>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4" style={{ fill: 'var(--dusty-rose)', color: 'var(--dusty-rose)' }} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
                                <div className="glass rounded-3xl p-8 card-hover border border-white/20 h-full">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="relative h-16 w-16 rounded-full overflow-hidden shadow-soft">
                                            <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(240, 208, 190, 0.2), rgba(153, 176, 148, 0.2))' }}>
                                                <Users className="h-8 w-8" style={{ color: 'var(--peach-beige)' }} />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground">مریم احمدی</p>
                                            <p className="text-sm text-muted-foreground">کاربر از شیراز</p>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed mb-6">
                                        "بهترین بخش شایلی، مشاور هوش مصنوعیشه. هر سوالی داشتم سریع جواب گرفتم و همیشه راه‌حل‌های عملی پیشنهاد می‌ده."
                                    </p>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4" style={{ fill: 'var(--peach-beige)', color: 'var(--peach-beige)' }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                            <div className="text-center">
                                <div className="text-4xl font-bold mb-2" style={{ color: 'var(--sage-green)' }}>۱۰,۰۰۰+</div>
                                <div className="text-muted-foreground">کاربر فعال</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold mb-2" style={{ color: 'var(--dusty-rose)' }}>۴.۹/۵</div>
                                <div className="text-muted-foreground">امتیاز کاربران</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold mb-2" style={{ color: 'var(--sage-green)' }}>۹۹٪</div>
                                <div className="text-muted-foreground">رضایت کاربران</div>
                            </div>
                        </div>
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

export default LandingPage;