import { NextResponse } from 'next/server';

// این خط به TypeScript می‌گوید که این متغیر در محیط نهایی وجود خواهد داشت
declare const generic_reminders: any;

export async function POST(request: Request) {
    try {
        const { time, type } = await request.json();

        if (!time || !type) {
            return NextResponse.json({ error: 'Time and type are required.' }, { status: 400 });
        }

        const title = `🔔 وقت روتین ${type} شماست!`;
        const timeWithSeconds = `${time}:00`;

        let reminderResult;

        // بررسی می‌کنیم که آیا در محیط توسعه محلی هستیم یا نه
        if (process.env.NODE_ENV === 'development') {
            // --- شبیه‌سازی در محیط توسعه (Local) ---
            console.log(`[DEVELOPMENT MODE] Mocking reminder for: ${title} at ${timeWithSeconds}`);

            // یک پاسخ موفقیت‌آمیز شبیه‌سازی شده برمی‌گردانیم
            reminderResult = {
                message: 'Reminder successfully mocked in development.',
                reminders: [{ id: 'mock_id_123', title: title, due_date: { time_of_day: timeWithSeconds } }]
            };

        } else {
            // --- اجرای واقعی در محیط اصلی (Production) ---
            // ابتدا بررسی می‌کنیم که ابزار در دسترس است یا خیر
            if (typeof generic_reminders === 'undefined') {
                throw new Error('generic_reminders tool is not available in this environment.');
            }

            reminderResult = await generic_reminders.create_reminder({
                title: title,
                time_of_day: timeWithSeconds,
                repeat_interval_unit: 'DAY',
                repeat_every_n: 1,
            });
        }

        if (reminderResult && reminderResult.reminders) {
            return NextResponse.json({ message: 'Reminder operation successful!', data: reminderResult });
        } else {
            throw new Error(reminderResult.message || 'Failed to create reminder.');
        }

    } catch (error: any) {
        console.error('API Error - Create Reminder:', error);
        return NextResponse.json({ error: 'Failed to set reminder.', details: error.message }, { status: 500 });
    }
}