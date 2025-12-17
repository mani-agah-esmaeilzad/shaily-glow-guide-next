// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// یک کلید امن برای توکن خود در فایل .env.local تعریف کنید
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key';

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

export async function POST(request: Request) {
  try {
    const { mobile, password } = await request.json();

    if (!mobile || !password) {
      return NextResponse.json({ error: 'Mobile number and password are required.' }, { status: 400 });
    }

    // Find the user by mobile number
    const { rows } = await pool.query('SELECT * FROM users WHERE mobile = $1', [mobile]);

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const user = rows[0] as any;

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    // --- FIX: Parse JSON strings back into arrays ---
    user.skinConcerns = parseArrayField(user.skinConcerns ?? user.skinconcerns);
    user.hairConcerns = parseArrayField(user.hairConcerns ?? user.hairconcerns);
    // ------------------------------------------------

    // Create a JWT token
    const token = jwt.sign({ userId: user.id, mobile: user.mobile }, JWT_SECRET, {
      expiresIn: '7d', // Token expires in 7 days
    });

    // Set the token in an HTTP-only cookie for security
    cookies().set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
  
    // Return user info (without the password)
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });

  } catch (error: any) {
    console.error('API Error - Login:', error);
    return NextResponse.json({ error: 'Failed to login.', details: error.message }, { status: 500 });
  }
}
