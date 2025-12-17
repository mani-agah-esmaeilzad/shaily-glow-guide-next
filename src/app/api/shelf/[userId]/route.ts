import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// دریافت تمام محصولات یک کاربر
export async function GET(request: Request, { params }: { params: { userId: string } }) {
    const { userId } = params;
    try {
        const { rows } = await pool.query(
            'SELECT * FROM user_products WHERE userId = $1 ORDER BY created_at DESC',
            [userId]
        );
        return NextResponse.json(rows);
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch products.' }, { status: 500 });
    }
}

// افزودن یک محصول جدید
export async function POST(request: Request, { params }: { params: { userId: string } }) {
    const { userId } = params;
    try {
        const { productName, productType, brand, openedDate, notes } = await request.json();
        if (!productName || !productType) {
            return NextResponse.json({ error: 'Product name and type are required.' }, { status: 400 });
        }
        
        const { rows } = await pool.query(
            `INSERT INTO user_products (userId, productName, productType, brand, openedDate, notes)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id`,
            [userId, productName, productType, brand, openedDate || null, notes || null]
        );

        return NextResponse.json(
            { message: 'Product added successfully.', insertId: rows[0]?.id },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to add product.' }, { status: 500 });
    }
}
