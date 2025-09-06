import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface LogRow extends RowDataPacket {
    logDate: string;
    pointsEarned: number;
}

export async function GET(
    request: Request, 
    { params }: { params: { userId: string } }
) {
    const { userId } = params;
    try {
        
        const [rows] = await pool.execute<LogRow[]>(
            `SELECT logDate, pointsEarned FROM daily_gamification_logs 
             WHERE userId = ? AND logDate >= CURDATE() - INTERVAL 6 DAY 
             ORDER BY logDate ASC`,
            [userId]
        );

        const last7DaysData = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayData = (rows as LogRow[]).find(
                (row) => new Date(row.logDate).toISOString().split('T')[0] === dateStr
            );
            last7DaysData.push({
                date: new Date(dateStr).toLocaleDateString('fa-IR', { weekday: 'short' }),
                points: dayData ? dayData.pointsEarned : 0,            
            });

        }

        return NextResponse.json(last7DaysData);

    } catch (error: any) {

        console.error("Weekly Report API Error:", error);

        return NextResponse.json({ error: 'Failed to fetch weekly report.' }, { status: 500 });

    }
}
