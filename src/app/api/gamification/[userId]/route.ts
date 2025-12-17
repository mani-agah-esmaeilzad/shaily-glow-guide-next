import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET: دریافت اطلاعات گیمیفیکیشن کاربر
export async function GET(request: Request, { params }: { params: { userId: string } }) {
    const { userId } = params;

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    try {
        const { rows } = await pool.query('SELECT * FROM user_gamification WHERE userId = $1', [userId]);

        // اگر رکوردی برای کاربر وجود نداشت، یکی برای او ایجاد می‌کنیم
        if (rows.length === 0) {
            await pool.query(
                'INSERT INTO user_gamification (userId, points, streak, lastCompletedDate) VALUES ($1, 0, 0, NULL)',
                [userId]
            );
            return NextResponse.json({ userId, points: 0, streak: 0, lastCompletedDate: null });
        }

        return NextResponse.json(rows[0]);

    } catch (error: any) {
        console.error('API Error - Get Gamification:', error);
        return NextResponse.json({ error: 'Failed to fetch gamification data.', details: error.message }, { status: 500 });
    }
}

// POST: آپدیت کردن امتیاز و استریک کاربر پس از تکمیل تسک
export async function POST(request: Request, { params }: { params: { userId: string } }) {
    const { userId } = params;

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    try {
        const { rows } = await pool.query('SELECT * FROM user_gamification WHERE userId = $1', [userId]);

        let stats;
        if (rows.length === 0) {
            stats = { userId, points: 0, streak: 0, lastCompletedDate: null };
            await pool.query('INSERT INTO user_gamification (userId) VALUES ($1)', [userId]);
        } else {
            stats = rows[0];
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString().split('T')[0];

        const lastCompleted = stats.lastCompletedDate ? new Date(stats.lastCompletedDate) : null;
        if (lastCompleted) {
            lastCompleted.setHours(0, 0, 0, 0);
        }

        // اگر امروز هنوز امتیازی نگرفته باشد
        if (!lastCompleted || lastCompleted.getTime() !== today.getTime()) {
            stats.points += 5; // **منطق جدید:** ۵ امتیاز برای تکمیل کل روتین روز

            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);

            if (lastCompleted && lastCompleted.getTime() === yesterday.getTime()) {
                stats.streak += 1;
            } else {
                stats.streak = 1;
            }

            stats.lastCompletedDate = todayStr;

            // ذخیره اطلاعات جدید در جدول اصلی
            await pool.query(
                'UPDATE user_gamification SET points = $1, streak = $2, lastCompletedDate = $3 WHERE userId = $4',
                [stats.points, stats.streak, stats.lastCompletedDate, userId]
            );

            // ذخیره امتیاز امروز در جدول گزارش‌ها برای نمودار
            await pool.query(
                `INSERT INTO daily_gamification_logs (userId, logDate, pointsEarned)
                 VALUES ($1, $2, 5)
                 ON CONFLICT (userId, logDate)
                 DO UPDATE SET pointsEarned = daily_gamification_logs.pointsEarned + EXCLUDED.pointsEarned`,
                [userId, todayStr]
            );
        }

        return NextResponse.json(stats);

    } catch (error: any) {
        console.error('API Error - Update Gamification:', error);
        return NextResponse.json({ error: 'Failed to update gamification data.', details: error.message }, { status: 500 });
    }
}
