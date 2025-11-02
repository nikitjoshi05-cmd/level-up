import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyD3AkyoVKYe8QJ09NiMYeadGmyRZ9y3Jow';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { weekAverage, completedHabits } = await request.json();

    if (typeof weekAverage !== 'number') {
      return NextResponse.json(
        { error: 'Week average is required' },
        { status: 400 }
      );
    }

    const habitsText = Array.isArray(completedHabits)
      ? completedHabits.slice(0, 5).join(', ')
      : 'Various habits consistently';

    const prompt = `A user achieved a weekly average of ${weekAverage}/100 points and has been consistently completing: ${habitsText}.

Generate a personalized reward recommendation that:
- Celebrates their achievement
- Suggests a specific, enjoyable reward (not food unless specifically requested)
- Is appropriate for their high performance
- Keeps it to 1-2 sentences

Make it feel special and personalized.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const recommendation = result.response.text() || "You've earned a relaxing evening — maybe watch that movie you've been saving!";

    return NextResponse.json({ recommendation });
  } catch (error) {
    console.error('Reward AI error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendation. Please check your API key.' },
      { status: 500 }
    );
  }
}
