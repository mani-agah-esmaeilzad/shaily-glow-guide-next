'use client';

import React, { useState, useEffect } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Award, Flame, Star, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAuth } from '@/context/AuthContext';

interface WeeklyReportModalProps {
    stats: {
        points: number;
        streak: number;
    } | null;
}

export const WeeklyReportModal: React.FC<WeeklyReportModalProps> = ({ stats }) => {
    const { user } = useAuth();
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const fetchChartData = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/weekly-report/${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setChartData(data);
                }
            } catch (error) {
                console.error("Failed to fetch chart data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchChartData();
    }, [user]);

    return (
        <DialogContent className="max-w-lg">
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center">گزارش هفتگی شما</DialogTitle>
                <DialogDescription className="text-center">
                    تحلیل عملکرد شما در ۷ روز گذشته.
                </DialogDescription>
            </DialogHeader>

            <div className="h-64 w-full mt-4">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12 }} />
                            <YAxis allowDecimals={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                            <Tooltip
                                cursor={{ fill: 'rgba(217, 199, 167, 0.2)' }}
                                contentStyle={{
                                    backgroundColor: 'white',
                                    borderRadius: '0.75rem',
                                    borderColor: '#D9C7A7'
                                }}
                                labelStyle={{ color: '#A68250' }}
                            />
                            <Bar dataKey="points" name="امتیاز" fill="#A68250" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            <div className="py-6 flex justify-around text-center border-t mt-4">
                <div className="flex flex-col items-center gap-2">
                    <Star className="h-8 w-8 text-yellow-500" />
                    <span className="text-2xl font-bold">{stats?.points ?? 0}</span>
                    <p className="text-sm text-gray-500">امتیاز کل</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Flame className="h-8 w-8 text-orange-500" />
                    <span className="text-2xl font-bold">{stats?.streak ?? 0}</span>
                    <p className="text-sm text-gray-500">روز متوالی</p>
                </div>
            </div>
        </DialogContent>
    );
};