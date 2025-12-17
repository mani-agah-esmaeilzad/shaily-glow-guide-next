import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
    const { slug } = params;
    try {
        const { rows } = await pool.query('SELECT * FROM posts WHERE slug = $1', [slug]);
        if (rows.length === 0) {
            return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
        }
        return NextResponse.json(rows[0]);
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch post.' }, { status: 500 });
    }
}
