// src/app/api/chat/route.ts
import OpenAI from 'openai';
import { portfolioData } from 'src/lib';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

const SYSTEM_PROMPT = `You are ${portfolioData.name}'s AI portfolio assistant on his personal website. You help visitors learn about his skills, experience, and projects.

RULES:
- Be friendly, professional, and concise
- Answer in the SAME LANGUAGE the user writes in (Arabic or English)
- If the user writes in Egyptian Arabic, respond in Egyptian Arabic
- Only answer questions related to the portfolio, skills, experience, projects, and contact info
- If someone asks something completely unrelated, politely redirect them
- Keep responses under 120 words unless the user asks for detail
- If asked about availability, mention he is available for work
- If asked how to contact, provide WhatsApp and email
- Do NOT make up information not in the portfolio data below
- You can use emoji sparingly

PORTFOLIO DATA:
- Name: ${portfolioData.name}
- Role: ${portfolioData.role}
- Experience: ${portfolioData.experience}
- Email: ${portfolioData.email}
- Phone: ${portfolioData.phone}
- Tech Stack: ${portfolioData.stack?.join(', ')}
- Projects: ${portfolioData.projects}
- Experience Timeline: ${portfolioData.detailedExperience?.join(' → ')}
- Social Links: ${portfolioData.socials?.map(s => `${s.platform}: ${s.link}`).join(', ')}
- Education: ${portfolioData.education?.join(', ') || 'Web Development Diploma from Route Egypt Academy'}

ARABIC CONTEXT:
- If user says "اهلا" or "مرحبا", greet them warmly in Arabic
- Use Egyptian dialect when responding in Arabic
- Keep tech terms in English even in Arabic responses`;

// ─── Rate limiter ───
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);
  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    return false;
  }
  limit.count++;
  return limit.count > 20;
}

export async function POST(req: Request) {
  const encoder = new TextEncoder();

  function errorStream(message: string) {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(message));
        controller.close();
      },
    });
    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  try {
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('❌ OPENROUTER_API_KEY is not set');
      return errorStream('⚠️ Chat is not configured. Please add OPENROUTER_API_KEY to .env.local');
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return errorStream('No messages provided.');
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    if (isRateLimited(ip)) {
      return errorStream('⏳ Too many messages. Please wait a moment.');
    }

    // Filter out welcome messages
    const filtered = messages.filter(
      (m: { content: string }) =>
        m.content !== "👋 Hi! I'm Hossam's AI assistant. Ask me about his skills, projects, or experience!" &&
        m.content !== 'Hello, How can i help you ?',
    );

    console.log('📤 Sending to OpenRouter:', filtered[filtered.length - 1]?.content);

    const response = await openai.chat.completions.create({
      model: 'anthropic/claude-haiku-4.5', // ✅ Free on OpenRouter
      stream: true,
      max_tokens: 500,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...filtered.map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ],
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              console.log('📥 Chunk:', content.substring(0, 50));
              controller.enqueue(encoder.encode(content));
            }
          }
        } catch (err) {
          console.error('❌ Stream error:', err);
          controller.enqueue(encoder.encode('\n\nResponse interrupted. Please try again.'));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('❌ Chat error:', (error as Error)?.message);
    return errorStream("Sorry, I'm having trouble right now. Please try again.");
  }
}