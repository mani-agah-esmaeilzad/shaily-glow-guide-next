import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
    const { userId } = params;
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    try {
        const { rows } = await pool.query('SELECT * FROM daily_logs WHERE userId = $1 AND logDate = $2', [userId, date]);
        if (rows.length > 0) {
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
        await pool.query(
            `INSERT INTO daily_logs (userId, logDate, sleepHours, waterIntake, stressLevel)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (userId, logDate)
             DO UPDATE SET sleepHours = EXCLUDED.sleepHours,
                           waterIntake = EXCLUDED.waterIntake,
                           stressLevel = EXCLUDED.stressLevel`,
            [userId, logDate, sleepHours, waterIntake, stressLevel]
        );
        return NextResponse.json({ message: 'Log saved successfully.' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to save daily log.' }, { status: 500 });
    }
}
