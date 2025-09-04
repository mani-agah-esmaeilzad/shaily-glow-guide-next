'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Trash2, PlusCircle, Package, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
// کامپوننت فرم افزودن محصول را در مرحله بعد خواهیم ساخت
// import { AddProductForm } from '@/components/add-product-form'; 

interface Product {
    id: number;
    productName: string;
    productType: string;
    brand?: string;
    openedDate?: string;
}

const ShelfPage = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProducts = async () => {
        if (!user) return;
        try {
            const res = await fetch(`/api/shelf/${user.id}`);
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [user]);

    const handleDelete = async (productId: number) => {
        try {
            await fetch(`/api/shelf/${user!.id}/${productId}`, { method: 'DELETE' });
            setProducts(products.filter(p => p.id !== productId));
        } catch (error) {
            console.error("Failed to delete product:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-cream">
                <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-cream to-brand-beige p-8" dir="rtl">
            <div className="max-w-4xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-brand-primary">قفسه مجازی من</h1>
                        <p className="text-gray-500 mt-2">محصولات مراقبتی خود را اینجا مدیریت کنید.</p>
                    </div>
                    <Link href="/">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 ml-2" />
                            بازگشت به داشبورد
                        </Button>
                    </Link>
                </header>

                <div className="mb-6">
                    {/* <AddProductForm userId={user!.id} onProductAdded={fetchProducts} /> */}
                    <p className="text-center text-gray-500 text-sm">
                        (فرم افزودن محصول در مرحله بعد اضافه خواهد شد)
                    </p>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed rounded-xl">
                        <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700">قفسه شما خالی است!</h3>
                        <p className="text-gray-500 mt-2">اولین محصول خود را اضافه کنید تا شایلی بهتر شما را راهنمایی کند.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(product => (
                            <Card key={product.id} className="group relative">
                                <CardHeader>
                                    <CardTitle className="truncate">{product.productName}</CardTitle>
                                    <CardDescription>{product.brand || 'متفرقه'}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm font-semibold bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full inline-block">{product.productType}</p>
                                    {product.openedDate && <p className="text-xs text-gray-400 mt-2">تاریخ باز شدن: {new Date(product.openedDate).toLocaleDateString('fa-IR')}</p>}
                                </CardContent>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-4 left-4 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleDelete(product.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShelfPage;