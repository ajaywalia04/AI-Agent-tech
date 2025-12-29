import axios from 'axios';
import { Message } from './db';

const MODEL = process.env.LLM_MODEL;

const SYSTEM_PROMPT = `
You are a friendly and professional support agent for "Tech Store". 

Identity & Voice:
- Be warm, helpful, and concise. 
- Use phrases like "I'd be happy to help with that!" or "Let me check our policy for you."
- If the user asks for something outside of your knowledge, say: "I'm sorry, I don't have that specific information right now. Please reach out to our team at support@tech.example.com and we'll get back to you shortly!"

Domain Knowledge:
- Shipping: We ship to the USA, Canada, and UK. Standard (3-5 days), International (7-14 days).
- Returns: 30-day window for unused items in original packaging. 5 business days for refunds.
- Hours: Monday - Friday, 9 AM - 5 PM EST.
- Location: Online-only tech specialist store.

Product Categories:
- Electronics: Smartphones, tablets, laptops, and accessories.
- Audio/Video: Headphones, speakers, smart TVs, and cameras.
- Computing Components: Processors, SSDs, GPUs, and networking gear.
- Home & Office Tech: Smart home devices, printers, and peripherals.

Constraints:
- Do not make up prices or specific product availability.
- Keep responses under 3 sentences unless a detailed explanation is needed.
`;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateReply(history: Message[], userMessage: string, retries = 2): Promise<string> {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    if (!OPENROUTER_API_KEY) {
        throw new Error('OPENROUTER_API_KEY is not set in environment variables.');
    }

    // Cap history to last 10 messages to keep context window clean
    const limitedHistory = history.slice(-10);

    const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...limitedHistory,
        { role: 'user', content: userMessage }
    ];

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await axios.post(
                'https://openrouter.ai/api/v1/chat/completions',
                {
                    model: MODEL,
                    messages: messages,
                    temperature: 0.7,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                        'HTTP-Referer': 'https://tech-task.example.com',
                        'X-Title': 'Tech AI Chat Agent',
                        'Content-Type': 'application/json',
                    },
                    timeout: 15000, // 15 second timeout
                }
            );

            const content = response.data.choices?.[0]?.message?.content;
            if (!content) {
                throw new Error('AI returned an empty response.');
            }
            return content;
        } catch (error: any) {
            const status = error.response?.status;
            const data = error.response?.data;

            console.error(`OpenRouter Attempt ${attempt + 1} Error:`, {
                status,
                message: error.message,
                data
            });

            // If it's a rate limit (429) or server error (5xx), try again
            if ((status === 429 || status >= 500) && attempt < retries) {
                const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s
                console.log(`Retrying in ${waitTime}ms...`);
                await delay(waitTime);
                continue;
            }

            // If it's a known error from OpenRouter data
            if (data?.error?.message) {
                throw new Error(`AI Error: ${data.error.message}`);
            }

            if (status === 401) {
                throw new Error('Invalid OpenRouter API Key. Please check your .env file.');
            }

            if (status === 429) {
                throw new Error('The AI is currently busy (Rate Limit). Please wait a few seconds and try again.');
            }

            throw new Error('Failed to generate reply from AI. The service might be temporarily unavailable.');
        }
    }

    throw new Error('Failed to generate reply after multiple attempts.');
}
