'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow';
import { Loader2, Mail, Lock, Eye, EyeOff, Check, ArrowRight, Sparkles, Star } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const signupSchema = z.object({
  email: z.string().email({ message: 'لطفاً یک ایمیل معتبر وارد کنید' }),
  password: z.string()
    .min(8, { message: 'رمز عبور باید حداقل ۸ کاراکتر باشد' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { 
      message: 'رمز عبور باید شامل حروف بزرگ، کوچک و عدد باشد' 
    }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "رمز عبور و تکرار آن یکسان نیست",
  path: ["confirmPassword"],
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
  const { login } = useAuth();
  const [step, setStep] = useState<'register' | 'onboarding'>('register');
  const [registrationData, setRegistrationData] = useState<z.infer<typeof signupSchema> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
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
    <div className="min-h-screen bg-gradient-to-br from-brand-cream to-brand-beige flex" style={{ direction: 'rtl' }}>
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-brand-primary to-brand-brown">
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 left-20 w-48 h-48 bg-brand-tan/30 rounded-full"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        
        <div className="relative z-10 flex flex-col justify-center p-16 text-white">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <motion.h1 
              className="text-5xl font-bold mb-6 leading-tight text-right"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              به هزاران عاشق زیبایی بپیوندید
            </motion.h1>
            <motion.p 
              className="text-xl opacity-90 mb-8 text-right"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              روتین‌های مراقبت از پوست و مو اختصاصی خود را کشف کنید
            </motion.p>
          </motion.div>
          
          {/* Feature highlights */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {[
              { text: 'پیشنهادات شخصی با هوش مصنوعی', icon: Sparkles },
              { text: 'روتین‌های زیبایی تنظیم شده به دست متخصصان', icon: Star }, 
              { text: 'ردیابی پیشرفت و نتایج شما', icon: Check },
              { text: 'جامعه‌ای از هم‌فکران', icon: Check }
            ].map((feature, index) => (
              <motion.div 
                key={index} 
                className="flex items-center gap-3 justify-end"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                whileHover={{ x: -10 }}
              >
                <span className="text-white/90 font-medium text-right">{feature.text}</span>
                <motion.div 
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  <feature.icon className="w-4 h-4" />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Logo for mobile */}
          <div className="lg:hidden text-center mb-8">
            <motion.div 
              className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-brown rounded-2xl mx-auto mb-4 flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900">به شایلی خوش آمدید</h1>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border-0 shadow-2xl rounded-3xl bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardHeader className="text-center pb-2 relative">
                <motion.div
                  className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary to-brand-brown"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                />
                <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                  ایجاد حساب کاربری
                </CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  سفر زیبایی شخصی خود را امروز شروع کنید
                </CardDescription>
              </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleRegistrationSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold text-sm text-right">آدرس ایمیل</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input 
                              placeholder="ایمیل خود را وارد کنیح" 
                              {...field} 
                              className="pr-12 h-14 rounded-xl border-2 border-brand-tan/30 focus:border-brand-primary focus:ring-0 transition-all duration-300 text-lg text-right"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-right" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold text-sm text-right">رمز عبور</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input 
                              type={showPassword ? "text" : "password"}
                              placeholder="یک رمز عبور قوی ایجاد کنید" 
                              {...field} 
                              className="pr-12 pl-12 h-14 rounded-xl border-2 border-brand-tan/30 focus:border-brand-primary focus:ring-0 transition-all duration-300 text-lg text-right"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-right" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold text-sm text-right">تکرار رمز عبور</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input 
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="رمز عبور خود را تکرار کنید" 
                              {...field} 
                              className="pr-12 pl-12 h-14 rounded-xl border-2 border-brand-tan/30 focus:border-brand-primary focus:ring-0 transition-all duration-300 text-lg text-right"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-right" />
                      </FormItem>
                    )}
                  />
                  {/* Password Requirements */}
                  <div className="bg-brand-cream/50 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2 text-right">الزامات رمز عبور:</p>
                    <div className="space-y-1">
                      {[
                        { text: 'حداقل ۸ کاراکتر', met: form.watch('password')?.length >= 8 },
                        { text: 'یک حرف بزرگ لاتین', met: /[A-Z]/.test(form.watch('password') || '') },
                        { text: 'یک حرف کوچک لاتین', met: /[a-z]/.test(form.watch('password') || '') },
                        { text: 'یک عدد', met: /\d/.test(form.watch('password') || '') }
                      ].map((req, index) => (
                        <div key={index} className="flex items-center gap-2 justify-end">
                          <span className={`text-xs ${
                            req.met ? 'text-brand-primary' : 'text-gray-500'
                          }`}>{req.text}</span>
                          <div className={`w-3 h-3 rounded-full ${
                            req.met ? 'bg-brand-primary' : 'bg-gray-300'
                          }`}></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                      <p className="text-sm font-medium text-red-600">{error}</p>
                    </div>
                  )}
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      type="submit" 
                      className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-brand-primary to-brand-brown hover:from-brand-primary/90 hover:to-brand-brown/90 transition-all duration-300 hover:shadow-2xl relative overflow-hidden text-white" 
                      disabled={isLoading}
                    >
                      <AnimatePresence mode="wait">
                        {isLoading ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex items-center gap-3"
                          >
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <span>در حال ایجاد حساب...</span>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="submit"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex items-center gap-3"
                          >
                            <motion.div
                              animate={{ x: [0, -5, 0] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <ArrowRight className="w-5 h-5 rotate-180" />
                            </motion.div>
                            <span>شروع سفر زیبایی</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Animated background on hover */}
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </Button>
                  </motion.div>
                </form>
              </Form>
              
              {/* Terms and Privacy */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  با ایجاد حساب کاربری، شما با{' '}
                  <Link href="/terms" className="text-brand-primary hover:text-brand-brown font-semibold">
                    قوانین و مقررات
                  </Link>
                  {' '}و{' '}
                  <Link href="/privacy" className="text-brand-primary hover:text-brand-brown font-semibold">
                    حریم خصوصی
                  </Link>
                  {' '}موافقت می‌کنید
                </p>
              </div>
              
              <div className="text-center mt-8 pt-6 border-t border-brand-tan/30">
                <p className="text-gray-600 mb-4">قبلاً حساب کاربری دارید؟</p>
                <Link 
                  href="/login" 
                  className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold text-brand-primary bg-brand-cream hover:bg-brand-beige transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                >
                  ورود به حساب
                </Link>
              </div>
            </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
