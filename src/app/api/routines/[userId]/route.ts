// src/app/api/routines/[userId]/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// این خط کش را غیرفعال می‌کند و همیشه اطلاعات تازه را برمی‌گرداند
export const dynamic = 'force-dynamic';

// دریافت روتین یک کاربر
export async function GET(request: Request, { params }: { params: { userId: string } }) {
    const { userId } = params;
    try {
        const [rows] = await pool.execute('SELECT * FROM routines WHERE userId = ?', [userId]);

        if (Array.isArray(rows) && rows.length > 0) {
            const routine = rows[0] as { userId: string, tasks: string };
            return NextResponse.json({ ...routine, tasks: JSON.parse(routine.tasks || '[]') });
        } else {
            return NextResponse.json({ userId, tasks: [] }); 
        }
    } catch (error: any) {
        console.error('API Error - Get Routine:', error);
        return NextResponse.json({ 
            error: 'Failed to fetch routine.',
            details: error.message 
        }, { status: 500 });
    }
}

// ایجاد یا به‌روزرسانی روتین یک کاربر (منطق جدید)
export async function POST(request: Request, { params }: { params: { userId: string } }) {
    const { userId } = params;
    const { tasks } = await request.json();

    try {
        console.log(`Attempting to update routine for user: ${userId}`);

        // 1. ابتدا بررسی می‌کنیم که آیا روتینی برای این کاربر وجود دارد یا نه
        const [existing] = await pool.execute('SELECT userId FROM routines WHERE userId = ?', [userId]);

        let query = '';
        if (Array.isArray(existing) && existing.length > 0) {
            // اگر وجود داشت، آن را UPDATE می‌کنیم
            console.log(`Routine found for user ${userId}. Updating...`);
            query = `UPDATE routines SET tasks = ? WHERE userId = ?`;
            const [result] = await pool.execute(query, [JSON.stringify(tasks), userId]);
            console.log('Routine UPDATE result:', result);
        } else {
            // اگر وجود نداشت، آن را INSERT می‌کنیم
            console.log(`No routine found for user ${userId}. Inserting...`);
            query = `INSERT INTO routines (userId, tasks) VALUES (?, ?)`;
            const [result] = await pool.execute(query, [userId, JSON.stringify(tasks)]);
            console.log('Routine INSERT result:', result);
        }
        
        return NextResponse.json({ message: 'Routine updated successfully.' });

    } catch (error: any) {
        console.error('API Error - Update Routine:', error);
        return NextResponse.json({ 
            error: 'Failed to update routine.',
            details: error.message
        }, { status: 500 });
    }
}
