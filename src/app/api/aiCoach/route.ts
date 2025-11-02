import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Use the provided Gemini API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyD3AkyoVKYe8QJ09NiMYeadGmyRZ9y3Jow';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { message, chatHistory } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const systemPrompt = `You are a motivational life coach helping users build better habits. 
    Be encouraging, practical, and supportive. Keep responses concise (2-3 sentences max). 
    Focus on actionable advice and positive reinforcement.`;

    // Build conversation history
    const conversationHistory = chatHistory?.slice(-10) || []; // Keep last 10 messages
    
    const prompt = `${systemPrompt}\n\nConversation:\n${
      conversationHistory.map((msg: any) => `${msg.role === 'user' ? 'User' : 'Coach'}: ${msg.content}`).join('\n')
    }\n\nUser: ${message}\nCoach:`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('AI Coach error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response. Please check your API key.' },
      { status: 500 }
    );
  }
}
