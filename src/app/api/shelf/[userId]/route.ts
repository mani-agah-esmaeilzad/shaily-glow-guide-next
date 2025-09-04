import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// دریافت تمام محصولات یک کاربر
export async function GET(request: Request, { params }: { params: { userId: string } }) {
    const { userId } = params;
    try {
        const [rows] = await pool.execute('SELECT * FROM user_products WHERE userId = ? ORDER BY created_at DESC', [userId]);
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
        
        const [result] : any = await pool.execute(
            'INSERT INTO user_products (userId, productName, productType, brand, openedDate, notes) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, productName, productType, brand, openedDate || null, notes]
        );

        return NextResponse.json({ message: 'Product added successfully.', insertId: result.insertId }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to add product.' }, { status: 500 });
    }
}