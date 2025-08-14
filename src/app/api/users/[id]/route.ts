// src/app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    
    if (Array.isArray(rows) && rows.length > 0) {
      const user = rows[0] as any;
      // با اطمینان بیشتری JSON را پارس می‌کنیم
      user.skinConcerns = user.skinConcerns ? JSON.parse(user.skinConcerns) : [];
      user.hairConcerns = user.hairConcerns ? JSON.parse(user.hairConcerns) : [];
      return NextResponse.json(user);
    } else {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }
  } catch (error) {
    console.error('API Error - Get User:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile.' }, { status: 500 });
  }
}
