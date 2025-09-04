'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AvatarDisplayProps {
  gender?: string;
  name?: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AvatarDisplay = ({ gender, name, avatarUrl, size = 'md', className }: AvatarDisplayProps) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-24 w-24 text-4xl',
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {/* اگر avatarUrl وجود داشت، آن را به عنوان تصویر اصلی نمایش بده */}
      <AvatarImage src={avatarUrl} alt={name || 'User Avatar'} />
      {/* در غیر این صورت، حرف اول نام را نمایش بده */}
      <AvatarFallback className="bg-brand-primary/20 text-brand-primary font-bold">
        {name ? name.charAt(0).toUpperCase() : (gender === 'male' ? 'آ' : 'خ')}
      </AvatarFallback>
    </Avatar>
  );
};
