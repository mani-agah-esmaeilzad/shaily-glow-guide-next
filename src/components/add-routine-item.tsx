'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import type { Task } from '@/types';

interface AddRoutineItemProps {
  onAdd: (task: Omit<Task, 'id' | 'completed'>) => void;
}

export const AddRoutineItem: React.FC<AddRoutineItemProps> = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'skin' | 'hair'>('skin');
  const [time, setTime] = useState<'morning' | 'evening'>('morning');

  const handleSubmit = () => {
    if (title.trim()) {
      onAdd({ title, type, time });
      setTitle('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full">
          <PlusCircle className="h-5 w-5 ml-2" />
          افزودن تسک جدید
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>افزودن تسک جدید به روتین</DialogTitle>
          {/* اصلاح شد: اضافه کردن توضیحات برای دسترسی‌پذیری */}
          <DialogDescription>یک کار جدید برای روتین صبح یا شب خود تعریف کنید.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">عنوان تسک</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: استفاده از کرم ضدآftab" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>نوع</Label>
              <Select value={type} onValueChange={(value: 'skin' | 'hair') => setType(value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="skin">پوست</SelectItem>
                  <SelectItem value="hair">مو</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>زمان</Label>
              <Select value={time} onValueChange={(value: 'morning' | 'evening') => setTime(value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">صبح</SelectItem>
                  <SelectItem value="evening">شب</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>لغو</Button>
          <Button onClick={handleSubmit}>افزودن</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};