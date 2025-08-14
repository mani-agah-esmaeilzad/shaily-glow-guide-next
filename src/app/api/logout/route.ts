// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        // حذف کوکی احراز هویت
        cookies().set('auth_token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            expires: new Date(0), // Set expiration date to the past
            path: '/',
        });

        return NextResponse.json({ message: 'Logout successful.' });
    } catch (error: any) {
        console.error('API Error - Logout:', error);
        return NextResponse.json({ error: 'Failed to logout.' }, { status: 500 });
    }
}
