import React from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RoutineReminder } from './routine-reminder';

export const SettingsModal: React.FC = () => {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center">تنظیمات</DialogTitle>
                <DialogDescription className="text-center">
                    تنظیمات حساب کاربری و یادآوری‌ها را اینجا مدیریت کنید.
                </DialogDescription>
            </DialogHeader>
            <div className="py-6">
                <RoutineReminder />
            </div>
        </DialogContent>
    );
};