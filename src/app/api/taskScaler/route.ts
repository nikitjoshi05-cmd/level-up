import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyD3AkyoVKYe8QJ09NiMYeadGmyRZ9y3Jow';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { weeklyData, currentWeights } = await request.json();

    if (!weeklyData || !Array.isArray(weeklyData)) {
      return NextResponse.json(
        { error: 'Weekly data is required' },
        { status: 400 }
      );
    }

    // Calculate average scores per category
    const categoryAverages: Record<string, number> = {};
    weeklyData.forEach((day: any) => {
      Object.entries(day.categories || {}).forEach(([cat, points]: [string, any]) => {
        if (!categoryAverages[cat]) categoryAverages[cat] = 0;
        categoryAverages[cat] += points;
      });
    });

    const numDays = weeklyData.length || 1;
    Object.keys(categoryAverages).forEach((cat) => {
      categoryAverages[cat] = categoryAverages[cat] / numDays;
    });

    const lowCategories = Object.entries(categoryAverages)
      .filter(([_, avg]) => avg < 15)
      .map(([name]) => name);

    const currentWeightsText = Object.entries(currentWeights || {})
      .map(([name, weight]) => `${name}: ${weight} points`)
      .join(', ');

    const prompt = `Analyze weekly habit tracker performance and suggest weight adjustments.

Current Category Weights: ${currentWeightsText}
Categories with Low Scores (<15 avg): ${lowCategories.join(', ') || 'None'}

Generate a JSON response with:
- "adjustments": object mapping category names to new point values (suggest small increases of 2-5 points for low categories)
- "message": a short motivational message explaining the changes (1 sentence)

Keep total weight around 100. Only adjust categories that need a boost. Return valid JSON only.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Try to extract JSON from response
    let parsed: { adjustments: Record<string, number>; message: string };
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch {
      parsed = {
        adjustments: {},
        message: 'Weekly recalibration complete. Focus on consistency!',
      };
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Task Scaler error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze performance. Please check your API key.' },
      { status: 500 }
    );
  }
}
