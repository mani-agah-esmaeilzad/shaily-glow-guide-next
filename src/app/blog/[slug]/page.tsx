'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Loader2, Calendar, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Post {
    title: string;
    content: string;
    coverImageUrl: string;
    authorName: string;
    publishedAt: string;
}

const BlogPostPage = ({ params }: { params: { slug: string } }) => {
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!params.slug) return;
        const fetchPost = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/blog/${params.slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setPost(data);
                }
            } catch (error) {
                console.error("Failed to fetch post:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPost();
    }, [params.slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-cream">
                <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold">مقاله پیدا نشد</h2>
                <Link href="/blog" className="mt-4"><Button>بازگشت به وبلاگ</Button></Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-cream to-brand-beige py-8" dir="rtl">
            <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 md:p-8 lg:p-12">
                <header className="mb-8">
                    <Link href="/blog" className="inline-block mb-6">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 ml-2" />
                            بازگشت به لیست مقالات
                        </Button>
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-brand-primary leading-tight">{post.title}</h1>
                    <div className="flex items-center gap-6 text-sm text-gray-500 mt-4">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{post.authorName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(post.publishedAt).toLocaleDateString('fa-IR')}</span>
                        </div>
                    </div>
                </header>

                <article className="prose lg:prose-xl max-w-none text-right mx-auto">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </article>
            </div>
        </div>
    );
};

export default BlogPostPage;