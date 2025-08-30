import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSectionFanoosInspired: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-background py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">

          <div className="md:col-span-3 flex justify-center">
            <div className="relative w-full h-64 md:h-[450px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1556760544-4421763def42?q=80&w=1974&auto=format&fit=crop"
                alt="Skincare model"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>

          {/* ستون محتوای متنی وسط */}
          <div className="md:col-span-6 text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              شایلی، راهنمای درخشش تو
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
              با کمک هوش مصنوعی، روتین مراقبتی ایده‌آل برای پوست و موی خودت رو کشف کن و زیبایی طبیعی خودت رو به نمایش بذار.
            </p>
            <div className="flex flex-col items-center gap-3 max-w-sm mx-auto">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="w-full py-6 text-lg font-semibold transition-transform transform hover:scale-105 shadow-lg flex items-center justify-between"
              >
                <span>شروع و ساخت پروفایل</span>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="w-full py-6 text-lg font-semibold">
                روتین مراقبتی من چیه؟
              </Button>
              <Button variant="outline" size="lg" className="w-full py-6 text-lg font-semibold">
                مشاوره با هوش مصنوعی
              </Button>
              <Button variant="outline" size="lg" className="w-full py-6 text-lg font-semibold">
                درباره ما
              </Button>
            </div>
            <p className="text-xs text-muted-foreground pt-4">
              حساب کاربری دارید؟ <a href="/login" className="text-primary hover:underline">وارد شوید</a>
            </p>
          </div>

          {/* ستون تصویر سمت چپ */}
          <div className="md:col-span-3 hidden md:flex justify-center">
            <div className="relative w-full h-64 md:h-[450px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1616473432728-018f26a8f33e?q=80&w=1964&auto=format&fit=crop"
                alt="Haircare model"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};