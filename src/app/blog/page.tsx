'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    // coverImageUrl: string;
    authorName: string;
    publishedAt: string;
}

const BlogPage = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('/api/blog');
                if (res.ok) {
                    const data = await res.json();
                    setPosts(data);
                }
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-cream">
                <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-cream to-brand-beige p-4 md:p-8" dir="rtl">
            <div className="max-w-5xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-brand-primary">وبلاگ شایلی</h1>
                        <p className="text-gray-600 mt-4">جدیدترین مقالات و نکات علمی مراقبت از پوست و مو</p>
                    </div>
                    <Link href="/">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 ml-2" />
                            بازگشت به داشبورد
                        </Button>
                    </Link>
                </header>

                <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map(post => (
                        <Link key={post.id} href={`/blog/${post.slug}`}>
                            <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-xl hover:-translate-y-2 duration-300">
                                
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold leading-snug">{post.title}</CardTitle>
                                    <CardDescription className="text-xs pt-1">
                                        نوشته {post.authorName} در {new Date(post.publishedAt).toLocaleDateString('fa-IR')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-gray-600 text-sm">{post.excerpt}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </main>
            </div>
        </div>
    );
};

export default BlogPage;