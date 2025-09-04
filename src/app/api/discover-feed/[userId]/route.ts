import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { GoogleGenerativeAI } from '@google/generative-ai';

// این تابع یک prompt برای هوش مصنوعی می‌سازد تا کارت‌های فید را تولید کند
const generateDiscoveryFeedPrompt = (userProfile: any): string => {
    return `
    You are "Shaily", a friendly and knowledgeable AI skincare and haircare assistant.
    Your task is to generate a personalized "Daily Discovery Feed" for a user.
    The feed should consist of 5 diverse and engaging content cards in JSON format.
    The content must be in Persian (Farsi).

    Here is the user's profile:
    - Gender: ${userProfile.gender || 'Not specified'}
    - Age Range: ${userProfile.age || 'Not specified'}
    - Skin Concerns: ${userProfile.skinConcerns ? JSON.parse(userProfile.skinConcerns).join(', ') : 'None'}
    - Hair Concerns: ${userProfile.hairConcerns ? JSON.parse(userProfile.hairConcerns).join(', ') : 'None'}
    - Skin Analysis: 
        - Comedones: ${userProfile.comedones || 'Not specified'}
        - Red Pimples: ${userProfile.redPimples || 'Not specified'}
        - Fine Lines: ${userProfile.fineLines || 'Not specified'}

    Generate an array of 5 JSON objects, each representing a card. Each object must have these keys:
    1. "type": (string) Choose one from: "IngredientSpotlight", "MythBuster", "LifestyleTip", "MicroChallenge", "SeasonalTip".
    2. "title": (string) A short, catchy title in Persian.
    3. "content": (string) The main text of the card, 1-2 sentences long, in Persian.
    4. "icon": (string) A relevant emoji.

    Make the content highly relevant to the user's profile. For example, if they have oily skin, talk about ingredients for oily skin. If it's winter, give a seasonal tip for dry weather.

    Example output format:
    [
      {
        "type": "IngredientSpotlight",
        "title": "آشنایی با نیاسینامید",
        "content": "این ماده شگفت‌انگیز به کنترل چربی پوست و کاهش منافذ باز کمک می‌کنه. برای پوست‌های مستعد جوش عالیه!",
        "icon": "🧪"
      },
      {
        "type": "MythBuster",
        "title": "باور غلط: شکلات باعث جوش میشه",
        "content": "تحقیقات علمی ارتباط مستقیمی بین شکلات و آکنه پیدا نکردن. اما رژیم غذایی با قند بالا می‌تونه التهاب رو بیشتر کنه.",
        "icon": "🍫"
      }
    ]

    Now, generate a new, personalized feed for the user above. Return ONLY the JSON array.
  `;
};


export async function GET(request: Request, { params }: { params: { userId: string } }) {
    const { userId } = params;
    try {
        const [userRows]: any[] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
        if (userRows.length === 0) {
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        }
        const userProfile = userRows[0];

        // فراخوانی هوش مصنوعی برای تولید محتوا
        const apiKey = "AIzaSyA_uuYZJDhggbXUYemarNz5K6l3XbKkdSA";
        if (!apiKey) throw new Error("Gemini API key not found!");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = generateDiscoveryFeedPrompt(userProfile);
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // پاکسازی و پارس کردن JSON
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const feedContent = JSON.parse(cleanedText);

        return NextResponse.json(feedContent);
    } catch (error: any) {
        console.error("Feed API Error:", error);
        return NextResponse.json({ error: 'Failed to generate discovery feed.', details: error.message }, { status: 500 });
    }
}