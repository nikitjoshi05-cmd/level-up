import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyD3AkyoVKYe8QJ09NiMYeadGmyRZ9y3Jow';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { habitData } = await request.json();

    if (!habitData || typeof habitData !== 'object') {
      return NextResponse.json(
        { error: 'Habit data is required' },
        { status: 400 }
      );
    }

    const { totalDays, averageScore, categoryTrends, recentTrend } = habitData;

    const trendsText = Object.entries(categoryTrends || {})
      .map(([name, change]: [string, any]) => `${name}: ${change > 0 ? '+' : ''}${change}%`)
      .join(', ');

    const prompt = `Generate an AI insights summary for a habit tracker user based on their ${totalDays || 30}-day data.

Key Metrics:
- Average Daily Score: ${averageScore || 0}/100
- Category Trends: ${trendsText || 'No trends available'}
- Recent Performance: ${recentTrend || 'stable'}

Create a JSON response with:
- "summary": A 2-3 sentence motivational summary highlighting key wins and areas for growth
- "highlight": One standout achievement (1 sentence)
- "recommendation": One actionable tip for continued improvement (1 sentence)

Return valid JSON only.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let parsed: {
      summary: string;
      highlight: string;
      recommendation: string;
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
        summary: 'Keep tracking your habits consistently. Small daily actions lead to big changes!',
        highlight: `You've been maintaining an average score of ${averageScore || 0} points.`,
        recommendation: 'Focus on one category where you can improve by just 5 points daily.',
      };
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Insights AI error:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights. Please check your API key.' },
      { status: 500 }
    );
  }
}
