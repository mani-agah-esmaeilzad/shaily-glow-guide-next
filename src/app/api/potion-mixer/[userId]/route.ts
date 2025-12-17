import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { GoogleGenerativeAI } from '@google/generative-ai';

const parseArrayField = (value: any) => {
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

// این تابع یک prompt برای هوش مصنوعی می‌سازد تا مواد اولیه را تولید کند
const generateIngredientsPrompt = (userProfile: any, dailyLog: any): string => {
    const skinConcerns = parseArrayField(userProfile.skinConcerns ?? userProfile.skinconcerns);
    const hairConcerns = parseArrayField(userProfile.hairConcerns ?? userProfile.hairconcerns);

    let logInfo = "The user did not log their lifestyle today.";
    if (dailyLog) {
        logInfo = `
    - Today's Sleep: ${dailyLog.sleepHours} hours
    - Today's Water Intake: ${dailyLog.waterIntake} glasses
    - Today's Stress Level: ${dailyLog.stressLevel}/5
    `;
    }

    return `
    You are "Shaily", a creative AI skincare assistant.
    Your task is to suggest 3 fun, metaphorical "potion ingredients" for a user based on their profile and their daily log.
    The content must be in Persian (Farsi).

    Here is the user's profile:
    - Skin Concerns: ${skinConcerns.length ? skinConcerns.join(', ') : 'None'}
    - Hair Concerns: ${hairConcerns.length ? hairConcerns.join(', ') : 'None'}
    
    Here is the user's log for today:
    ${logInfo}

    Based on this data, generate an array of 3 JSON objects. Each object represents an ingredient and must have these keys:
    1. "name": (string) A creative, fun name for the ingredient in Persian (e.g., "اشک اژدهای آبرسان", "غبار نور مهتاب").
    2. "description": (string) A short, magical description of what it does, linking it to a real skincare concept, in Persian.
    3. "icon": (string) A single, relevant emoji.
    4. "actual_ingredient": (string) The real-world skincare ingredient it represents, in Persian (e.g., "هیالورونیک اسید", "عصاره بابونه").

    Make the ingredients relevant. If stress is high, suggest calming ingredients. If sleep is low, suggest revitalizing ones.

    Example output format:
    [
      {
        "name": "شبنم قله سبلان",
        "description": "یک قطره از این شبنم، تشنگی پوست خسته را برطرف کرده و آن را عمیقا آبرسانی می‌کند.",
        "icon": "💧",
        "actual_ingredient": "هیالورونیک اسید"
      }
    ]

    Now, generate a new, personalized set of 3 ingredients for the user above. Return ONLY the JSON array.
  `;
};

export async function GET(request: Request, { params }: { params: { userId: string } }) {
    const { userId } = params;
    try {
        // Fetch user profile
        const { rows: userRows } = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (userRows.length === 0) {
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        }
        const userProfile = userRows[0];

        // Fetch today's log
        const today = new Date().toISOString().split('T')[0];
        const { rows: logRows } = await pool.query(
            'SELECT * FROM daily_logs WHERE userId = $1 AND logDate = $2',
            [userId, today]
        );
        const dailyLog = logRows.length > 0 ? logRows[0] : null;

        // Call AI to generate ingredients
        const apiKey = "AIzaSyA_uuYZJDhggbXUYemarNz5K6l3XbKkdSA";
        if (!apiKey) throw new Error("Gemini API key not found!");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = generateIngredientsPrompt(userProfile, dailyLog);
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const ingredients = JSON.parse(cleanedText);

        return NextResponse.json(ingredients);
    } catch (error: any) {
        console.error("Potion Mixer API Error:", error);
        return NextResponse.json({ error: 'Failed to generate ingredients.', details: error.message }, { status: 500 });
    }
}
