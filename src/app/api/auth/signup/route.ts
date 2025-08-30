// src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const { mobile, password, name, age, job, gender, skinType, skinConcerns, hairType, hairConcerns } = await request.json();

    if (!mobile || !password || !name) {
      return NextResponse.json({ error: 'Mobile number, password, and name are required.' }, { status: 400 });
    }

    // Check if user already exists
    const [existingUsers] = await pool.execute('SELECT id FROM users WHERE mobile = ?', [mobile]);
    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return NextResponse.json({ error: 'User with this mobile number already exists.' }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    const query = `
      INSERT INTO users (id, mobile, password, name, age, job, gender, skinType, skinConcerns, hairType, hairConcerns)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await pool.execute(query, [
      userId,
      mobile,
      hashedPassword,
      name,
      age,
      job,
      gender,
      skinType,
      JSON.stringify(skinConcerns || []),
      hairType,
      JSON.stringify(hairConcerns || [])
    ]);

    return NextResponse.json({ message: 'User registered successfully.', userId }, { status: 201 });

  } catch (error: any) {
    console.error('API Error - Signup:', error);
    return NextResponse.json({ error: 'Failed to register user.', details: error.message }, { status: 500 });
  }
}
