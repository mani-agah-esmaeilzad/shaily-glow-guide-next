import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const { rows } = await pool.query(
            'SELECT id, title, slug, excerpt, coverImageUrl, authorName, publishedAt FROM posts ORDER BY publishedAt DESC'
        );
        return NextResponse.json(rows);
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch posts.' }, { status: 500 });
    }
}
