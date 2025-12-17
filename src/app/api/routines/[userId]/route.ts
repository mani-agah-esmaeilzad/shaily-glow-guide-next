// src/app/api/routines/[userId]/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// این خط کش را غیرفعال می‌کند و همیشه اطلاعات تازه را برمی‌گرداند
export const dynamic = 'force-dynamic';

const parseTasks = (value: any) => {
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

// دریافت روتین یک کاربر
export async function GET(request: Request, { params }: { params: { userId: string } }) {
    const { userId } = params;
    try {
        const { rows } = await pool.query('SELECT * FROM routines WHERE userId = $1', [userId]);

        if (Array.isArray(rows) && rows.length > 0) {
            const routine = rows[0] as { userId: string, tasks: any };
            return NextResponse.json({ ...routine, tasks: parseTasks(routine.tasks) });
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
        const { rows: existing } = await pool.query('SELECT userId FROM routines WHERE userId = $1', [userId]);

        let query = '';
        if (Array.isArray(existing) && existing.length > 0) {
            // اگر وجود داشت، آن را UPDATE می‌کنیم
            console.log(`Routine found for user ${userId}. Updating...`);
            query = `UPDATE routines SET tasks = $1 WHERE userId = $2`;
            const result = await pool.query(query, [JSON.stringify(tasks), userId]);
            console.log('Routine UPDATE result:', result);
        } else {
            // اگر وجود نداشت، آن را INSERT می‌کنیم
            console.log(`No routine found for user ${userId}. Inserting...`);
            query = `INSERT INTO routines (userId, tasks) VALUES ($1, $2)`;
            const result = await pool.query(query, [userId, JSON.stringify(tasks)]);
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
