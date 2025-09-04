'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Flame, Star } from 'lucide-react';

interface GamificationWidgetProps {
    stats: {
        points: number;
        streak: number;
    } | null;
}

export const GamificationWidget: React.FC<GamificationWidgetProps> = ({ stats }) => {
    return (
        <Card className="bg-white/90 rounded-3xl border border-brand-tan/20 shadow-xl backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg font-bold text-brand-primary">
                    <Award className="h-5 w-5" />
                    وضعیت شما
                </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-around text-center">
                <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2">
                        <Star className="h-6 w-6 text-yellow-500" />
                        <span className="text-2xl font-bold">{stats?.points ?? 0}</span>
                    </div>
                    <p className="text-xs text-gray-500">امتیاز</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2">
                        <Flame className="h-6 w-6 text-orange-500" />
                        <span className="text-2xl font-bold">{stats?.streak ?? 0}</span>
                    </div>
                    <p className="text-xs text-gray-500">روز متوالی</p>
                </div>
            </CardContent>
        </Card>
    );
};