'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddProductFormProps {
    userId: string;
    onProductAdded: () => void;
}

export const AddProductForm: React.FC<AddProductFormProps> = ({ userId, onProductAdded }) => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [productName, setProductName] = useState('');
    const [productType, setProductType] = useState('');
    const [brand, setBrand] = useState('');
    const { toast } = useToast();

    const handleSubmit = async () => {
        if (!productName || !productType) {
            toast({ title: "لطفا نام و نوع محصول را وارد کنید.", variant: "destructive" });
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`/api/shelf/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // اصلاح شد: تمام فیلدهای مورد نیاز API ارسال می‌شوند
                body: JSON.stringify({
                    productName,
                    productType,
                    brand,
                    openedDate: null, // ارسال مقدار null برای فیلدهای اختیاری
                    notes: ''
                }),
            });

            // اصلاح شد: بررسی می‌کنیم که آیا درخواست واقعا موفقیت‌آمیز بوده است یا نه
            if (!response.ok) {
                throw new Error('خطا در ارتباط با سرور');
            }

            toast({ title: "محصول با موفقیت اضافه شد." });
            onProductAdded(); // فراخوانی برای رفرش لیست محصولات
            setOpen(false);
            // ریست کردن فرم
            setProductName('');
            setProductType('');
            setBrand('');
        } catch (error) {
            toast({ title: "خطا در افزودن محصول", description: "لطفا دوباره تلاش کنید.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="w-full md:w-auto">
                    <PlusCircle className="h-5 w-5 ml-2" />
                    افزودن محصول جدید
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>افزودن محصول به قفسه</DialogTitle>
                    <DialogDescription>اطلاعات محصولی که استفاده می‌کنید را وارد کنید.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="productName">نام محصول</Label>
                        <Input id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="مثال: سرم آبرسان هیالورونیک اسید" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="productType">نوع محصول</Label>
                        <Input id="productType" value={productType} onChange={(e) => setProductType(e.target.value)} placeholder="مثال: سرم، مرطوب‌کننده، شامپو" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="brand">برند (اختیاری)</Label>
                        <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="مثال: اوردینری، سیمپل" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>لغو</Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "افزودن"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};