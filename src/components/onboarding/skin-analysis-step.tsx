import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, Zap, Eye, Droplets, ArrowLeft, ArrowRight } from 'lucide-react';

interface SkinAnalysisData {
  gender: string;
  age: string;
  comedones: string;
  redPimples: string;
  fineLines: string;
  foreheadNose: string;
  sideNose: string;
  cheeks: string;
}

interface SkinAnalysisStepProps {
  data: SkinAnalysisData;
  updateData: (data: Partial<SkinAnalysisData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const questions = [
  {
    id: 'gender',
    title: 'جنسیت شما کدام است؟',
    description: 'این اطلاعات برای تنظیم دقیق‌تر توصیه‌های مراقبت از پوست ضروری است',
    icon: User,
    options: [
      { value: 'female', label: 'خانم' },
      { value: 'male', label: 'آقا' }
    ]
  },
  {
    id: 'age',
    title: 'شما در کدام بازه سنی قرار دارید؟',
    description: 'سن تأثیر مستقیمی بر نیازهای پوستی دارد',
    icon: Calendar,
    options: [
      { value: '12-18', label: '۱۲ تا ۱۸ سال' },
      { value: '19-25', label: '۱۹ تا ۲۵ سال' },
      { value: '26-35', label: '۲۶ تا ۳۵ سال' },
      { value: '36-45', label: '۳۶ تا ۴۵ سال' },
      { value: '46-55', label: '۴۶ تا ۵۵ سال' },
      { value: '55+', label: 'بالای ۵۵ سال' }
    ]
  },
  {
    id: 'comedones',
    title: 'چه تعداد کومدون (سرسیاه، سرسفید، جوش‌های ریز) در صورت شما وجود دارد؟',
    description: 'کومدون‌ها نشان‌دهنده وضعیت منافذ و چربی پوست هستند',
    icon: Zap,
    options: [
      { value: 'less-5', label: 'کمتر از ۵ عدد' },
      { value: '5-10', label: 'حدود ۵ تا ۱۰ عدد' },
      { value: 'more-10', label: 'بیشتر از ۱۰ عدد' }
    ]
  },
  {
    id: 'redPimples',
    title: 'چه تعداد جوش قرمز و ملتهب در صورت شما مشاهده می‌کنید؟',
    description: 'جوش‌های قرمز نشان‌دهنده التهاب در پوست هستند',
    icon: Zap,
    options: [
      { value: '0-2', label: '۰ تا ۲ عدد' },
      { value: '3-5', label: '۳ تا ۵ عدد' },
      { value: 'more-5', label: 'بیشتر از ۵ عدد' }
    ]
  },
  {
    id: 'fineLines',
    title: 'خطوط ظریف اطراف چشمان و پیشانی شما چگونه هستند؟',
    description: 'وضعیت خطوط ظریف نشان‌دهنده میزان نیاز به مراقبت‌های ضد پیری است',
    icon: Eye,
    options: [
      { value: 'none', label: 'هیچ خط ظریفی مشاهده نمی‌شود' },
      { value: 'few-visible', label: 'چند خط ظریف و قابل مشاهده' },
      { value: 'deep-prominent', label: 'خطوط عمیق و برجسته' }
    ]
  },
  {
    id: 'foreheadNose',
    title: 'وضعیت پوست پیشانی و پل بینی شما چگونه است؟',
    description: 'ناحیه T شکل معمولاً بیشترین تغییرات چربی را نشان می‌دهد',
    icon: Droplets,
    options: [
      { value: 'oily', label: 'چرب' },
      { value: 'dry', label: 'خشک' },
      { value: 'normal', label: 'طبیعی' }
    ]
  },
  {
    id: 'sideNose',
    title: 'کناره‌های بینی شما چه حالتی دارند؟',
    description: 'این ناحیه اغلب حساس‌ترین قسمت صورت محسوب می‌شود',
    icon: Droplets,
    options: [
      { value: 'oily', label: 'چرب' },
      { value: 'dry', label: 'خشک' },
      { value: 'normal', label: 'طبیعی' }
    ]
  },
  {
    id: 'cheeks',
    title: 'وضعیت پوست گونه‌های شما کدام است؟',
    description: 'گونه‌ها بیشترین سطح صورت را تشکیل می‌دهند و نشان‌دهنده نوع کلی پوست هستند',
    icon: Droplets,
    options: [
      { value: 'oily', label: 'چرب' },
      { value: 'dry', label: 'خشک' },
      { value: 'normal', label: 'طبیعی' }
    ]
  }
];

export const SkinAnalysisStep: React.FC<SkinAnalysisStepProps> = ({ data, updateData, onNext, onPrev }) => {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const question = questions[currentQuestion];
  
  const currentValue = data[question.id as keyof SkinAnalysisData];
  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onNext();
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      onPrev();
    }
  };

  const isValid = currentValue !== '';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-br from-brand-primary/20 to-brand-brown/20 rounded-2xl mx-auto flex items-center justify-center">
          <question.icon className="w-10 h-10 text-brand-primary" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-xs">
              سوال {currentQuestion + 1} از {totalQuestions}
            </Badge>
            <div className="text-sm font-medium text-brand-primary">
              {Math.round(progress)}% تکمیل شده
            </div>
          </div>
          <div className="w-full bg-brand-tan/30 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-brand-primary to-brand-brown h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <Card className="border-2 border-brand-tan/20 shadow-lg">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold text-gray-900 leading-relaxed">
                {question.title}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {question.description}
              </p>
            </div>

            <div className="space-y-4 max-w-2xl mx-auto">
              <RadioGroup
                value={currentValue}
                onValueChange={(value) => updateData({ [question.id]: value })}
                className="space-y-3"
              >
                {question.options.map((option, index) => (
                  <div 
                    key={option.value} 
                    className={`flex items-center space-x-4 space-x-reverse p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                      currentValue === option.value 
                        ? 'border-brand-primary bg-brand-primary/5 shadow-lg' 
                        : 'border-brand-tan/30 hover:border-brand-primary/40'
                    }`}
                  >
                    <RadioGroupItem 
                      value={option.value} 
                      id={`${question.id}-${option.value}`}
                      className="text-brand-primary" 
                    />
                    <Label 
                      htmlFor={`${question.id}-${option.value}`} 
                      className={`flex-1 font-medium cursor-pointer text-lg ${
                        currentValue === option.value ? 'text-brand-primary' : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-4 pt-6">
        <Button
          onClick={handlePrev}
          variant="outline"
          size="lg"
          className="flex-1 h-12 font-semibold border-2 border-brand-tan/30 hover:border-brand-primary/40 transition-all duration-300"
        >
          <ArrowRight className="w-5 h-5 ml-2" />
          {currentQuestion === 0 ? 'مرحله قبل' : 'سوال قبل'}
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!isValid}
          size="lg"
          className={`flex-1 h-12 font-semibold transition-all duration-300 ${
            isValid 
              ? 'bg-gradient-to-r from-brand-primary to-brand-brown hover:from-brand-primary/90 hover:to-brand-brown/90 hover:shadow-lg transform hover:scale-[1.02]' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {currentQuestion === totalQuestions - 1 ? 'تکمیل آنالیز' : 'سوال بعد'}
        </Button>
      </div>

      {/* Help Text */}
      <div className="text-center pt-4">
        <p className="text-sm text-gray-500">
          پاسخ شما کاملاً محرمانه بوده و فقط برای تجزیه و تحلیل بهتر نوع پوست استفاده خواهد شد
        </p>
      </div>
    </div>
  );
};
