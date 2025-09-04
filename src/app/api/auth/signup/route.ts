import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const {
      mobile, password,
      firstName, lastName, // دریافت نام و نام خانوادگی
      avatarUrl, // دریافت آدرس آواتار
      ...restOfData // بقیه داده‌های آنالیز پوست
    } = await request.json();

    if (!mobile || !password || !firstName) {
      return NextResponse.json({ error: 'نام، شماره موبایل و رمز عبور الزامی است.' }, { status: 400 });
    }

    const [existingUsers]: any[] = await pool.execute('SELECT id FROM users WHERE mobile = ?', [mobile]);
    if (existingUsers.length > 0) {
      return NextResponse.json({ error: 'کاربری با این شماره موبایل از قبل وجود دارد.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const fullName = `${firstName} ${lastName || ''}`.trim(); // ترکیب نام و نام خانوادگی

    const query = `
      INSERT INTO users (
        id, mobile, password, 
        name, avatarUrl, 
        age, gender, comedones, redPimples, fineLines, foreheadNose, sideNose, cheeks
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.execute(query, [
      userId,
      mobile,
      hashedPassword,
      fullName, // ذخیره نام کامل
      avatarUrl, // ذخیره آدرس آواتار
      restOfData.age,
      restOfData.gender,
      restOfData.comedones,
      restOfData.redPimples,
      restOfData.fineLines,
      restOfData.foreheadNose,
      restOfData.sideNose,
      restOfData.cheeks
    ]);

    return NextResponse.json({ message: 'کاربر با موفقیت ثبت‌نام شد.', userId }, { status: 201 });

  } catch (error: any) {
    console.error('API Error - Signup:', error);
    return NextResponse.json({ error: 'ثبت‌نام با خطا مواجه شد.', details: error.message }, { status: 500 });
  }
}