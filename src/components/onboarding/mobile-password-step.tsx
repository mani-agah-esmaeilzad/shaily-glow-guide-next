'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Phone, Lock, Eye, EyeOff, ArrowLeft, Loader2, Shield, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';

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

const PasswordRequirement: React.FC<{ text: string; met: boolean }> = ({ text, met }) => (
    <div className="flex items-center gap-2 justify-end">
        <span className={`text-xs font-medium ${ met ? 'text-brand-primary' : 'text-gray-400'}`}>{text}</span>
        <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${ met ? 'bg-brand-primary' : 'bg-gray-300'}`}>
            {met && <Check className="w-2.5 h-2.5 text-white" />}
        </div>
    </div>
);

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
    mode: 'onTouched'
  });

  const passwordValue = form.watch('password') || '';
  const requirements = [
      { text: 'حداقل ۸ کاراکتر', met: passwordValue.length >= 8 },
      { text: 'حرف بزرگ (A-Z)', met: /[A-Z]/.test(passwordValue) },
      { text: 'حرف کوچک (a-z)', met: /[a-z]/.test(passwordValue) },
      { text: 'عدد (0-9)', met: /\d/.test(passwordValue) }
  ];

  const onSubmit = (values: z.infer<typeof mobilePasswordSchema>) => {
    const { mobile, password } = values;
    onNext({ mobile, password });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="text-center mb-6">
        <motion.div 
          className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-brown rounded-3xl mx-auto mb-4 flex items-center justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        >
          <Shield className="w-8 h-8 text-white" />
        </motion.div>
        <motion.h2 
          className="text-2xl font-bold text-brand-primary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          ایجاد قفل امن شما
        </motion.h2>
        <motion.p 
          className="text-sm text-gray-500 leading-relaxed mt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          فقط یک قدم تا باز شدن دنیای شایلی فاصله دارید!
        </motion.p>
      </div>
      
      {/* Form Area with Scroll */}
      <ScrollArea className="flex-1 -mx-4 px-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-sm font-semibold">شماره موبایل</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute right-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input 
                        placeholder="09123456789" 
                        {...field} 
                        className="pr-10 h-12 rounded-xl text-base"
                        maxLength={11}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-right text-xs" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-sm font-semibold">رمز عبور</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute right-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••" 
                        {...field} 
                        className="pr-10 pl-10 h-12 rounded-xl text-base"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-right text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-sm font-semibold">تکرار رمز عبور</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute right-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input 
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••" 
                        {...field} 
                        className="pr-10 pl-10 h-12 rounded-xl text-base"
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-right text-xs" />
                </FormItem>
              )}
            />

            <div className="bg-brand-cream/60 rounded-xl p-3">
              <div className="grid grid-cols-2 gap-2">
                {requirements.map((req) => (
                  <PasswordRequirement key={req.text} text={req.text} met={req.met} />
                ))}
              </div>
            </div>
          </form>
        </Form>
      </ScrollArea>
      
      {/* Action Buttons (Sticky at bottom) */}
      <div className="flex gap-3 pt-4 mt-auto">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrev} 
          className="flex-1 h-12 text-base font-semibold rounded-xl"
          disabled={isLoading}
        >
          مرحله قبل
        </Button>
        <Button 
          type="submit" 
          onClick={form.handleSubmit(onSubmit)}
          className="flex-1 h-12 text-base font-bold rounded-xl bg-gradient-to-r from-brand-primary to-brand-brown text-white" 
          disabled={isLoading}
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Loader2 className="h-6 w-6 animate-spin" />
              </motion.div>
            ) : (
              <motion.div key="submit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <span>تکمیل و ساخت حساب</span>
                <ArrowLeft className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </div>
    </div>
  );
};