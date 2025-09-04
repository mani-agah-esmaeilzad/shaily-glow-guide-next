'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bell, Clock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// تابع جدید برای فراخوانی API واقعی
const setReminderApi = async (time: string, type: 'صبح' | 'شب') => {
  const response = await fetch('/api/reminders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ time, type }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.details || 'Failed to set reminder from API');
  }

  return response.json();
};


export const RoutineReminder: React.FC = () => {
  const [morningTime, setMorningTime] = useState('08:00');
  const [eveningTime, setEveningTime] = useState('21:00');
  const [loading, setLoading] = useState<'morning' | 'evening' | null>(null);
  const { toast } = useToast();

  const handleSetReminder = async (type: 'morning' | 'evening') => {
    setLoading(type);
    const time = type === 'morning' ? morningTime : eveningTime;
    const typeText = type === 'morning' ? 'صبح' : 'شب';
    
    try {
      await setReminderApi(time, typeText);
      toast({
        title: "✅ یادآوری تنظیم شد",
        description: `روتین ${typeText} شما هر روز ساعت ${time} یادآوری خواهد شد.`,
      });
    } catch (error: any) {
      toast({
        title: "❌ خطا در تنظیم یادآوری",
        description: error.message || "لطفا دوباره تلاش کنید.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card className="bg-white/90 rounded-3xl border border-brand-tan/20 shadow-xl backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-lg font-bold text-brand-primary">
          <Bell className="h-5 w-5" />
          تنظیم یادآوری روزانه
        </CardTitle>
        <CardDescription className="pt-1">
          زمانی را برای یادآوری روتین صبح و شب خود انتخاب کنید.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Label htmlFor="morning-time" className="w-12">
            صبح
          </Label>
          <div className="relative flex-1">
            <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="morning-time"
              type="time"
              value={morningTime}
              onChange={(e) => setMorningTime(e.target.value)}
              className="pr-10"
            />
          </div>
          <Button size="sm" onClick={() => handleSetReminder('morning')} disabled={loading === 'morning'}>
            {loading === 'morning' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'ذخیره'}
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor="evening-time" className="w-12">
            شب
          </Label>
          <div className="relative flex-1">
            <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="evening-time"
              type="time"
              value={eveningTime}
              onChange={(e) => setEveningTime(e.target.value)}
              className="pr-10"
            />
          </div>
          <Button size="sm" onClick={() => handleSetReminder('evening')} disabled={loading === 'evening'}>
             {loading === 'evening' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'ذخیره'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};