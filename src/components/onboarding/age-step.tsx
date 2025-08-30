'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface AgeStepProps {
  data: { age?: string };
  updateData: (data: { age: string }) => void;
  onNext: () => void;
}

const ageOptions = [
  { value: '12-18', label: '۱۲ تا ۱۸ سال', icon: '🌸', description: 'نوجوانی و شکوفایی' },
  { value: '19-25', label: '۱۹ تا ۲۵ سال', icon: '✨', description: 'جوانی و انرژی' },
  { value: '26-35', label: '۲۶ تا ۳۵ سال', icon: '🌟', description: 'بلوغ و استقلال' },
  { value: '36-45', label: '۳۶ تا ۴۵ سال', icon: '💫', description: 'تجربه و درایت' },
  { value: '46-55', label: '۴۶ تا ۵۵ سال', icon: '🌺', description: 'بلوغ و خرد' },
  { value: '55+', label: '۵۵+ سال', icon: '👑', description: 'حکمت و زیبایی' }
];

export const AgeStep: React.FC<AgeStepProps> = ({ data, updateData, onNext }) => {
  const [selectedAge, setSelectedAge] = useState(data.age || '');

  const handleAgeSelect = (age: string) => {
    setSelectedAge(age);
    updateData({ age });
  };

  const handleNext = () => {
    if (selectedAge) {
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div 
          className="w-20 h-20 bg-gradient-to-br from-brand-primary to-brand-brown rounded-3xl mx-auto mb-6 flex items-center justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        >
          <User className="w-10 h-10 text-white" />
        </motion.div>
        <motion.h2 
          className="text-4xl font-bold text-brand-primary mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          سن شما چند سال است؟
        </motion.h2>
        <motion.p 
          className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          برای ارائه بهترین روتین مراقبت از پوست، نیاز به دانستن رده سنی شما داریم
        </motion.p>
      </div>

      {/* Age Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {ageOptions.map((option, index) => (
          <motion.div
            key={option.value}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className={`relative cursor-pointer group`}
            onClick={() => handleAgeSelect(option.value)}
          >
            <div className={`
              p-8 rounded-3xl border-2 transition-all duration-300 backdrop-blur-sm
              ${selectedAge === option.value 
                ? 'border-brand-primary bg-gradient-to-br from-brand-primary/20 to-brand-brown/10 shadow-2xl transform scale-105' 
                : 'border-brand-tan/30 bg-white/80 hover:border-brand-primary/50 hover:bg-brand-cream/30 hover:shadow-xl hover:transform hover:scale-105'
              }
            `}>
              {/* Selection indicator */}
              <div className={`
                absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                ${selectedAge === option.value 
                  ? 'bg-brand-primary text-white scale-100' 
                  : 'bg-gray-200 text-gray-400 scale-0 group-hover:scale-100'
                }
              `}>
                <Sparkles className="w-4 h-4" />
              </div>

              {/* Icon */}
              <div className="text-4xl mb-4 text-center">
                {option.icon}
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className={`
                  text-xl font-bold mb-2 transition-colors duration-300
                  ${selectedAge === option.value ? 'text-brand-primary' : 'text-gray-800'}
                `}>
                  {option.label}
                </h3>
                <p className={`
                  text-sm leading-relaxed transition-colors duration-300
                  ${selectedAge === option.value ? 'text-brand-brown' : 'text-gray-600'}
                `}>
                  {option.description}
                </p>
              </div>

              {/* Hover effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-brand-brown/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ pointerEvents: 'none' }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-brand-primary/10 to-brand-brown/10 rounded-3xl p-8 mb-8"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-brand-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-brand-primary mb-3 text-right">چرا سن مهم است؟</h3>
            <ul className="text-gray-600 text-right leading-relaxed space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-brand-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>نیازهای پوستی در سنین مختلف متفاوت است</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-brand-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>محصولات مناسب سن بهترین نتیجه را می‌دهند</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-brand-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>پیشگیری از مشکلات آینده براساس سن انجام می‌شود</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Next Button */}
      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={handleNext}
            disabled={!selectedAge}
            className={`
              px-12 py-4 text-lg font-bold rounded-2xl transition-all duration-300 flex items-center gap-3
              ${selectedAge 
                ? 'bg-gradient-to-r from-brand-primary to-brand-brown text-white hover:shadow-2xl hover:from-brand-primary/90 hover:to-brand-brown/90' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <span>ادامه</span>
            <motion.div
              animate={selectedAge ? { x: [0, -5, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
            </motion.div>
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
