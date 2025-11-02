import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyD3AkyoVKYe8QJ09NiMYeadGmyRZ9y3Jow';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { journalEntry } = await request.json();

    if (!journalEntry || typeof journalEntry !== 'string') {
      return NextResponse.json(
        { error: 'Journal entry is required' },
        { status: 400 }
      );
    }

    const prompt = `Analyze the emotional tone of this journal entry and provide supportive feedback.

Journal Entry: "${journalEntry}"

Respond with JSON containing:
- "mood": one of "positive", "neutral", "negative"
- "emoji": corresponding emoji (😊, 😐, or 😔)
- "response": a supportive 2-3 sentence message with practical advice
- "suggestion": one actionable tip to improve mood/wellbeing

Return valid JSON only.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let parsed: {
      mood: 'positive' | 'neutral' | 'negative';
      emoji: string;
      response: string;
      suggestion: string;
    };

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch {
      parsed = {
        mood: 'neutral',
        emoji: '😐',
        response: 'Thank you for sharing. Keep reflecting and tracking your journey!',
        suggestion: 'Take a moment to practice gratitude or deep breathing.',
      };
    }

    // Validate mood
    if (!['positive', 'neutral', 'negative'].includes(parsed.mood)) {
      parsed.mood = 'neutral';
    }
    if (!parsed.emoji) {
      parsed.emoji = parsed.mood === 'positive' ? '😊' : parsed.mood === 'negative' ? '😔' : '😐';
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Mood Analyzer error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze mood. Please check your API key.' },
      { status: 500 }
    );
  }
}
