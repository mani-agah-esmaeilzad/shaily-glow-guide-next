'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext'; // وارد کردن useAuth

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow';
import { Loader2 } from 'lucide-react';

const signupSchema = z.object({
  email: z.string().email({ message: 'ایمیل معتبر نیست.' }),
  password: z.string().min(6, { message: 'رمز عبور باید حداقل ۶ کاراکتر باشد.' }),
});

interface OnboardingData {
  name: string;
  age: string;
  job: string;
  gender: string;
  skinType: string;
  skinConcerns: string[];
  hairType: string;
  hairConcerns: string[];
  currentSkinRoutine: string;
  currentHairRoutine: string;
}

const SignupPage = () => {
  const router = useRouter();
  const { login } = useAuth(); // دریافت تابع login از context
  const [step, setStep] = useState<'register' | 'onboarding'>('register');
  const [registrationData, setRegistrationData] = useState<z.infer<typeof signupSchema> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleRegistrationSubmit = async (values: z.infer<typeof signupSchema>) => {
    setRegistrationData(values);
    setStep('onboarding');
  };
  
  const handleOnboardingComplete = async (onboardingData: OnboardingData) => {
    if (!registrationData) return;
    
    setIsLoading(true);
    setError(null);

    const finalUserData = { ...registrationData, ...onboardingData };

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalUserData),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'خطایی در ثبت‌نام رخ داد.');
      }

      const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: registrationData.email, password: registrationData.password }),
      });
      const loginResult = await loginResponse.json();
      if (!loginResponse.ok) {
          throw new Error('ثبت‌نام موفق بود اما ورود خودکار با خطا مواجه شد.');
      }

      login(loginResult.user); // به‌روزرسانی فوری وضعیت کاربر
      router.push('/');

    } catch (err: any) {
      setError(err.message);
      setStep('register');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'onboarding') {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>ایجاد حساب کاربری جدید</CardTitle>
          <CardDescription>برای شروع، ایمیل و رمز عبور خود را وارد کنید.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRegistrationSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ایمیل</FormLabel>
                    <FormControl>
                      <Input placeholder="example@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رمز عبور</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'ادامه'}
              </Button>
            </form>
          </Form>
           <p className="mt-4 text-center text-sm text-muted-foreground">
            حساب کاربری دارید؟{' '}
            <a href="/login" className="underline">
              وارد شوید
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
