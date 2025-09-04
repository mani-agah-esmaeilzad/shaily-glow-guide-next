'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart, Shield, Zap, ArrowLeft, Star } from 'lucide-react';

interface WelcomePageProps {
  onContinue: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onContinue }) => {
  return (
    // کانتینر اصلی را برای نمایش محتوا در مرکز صفحه تغییر دادیم
    <div className="min-h-screen bg-gradient-to-br from-brand-cream to-brand-beige relative overflow-hidden flex flex-col items-center justify-center p-4" style={{ direction: 'rtl' }}>

      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-20 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-brand-brown/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto max-w-4xl">

        {/* بخش "چرا شایلی؟" نگه داشته شده است */}
        <div className="bg-white/90 rounded-3xl border border-brand-tan/20 shadow-2xl backdrop-blur-sm p-8 md:p-12 mb-12">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-brand-primary mb-4">چرا شایلی؟</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              ما معتقدیم که هر فردی شایسته بهترین مراقبت از خود است. شایلی با ترکیب علم و تکنولوژی، راهنمای قابل اعتمادی برای سلامت پوست و موی شماست.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-brand-primary mb-2">تجربه کاربری ساده</h3>
                  <p className="text-gray-600">رابط کاربری آسان و دوستانه که استفاده از آن لذت‌بخش است</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-brown/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-brand-brown" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-brand-brown mb-2">مراقبت کامل</h3>
                  <p className="text-gray-600">از روتین صبحگاهی تا مراقبت شبانه، همه چیز در یک جا</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-tan/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-brand-tan" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-brand-tan mb-2">نتایج سریع</h3>
                  <p className="text-gray-600">با پیروی از برنامه‌های تخصصی، تغییرات مثبت را خواهید دید</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-gradient-to-r from-brand-primary to-brand-brown rounded-3xl p-8 md:p-12 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">آماده‌ای شروع کنیم؟</h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              فقط چند سوال ساده و روتین مراقبتی اختصاصی‌ات آماده خواهد بود!
            </p>
            <Button
              onClick={onContinue}
              size="lg"
              className="bg-white text-brand-primary hover:bg-white/90 font-bold text-xl px-12 py-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              شروع کنیم
              <ArrowLeft className="mr-3 h-6 w-6" />
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};