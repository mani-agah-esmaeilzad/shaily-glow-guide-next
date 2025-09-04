// src/app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key';

interface JwtPayload {
  userId: string;
}

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token');

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    // Verify the token
    const decoded = jwt.verify(token.value, JWT_SECRET) as JwtPayload;

    // Fetch user data from the database
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [decoded.userId]);

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const user = rows[0] as any;

    // Parse JSON strings back into arrays, checking if they exist
    user.skinConcerns = user.skinConcerns ? JSON.parse(user.skinConcerns) : [];
    user.hairConcerns = user.hairConcerns ? JSON.parse(user.hairConcerns) : [];

    // Return user info (without the password)
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });

  } catch (error) {
    console.error('API Error - Me:', error);
    // If token is invalid or expired, jwt.verify will throw an error
    return NextResponse.json({ error: 'Invalid token or session expired.' }, { status: 401 });
  }
}