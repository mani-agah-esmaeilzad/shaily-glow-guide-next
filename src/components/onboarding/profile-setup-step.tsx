'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

// لیستی از آواتارهای پیش‌فرض
const avatars = [
    'https://api.dicebear.com/8.x/adventurer/svg?seed=Mimi',
    'https://api.dicebear.com/8.x/adventurer/svg?seed=Midnight',
    'https://api.dicebear.com/8.x/adventurer/svg?seed=Gizmo',
    'https://api.dicebear.com/8.x/adventurer/svg?seed=Abby',
    'https://api.dicebear.com/8.x/adventurer/svg?seed=Leo',
    'https://api.dicebear.com/8.x/adventurer/svg?seed=Cookie',
];

interface ProfileSetupData {
    firstName: string;
    lastName: string;
    avatarUrl: string;
}

interface ProfileSetupStepProps {
    data: ProfileSetupData;
    updateData: (data: Partial<ProfileSetupData>) => void;
    onNext: () => void;
}

export const ProfileSetupStep: React.FC<ProfileSetupStepProps> = ({ data, updateData, onNext }) => {
    const isFormValid = data.firstName.trim() !== '' && data.lastName.trim() !== '' && data.avatarUrl !== '';

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col h-full"
        >
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-brand-primary">تنظیم پروفایل</h2>
                <p className="text-gray-600 mt-2">اولین قدم برای شروع یک تجربه شخصی‌سازی شده!</p>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 text-right">
                        <Label htmlFor="firstName">نام</Label>
                        <Input
                            id="firstName"
                            placeholder="مثال: سارا"
                            value={data.firstName}
                            onChange={(e) => updateData({ firstName: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2 text-right">
                        <Label htmlFor="lastName">نام خانوادگی</Label>
                        <Input
                            id="lastName"
                            placeholder="مثال: احمدی"
                            value={data.lastName}
                            onChange={(e) => updateData({ lastName: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-3 text-right">
                    <Label>آواتار خود را انتخاب کنید</Label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                        {avatars.map(url => (
                            <motion.div
                                key={url}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <img
                                    src={url}
                                    alt="Avatar"
                                    onClick={() => updateData({ avatarUrl: url })}
                                    className={`w-20 h-20 rounded-full cursor-pointer border-4 transition-all duration-300 ${data.avatarUrl === url ? 'border-brand-primary' : 'border-transparent hover:border-brand-primary/40'
                                        }`}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-6">
                <Button onClick={onNext} disabled={!isFormValid} size="lg" className="w-full">
                    مرحله بعد
                    <ArrowLeft className="mr-2 h-5 w-5" />
                </Button>
            </div>
        </motion.div>
    );
};
