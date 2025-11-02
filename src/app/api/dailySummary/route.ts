import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyD3AkyoVKYe8QJ09NiMYeadGmyRZ9y3Jow';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { totalPoints, categoryScores } = await request.json();

    if (typeof totalPoints !== 'number') {
      return NextResponse.json(
        { error: 'Total points is required' },
        { status: 400 }
      );
    }

    const categoryInfo = Object.entries(categoryScores || {})
      .map(([name, points]) => `${name}: ${points} points`)
      .join(', ');

    const prompt = `Generate a motivational daily summary for a habit tracker user.

Today's Score: ${totalPoints}/100 points
Category Breakdown: ${categoryInfo || 'No category data'}

Write a short, encouraging paragraph (2-3 sentences) that:
- Celebrates achievements if score is 70+
- Provides gentle motivation if score is below 70
- Suggests one specific improvement
- Stays positive and supportive

Format as a natural, friendly message.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const summary = result.response.text() || 'Great effort today! Keep going!';

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Daily Summary error:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary. Please check your API key.' },
      { status: 500 }
    );
  }
}
