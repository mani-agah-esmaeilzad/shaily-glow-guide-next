'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Phone, Lock, Eye, EyeOff, ArrowRight, Loader2, Shield, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mobilePasswordSchema = z.object({
  mobile: z.string()
    .regex(/^09[0-9]{9}$/, { message: 'لطفاً شماره موبایل معتبر وارد کنید (مثال: 09123456789)' }),
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

interface MobilePasswordStepProps {
  onNext: (data: { mobile: string; password: string }) => void;
  onPrev: () => void;
  isLoading?: boolean;
}

export const MobilePasswordStep: React.FC<MobilePasswordStepProps> = ({ 
  onNext, 
  onPrev, 
  isLoading = false 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof mobilePasswordSchema>>({
    resolver: zodResolver(mobilePasswordSchema),
    defaultValues: { mobile: '', password: '', confirmPassword: '' },
  });

  const onSubmit = (values: z.infer<typeof mobilePasswordSchema>) => {
    const { mobile, password } = values;
    onNext({ mobile, password });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div 
          className="w-20 h-20 bg-gradient-to-br from-brand-primary to-brand-brown rounded-3xl mx-auto mb-6 flex items-center justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        >
          <Shield className="w-10 h-10 text-white" />
        </motion.div>
        <motion.h2 
          className="text-4xl font-bold text-brand-primary mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          حساب کاربری خود را ایجاد کنید
        </motion.h2>
        <motion.p 
          className="text-xl text-gray-600 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          برای امنیت و دسترسی به روتین شخصی خود، شماره موبایل و رمز عبور تعیین کنید
        </motion.p>
      </div>

      {/* Main Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/90 rounded-3xl border border-brand-tan/20 shadow-2xl backdrop-blur-sm p-10"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Mobile Number Field */}
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-bold text-lg text-right">شماره موبایل</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute right-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-brand-primary" />
                      <Input 
                        placeholder="شماره موبایل خود را وارد کنید (09xxxxxxxxx)" 
                        {...field} 
                        className="pr-16 h-16 rounded-2xl border-2 border-brand-tan/30 focus:border-brand-primary focus:ring-0 transition-all duration-300 text-xl text-right bg-white/70"
                        maxLength={11}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-right text-sm" />
                  <p className="text-sm text-gray-500 text-right mt-2">
                    این شماره برای ورود و بازیابی حساب شما استفاده خواهد شد
                  </p>
                </FormItem>
              )}
            />
            
            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-bold text-lg text-right">رمز عبور</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute right-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-brand-primary" />
                      <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="یک رمز عبور قوی ایجاد کنید" 
                        {...field} 
                        className="pr-16 pl-16 h-16 rounded-2xl border-2 border-brand-tan/30 focus:border-brand-primary focus:ring-0 transition-all duration-300 text-xl text-right bg-white/70"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-brand-primary transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-right text-sm" />
                </FormItem>
              )}
            />
            
            {/* Confirm Password Field */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-bold text-lg text-right">تکرار رمز عبور</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute right-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-brand-primary" />
                      <Input 
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="رمز عبور خود را تکرار کنید" 
                        {...field} 
                        className="pr-16 pl-16 h-16 rounded-2xl border-2 border-brand-tan/30 focus:border-brand-primary focus:ring-0 transition-all duration-300 text-xl text-right bg-white/70"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-brand-primary transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-right text-sm" />
                </FormItem>
              )}
            />

            {/* Password Requirements */}
            <div className="bg-brand-cream/60 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-brand-primary" />
                <p className="text-lg font-bold text-brand-primary text-right">الزامات رمز عبور:</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { text: 'حداقل ۸ کاراکتر', met: form.watch('password')?.length >= 8 },
                  { text: 'یک حرف بزرگ لاتین', met: /[A-Z]/.test(form.watch('password') || '') },
                  { text: 'یک حرف کوچک لاتین', met: /[a-z]/.test(form.watch('password') || '') },
                  { text: 'یک عدد', met: /\d/.test(form.watch('password') || '') }
                ].map((req, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center gap-3 justify-end"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <span className={`text-sm font-medium ${
                      req.met ? 'text-brand-primary' : 'text-gray-500'
                    }`}>{req.text}</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                      req.met ? 'bg-brand-primary' : 'bg-gray-300'
                    }`}>
                      {req.met && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Security Note */}
            <div className="bg-gradient-to-r from-brand-primary/10 to-brand-brown/10 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-brand-primary mb-2 text-right">امنیت اطلاعات شما</h3>
                  <p className="text-gray-600 text-right leading-relaxed">
                    تمام اطلاعات شما با بالاترین استانداردهای امنیتی رمزنگاری و محفوظ می‌شود. شماره موبایل شما فقط برای احراز هویت و ورود به حساب استفاده می‌شود.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <motion.div 
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onPrev} 
                  className="w-full h-14 text-lg font-semibold rounded-2xl border-2 border-brand-tan/40 text-brand-brown hover:bg-brand-cream/50 hover:border-brand-tan/60 transition-all duration-300"
                  disabled={isLoading}
                >
                  مرحله قبل
                </Button>
              </motion.div>
              <motion.div 
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-bold rounded-2xl bg-gradient-to-r from-brand-primary to-brand-brown hover:from-brand-primary/90 hover:to-brand-brown/90 transition-all duration-300 hover:shadow-2xl text-white relative overflow-hidden" 
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
                        <span>تکمیل ثبت‌نام</span>
                        <motion.div
                          animate={{ x: [0, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <ArrowRight className="w-5 h-5 rotate-180" />
                        </motion.div>
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
            </div>
          </form>
        </Form>
      </motion.div>
    </motion.div>
  );
};
