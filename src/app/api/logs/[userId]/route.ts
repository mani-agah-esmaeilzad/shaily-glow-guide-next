import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
    const { userId } = params;
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    try {
        const [rows] = await pool.execute('SELECT * FROM daily_logs WHERE userId = ? AND logDate = ?', [userId, date]);
        if (Array.isArray(rows) && rows.length > 0) {
            return NextResponse.json(rows[0]);
        }
        return NextResponse.json(null); // No log for this date
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch daily log.' }, { status: 500 });
    }
}

export async function POST(request: Request, { params }: { params: { userId: string } }) {
    const { userId } = params;
    const { logDate, sleepHours, waterIntake, stressLevel } = await request.json();
    try {
        await pool.execute(
            'INSERT INTO daily_logs (userId, logDate, sleepHours, waterIntake, stressLevel) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE sleepHours = VALUES(sleepHours), waterIntake = VALUES(waterIntake), stressLevel = VALUES(stressLevel)',
            [userId, logDate, sleepHours, waterIntake, stressLevel]
        );
        return NextResponse.json({ message: 'Log saved successfully.' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to save daily log.' }, { status: 500 });
    }
}