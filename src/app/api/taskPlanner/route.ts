import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyD3AkyoVKYe8QJ09NiMYeadGmyRZ9y3Jow';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { missedHabits } = await request.json();

    if (!Array.isArray(missedHabits) || missedHabits.length === 0) {
      return NextResponse.json(
        { error: 'Missed habits array is required' },
        { status: 400 }
      );
    }

    const habitsText = missedHabits
      .map((h: { name: string; days: number }) => `${h.name} missed ${h.days} days`)
      .join(', ');

    const prompt = `A user is struggling with these habits: ${habitsText}

Generate exactly 3 short, actionable micro-habit suggestions (1 sentence each) to help them improve.
Each suggestion should be:
- Specific and achievable
- Start with "Try..."
- Focus on small, sustainable changes
- Directly address the missed habits

Return ONLY the 3 suggestions, one per line, starting with "Try..."`;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse suggestions from response
    const suggestions = responseText
      .split('\n')
      .filter((line) => line.trim().startsWith('Try') || line.trim().match(/^\d+\./))
      .map((line) => line.trim().replace(/^\d+\.\s*/, '').replace(/^-\s*/, ''))
      .filter((line) => line.length > 0)
      .slice(0, 3);

    // Fallback if parsing fails
    if (suggestions.length === 0) {
      return NextResponse.json({
        suggestions: [
          'Try setting a specific time reminder for your missed habits',
          'Try breaking down the habit into smaller 5-minute actions',
          'Try linking the habit to an existing daily routine',
        ],
      });
    }

    return NextResponse.json({ suggestions: suggestions.slice(0, 3) });
  } catch (error) {
    console.error('Task Planner error:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestions. Please check your API key.' },
      { status: 500 }
    );
  }
}
