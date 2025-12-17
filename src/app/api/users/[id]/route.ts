// src/app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

const parseArrayField = (value: any) => {
  if (!value) return [];
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  }
  return Array.isArray(value) ? value : [];
};

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (!rows.length) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const user = rows[0] as any;
    user.skinConcerns = parseArrayField(user.skinConcerns ?? user.skinconcerns);
    user.hairConcerns = parseArrayField(user.hairConcerns ?? user.hairconcerns);

    return NextResponse.json(user);
  } catch (error) {
    console.error('API Error - Get User:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile.' }, { status: 500 });
  }
}
