'use client';

import React from 'react';
import { Steps } from 'intro.js-react';
import 'intro.js/introjs.css';
import 'intro.js/themes/introjs-modern.css';

interface DashboardTourProps {
    enabled: boolean;
    onExit: () => void;
}

const tourSteps = [
    {
        element: '.ai-chat-area',
        intro: '<strong>قلب تپنده شایلی!</strong><br/>اینجا می‌توانید با دستیار هوشمند خود صحبت کنید، سوال بپرسید و روتین‌های جدید دریافت کنید.',
        position: 'left',
    },
    {
        element: '.user-menu-area',
        intro: '<strong>منوی کاربری شما</strong><br/>از این بخش به پروفایل، تنظیمات، گزارش هفتگی و صفحه اشتراک دسترسی دارید.',
        position: 'bottom-right-aligned',
    },
    {
        element: '.sidebar-menu-area',
        intro: '<strong>مرکز فرماندهی شما</strong><br/>تمام قابلیت‌های شگفت‌انگیز شایلی، از وبلاگ و گرفته تا روتین‌های پرطرفدار، از اینجا قابل دسترس هستند.',
    },
    {
        element: '.gamification-area',
        intro: '<strong>سیستم امتیازدهی</strong><br/>با انجام روتین‌ها و چالش‌ها، امتیاز کسب کنید و رتبه خود را بالا ببرید!',
    },
    {
        element: '.add-task-area',
        intro: '<strong>شخصی‌سازی روتین</strong><br/>در نهایت، از اینجا می‌توانید هر تسک دلخواهی را به روتین صبح یا شب خود اضافه کنید.',
    },
];

export const DashboardTour: React.FC<DashboardTourProps> = ({ enabled, onExit }) => {
    return (
        <Steps
            enabled={enabled}
            steps={tourSteps}
            initialStep={0}
            onExit={onExit}
            options={{
                nextLabel: 'بعدی',
                prevLabel: 'قبلی',
                doneLabel: 'پایان',
                exitOnOverlayClick: false,
                tooltipClass: 'custom-intro-js-tooltip',
            }}
        />
    );
};
