// src/app/api/users/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, age, job, gender, skinType, skinConcerns, hairType, hairConcerns } = body;

    if (!id || !name) {
      return NextResponse.json({ error: 'User ID and name are required.' }, { status: 400 });
    }

    console.log('Attempting to create user with ID:', id); // لاگ برای دیباگ

    const query = `
      INSERT INTO users (id, name, age, job, gender, skinType, skinConcerns, hairType, hairConcerns)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    
    await pool.query(query, [
      id, 
      name, 
      age, 
      job, 
      gender, 
      skinType, 
      JSON.stringify(skinConcerns || []), // اطمینان از اینکه مقدار null نیست
      hairType, 
      JSON.stringify(hairConcerns || []) // اطمینان از اینکه مقدار null نیست
    ]);

    console.log('User created successfully with ID:', id); // لاگ موفقیت
    return NextResponse.json({ message: 'User profile created successfully.' }, { status: 201 });

  } catch (error: any) {
    // لاگ کردن خطای کامل MySQL
    console.error('API Error - Create User:', error);
    return NextResponse.json({ 
      error: 'Failed to create user profile.',
      details: error.message // ارسال پیام خطا به فرانت‌اند
    }, { status: 500 });
  }
}
