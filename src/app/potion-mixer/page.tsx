'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ArrowLeft, RefreshCw, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface Ingredient {
    name: string;
    description: string;
    icon: string;
    actual_ingredient: string;
}

const PotionMixerPage = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [selected, setSelected] = useState<Ingredient[]>([]);
    const [result, setResult] = useState<{ title: string; description: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchIngredients = async () => {
        if (!user) return;
        setIsLoading(true);
        setResult(null);
        setSelected([]);
        try {
            const res = await fetch(`/api/potion-mixer/${user.id}`);
            if (res.ok) {
                const data = await res.json();
                setIngredients(data);
            } else {
                setIngredients([]);
                toast({ title: "خطا در دریافت مواد اولیه", description: "مشکلی در ارتباط با هوش مصنوعی پیش آمد.", variant: "destructive" });
            }
        } catch (error) {
            console.error("Failed to fetch ingredients:", error);
            setIngredients([]);
            toast({ title: "خطای شبکه", description: "لطفا اتصال اینترنت خود را بررسی کنید.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchIngredients();
        } else {
            setIsLoading(false);
        }
    }, [user]);

    const handleSelect = (ingredient: Ingredient) => {
        if (result) return; // Don't allow selection after result is shown
        if (selected.length < 2 && !selected.find(item => item.name === ingredient.name)) {
            setSelected([...selected, ingredient]);
        }
    };

    const createPotion = async () => {
        if (selected.length !== 2) return;

        const title = `معجون ${selected[0].actual_ingredient} و ${selected[1].actual_ingredient}`;
        const description = `این ترکیب قدرتمند به پوستت کمک می‌کند تا همزمان از خواص "${selected[0].description}" و "${selected[1].description}" بهره‌مند شود.`;
        setResult({ title, description });

        // Add points for gamification
        if (user) {
            try {
                await fetch(`/api/gamification/${user.id}`, { method: 'POST' });
                toast({ title: "✨ +۱۰ امتیاز برای ساخت معجون روزانه!" });
            } catch (error) {
                console.error("Failed to update gamification points", error);
            }
        }
    };

    useEffect(() => {
        if (selected.length === 2) {
            const timer = setTimeout(() => {
                createPotion();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [selected]);

    if (!user && !isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-brand-cream">
                <p className="mb-4">برای مشاهده این صفحه باید وارد شوید.</p>
                <Link href="/login"><Button>صفحه ورود</Button></Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-cream to-brand-beige p-4 md:p-8" dir="rtl">
            <div className="max-w-3xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-brand-primary">آزمایشگاه شایلی</h1>
                        <p className="text-gray-500 mt-2">معجون جادویی امروزت رو بساز!</p>
                    </div>
                    <Link href="/">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 ml-2" />
                            بازگشت
                        </Button>
                    </Link>
                </header>

                {/* Cauldron Area */}
                <motion.div layout className="relative bg-white/50 backdrop-blur-lg p-8 rounded-3xl h-64 flex flex-col items-center justify-center border-2 border-brand-tan/20 shadow-lg mb-8">
                    <AnimatePresence>
                        {result ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center"
                            >
                                <h2 className="text-2xl font-bold text-brand-primary mb-2">{result.title}</h2>
                                <p className="text-gray-600 max-w-md mx-auto">{result.description}</p>
                                <Button onClick={fetchIngredients} className="mt-4">
                                    <RefreshCw className="h-4 w-4 ml-2" />
                                    ساخت یک معجون دیگر
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div key="cauldron" className="text-center text-gray-400">
                                <Wand2 className="h-12 w-12 mx-auto mb-2" />
                                <p className="font-semibold">دو ماده را برای ترکیب کردن انتخاب کن</p>
                                <div className="flex justify-center gap-4 mt-4">
                                    <div className={`w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center text-3xl ${selected[0] ? 'bg-brand-cream border-brand-primary' : 'bg-gray-100'}`}>
                                        {selected[0]?.icon}
                                    </div>
                                    <div className="text-3xl self-center text-gray-300">+</div>
                                    <div className={`w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center text-3xl ${selected[1] ? 'bg-brand-cream border-brand-primary' : 'bg-gray-100'}`}>
                                        {selected[1]?.icon}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Ingredients Area */}
                {isLoading ? (
                    <div className="text-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin text-brand-primary mx-auto" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {ingredients.map((ingredient, index) => (
                            <motion.div
                                key={ingredient.name}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                onClick={() => handleSelect(ingredient)}
                                className={`cursor-pointer transition-all duration-300 ${selected.includes(ingredient) ? 'opacity-30 scale-95' : 'hover:scale-105'}`}
                            >
                                <Card className="h-full text-center shadow-md hover:shadow-xl">
                                    <CardContent className="p-6">
                                        <div className="text-5xl mb-4">{ingredient.icon}</div>
                                        <h3 className="font-bold text-lg text-brand-primary">{ingredient.name}</h3>
                                        <p className="text-sm text-gray-500 mt-2">{ingredient.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PotionMixerPage;