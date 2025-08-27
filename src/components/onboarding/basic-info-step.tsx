import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Calendar, Briefcase, ArrowRight } from 'lucide-react';

interface BasicInfoData {
  name: string;
  age: string;
  job: string;
}

interface BasicInfoStepProps {
  data: BasicInfoData;
  updateData: (data: Partial<BasicInfoData>) => void;
  onNext: () => void;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ data, updateData, onNext }) => {
  const isValid = data.name.trim() && data.age && data.job.trim();

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-br from-brand-cream to-brand-tan rounded-2xl mx-auto flex items-center justify-center">
          <User className="w-10 h-10 text-brand-primary" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">درباره خودتان بگویید</h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          این به ما کمک می‌کند تا سبک زندگی شما را درک کنیم و روتین عالی برای شما بسازیم
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="name" className="text-base font-semibold text-gray-700 text-right">اسمتان چیست؟</Label>
          <div className="relative">
            <User className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="name"
              value={data.name}
              onChange={(e) => updateData({ name: e.target.value })}
              placeholder="نام خود را وارد کنید"
              className="pr-12 h-14 text-lg rounded-xl border-2 border-brand-tan/30 focus:border-brand-primary focus:ring-0 transition-all duration-300 text-right"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="age" className="text-base font-semibold text-gray-700 text-right">رده سنی شما چیست؟</Label>
          <div className="relative">
            <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
            <Select value={data.age} onValueChange={(value) => updateData({ age: value })}>
              <SelectTrigger className="pr-12 h-14 text-lg rounded-xl border-2 border-brand-tan/30 focus:border-brand-primary text-right">
                <SelectValue placeholder="رده سنی خود را انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-18">زیر ۱۸ سال</SelectItem>
                <SelectItem value="18-25">۱۸ تا ۲۵ سال</SelectItem>
                <SelectItem value="26-35">۲۶ تا ۳۵ سال</SelectItem>
                <SelectItem value="36-45">۳۶ تا ۴۵ سال</SelectItem>
                <SelectItem value="46-55">۴۶ تا ۵۵ سال</SelectItem>
                <SelectItem value="over-55">بالای ۵۵ سال</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="job" className="text-base font-semibold text-gray-700 text-right">شغلتان چیست؟</Label>
          <div className="relative">
            <Briefcase className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="job"
              value={data.job}
              onChange={(e) => updateData({ job: e.target.value })}
              placeholder="مثل: دانشجو، مهندس، معلم و ..."
              className="pr-12 h-14 text-lg rounded-xl border-2 border-brand-tan/30 focus:border-brand-primary focus:ring-0 transition-all duration-300 text-right"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2 text-right">
            این به ما کمک می‌کند تا محیط کاری شما را در نظر بگیریم
          </p>
        </div>
      </div>

      <div className="pt-6">
        <Button
          onClick={onNext}
          disabled={!isValid}
          className={`w-full h-14 text-lg font-bold rounded-xl transition-all duration-300 transform ${
            isValid 
              ? 'bg-gradient-to-r from-brand-primary to-brand-brown hover:from-brand-primary/90 hover:to-brand-brown/90 hover:scale-[1.02] shadow-xl hover:shadow-2xl text-white'
              : 'bg-gray-300 cursor-not-allowed text-gray-500'
          }`}
        >
          {isValid ? (
            <div className="flex items-center gap-3">
              <ArrowRight className="w-5 h-5 rotate-180" />
              <span>ادامع</span>
            </div>
          ) : (
            'لطفاً همه فیلدها را پر کنید'
          )}
        </Button>
      </div>
    </div>
  );
};